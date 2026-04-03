/**
 * CheckoutModal — frictionless guest/user checkout modal.
 *
 * Flow:
 *   1. Shipping address form (includes email for all users / guests)
 *   2. Email check: if registered account found → show login nudge banner
 *   3. Payment method selection
 *   4. Order placed → show GuestSignupModal if not logged in
 */
import { useState, useEffect, useRef } from "react";
import { X, LogIn, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { startPayment } from "@/lib/payment";
import { checkEmail as checkEmailAPI, syncSocialUser, type ShippingAddress } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/integrations/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

/* ── Types ───────────────────────────────────────────────────── */

export interface CheckoutItem {
  productId: string;
  backendId?: string | null;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface Props {
  items: CheckoutItem[];
  totalAmount: number;
  onClose: () => void;
  /** Called after cart items should be cleared (e.g. after PayU redirect) */
  onClearCart?: () => void;
  /** Pre-filled from logged-in user — if present we skip guest signup nudge */
  loggedInEmail?: string;
  loggedInName?: string;
  loggedInToken?: string;
}

/* ── Component ───────────────────────────────────────────────── */

const INPUT =
  "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm transition-colors";
const BTN_PRIMARY =
  "w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50";
const BTN_SECONDARY =
  "flex-1 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors";

type Step = "address" | "payment" | "signup_nudge";

export default function CheckoutModal({
  items,
  totalAmount,
  onClose,
  onClearCart,
  loggedInEmail = "",
  loggedInName = "",
  loggedInToken = "",
}: Props) {
  const navigate = useNavigate();

  /* ── Address state ── */
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: loggedInName,
    phone: "",
    email: loggedInEmail,
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  /* ── Email check state ── */
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [showLoginNudge, setShowLoginNudge] = useState(false);
  const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Step & payment ── */
  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD" | "PARTIAL">("ONLINE");
  const [loading, setLoading] = useState(false);

  /* ── Post-order signup nudge ── */
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupMode, setSignupMode] = useState<"prompt" | "form" | "login_form" | "done">("prompt");
  const [loginPassword, setLoginPassword] = useState("");

  /* ── Hydrate name/email from user if available ── */
  useEffect(() => {
    if (loggedInEmail) setAddress((a) => ({ ...a, email: loggedInEmail }));
    if (loggedInName) setAddress((a) => ({ ...a, fullName: loggedInName }));
  }, [loggedInEmail, loggedInName]);

  /* ── Email existence check (debounced) ── */
  const handleEmailChange = (val: string) => {
    setAddress((a) => ({ ...a, email: val }));
    setEmailExists(null);
    setShowLoginNudge(false);

    // Don't check if user is already logged in
    if (loggedInToken) return;

    if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return;

    emailDebounceRef.current = setTimeout(async () => {
      setEmailChecking(true);
      try {
        const { exists } = await checkEmailAPI(val);
        setEmailExists(exists);
        if (exists) setShowLoginNudge(true);
      } catch {
        // silently ignore
      } finally {
        setEmailChecking(false);
      }
    }, 600);
  };

  /* ── Validation ── */
  const validateAddress = (): boolean => {
    if (!address.fullName.trim()) { toast.error("Full name is required"); return false; }
    if (!address.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      toast.error("Valid email address is required"); return false;
    }
    if (!address.phone.trim() || address.phone.trim().length < 10) { toast.error("Valid phone number is required"); return false; }
    if (!address.addressLine1.trim()) { toast.error("Address line 1 is required"); return false; }
    if (!address.city.trim()) { toast.error("City is required"); return false; }
    if (!address.state.trim()) { toast.error("State is required"); return false; }
    if (!address.postalCode.trim() || address.postalCode.trim().length < 5) { toast.error("Valid PIN code is required"); return false; }
    return true;
  };

  /* ── Confirm order ── */
  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      // Token is either the logged-in user token or empty for guests
      const token = loggedInToken || "";
      const sessionId = sessionStorage.getItem("imi_session_id") || "";

      if (items.length === 1) {
        const item = items[0];
        const payload = item.backendId
          ? { productId: item.backendId, variant: item.variant || "" }
          : { productName: item.name, price: item.price, variant: item.variant || "" };

        const result = await startPayment(payload, item.quantity, token, paymentMethod, address, sessionId);

        if (result.type === "cod") {
          onClearCart?.();
          // Store guest info for signup nudge
          if (!loggedInToken) {
            sessionStorage.setItem("imi_guest_info", JSON.stringify({
              name: address.fullName,
              email: address.email,
              phone: address.phone,
            }));
            setGuestName(address.fullName);
            setGuestEmail(address.email);
            setGuestPhone(address.phone);
            setStep("signup_nudge");
          } else {
            toast.success("Order placed! Pay on delivery.");
            onClose();
            navigate("/payment/success?method=cod");
          }
        } else {
          // PayU redirect — clear cart then let page redirect
          onClearCart?.();
        }
      } else {
        // Multi-item cart
        const combinedNames = items.map((i) => i.variant ? `${i.name} (${i.variant})` : i.name).join(", ");
        const payload = { productName: combinedNames, price: totalAmount };
        const result = await startPayment(payload, 1, token, paymentMethod, address, sessionId);

        if (result.type === "cod") {
          onClearCart?.();
          if (!loggedInToken) {
            sessionStorage.setItem("imi_guest_info", JSON.stringify({
              name: address.fullName,
              email: address.email,
              phone: address.phone,
            }));
            setGuestName(address.fullName);
            setGuestEmail(address.email);
            setGuestPhone(address.phone);
            setStep("signup_nudge");
          } else {
            toast.success("Order placed! Pay on delivery.");
            onClose();
            navigate("/payment/success?method=cod");
          }
        } else {
          onClearCart?.();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Create account via Firebase (so login page works too) ── */
  const handleCreateAccount = async () => {
    if (!signupPassword || signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSignupLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, guestEmail, signupPassword);
      if (guestName) await updateProfile(result.user, { displayName: guestName });
      // Sync with backend to get JWT
      const res = await syncSocialUser(guestEmail, guestName, "email");
      localStorage.setItem("imi_token", res.token);
      sessionStorage.removeItem("imi_guest_info");
      setSignupMode("done");
      toast.success("Account created! Welcome to IMI.");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        // Account exists in Firebase — switch to login mode
        toast.info("Account already exists. Please log in.");
        setSignupMode("login_form");
      } else {
        toast.error(err.message || "Signup failed. Try again.");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  /* ── Login via Firebase (works with any Firebase account) ── */
  const handleLogin = async () => {
    if (!loginPassword) { toast.error("Enter your password"); return; }
    setSignupLoading(true);
    try {
      await signInWithEmailAndPassword(auth, guestEmail, loginPassword);
      const res = await syncSocialUser(guestEmail, guestName, "email");
      localStorage.setItem("imi_token", res.token);
      sessionStorage.removeItem("imi_guest_info");
      setSignupMode("done");
      toast.success("Logged in successfully!");
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" || err.code === "auth/invalid-login-credentials") {
        toast.error("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        toast.error("No account found. Create one first.");
        setSignupMode("form");
      } else {
        toast.error(err.message || "Login failed.");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  /* ── Google sign-in / sign-up ── */
  const handleGoogleSignup = async () => {
    setSignupLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await syncSocialUser(
        result.user.email!,
        result.user.displayName || guestName,
        "google"
      );
      localStorage.setItem("imi_token", res.token);
      sessionStorage.removeItem("imi_guest_info");
      setSignupMode("done");
      toast.success(`Welcome, ${result.user.displayName || result.user.email}!`);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        toast.error(err.message || "Google sign-in failed.");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const goToSuccess = () => {
    onClose();
    navigate("/payment/success?method=cod");
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 shadow-2xl"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {step === "address" && "Shipping Details"}
            {step === "payment" && "Payment Method"}
            {step === "signup_nudge" && "Order Placed!"}
          </h2>
          {step !== "signup_nudge" && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* ══════════════ STEP 1: ADDRESS ══════════════ */}
        {step === "address" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name *"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              className={INPUT}
            />

            {/* Email with existence check */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address *"
                value={address.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={!!loggedInToken}
                className={`${INPUT} ${loggedInToken ? "opacity-60 cursor-not-allowed" : ""} pr-9`}
              />
              {emailChecking && (
                <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
              {!emailChecking && emailExists === false && address.email && (
                <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>

            {/* Account found nudge */}
            <AnimatePresence>
              {showLoginNudge && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl bg-primary/8 border border-primary/20 p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">Account found</p>
                    <p className="text-xs text-muted-foreground">Continue with login for faster checkout?</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/auth?email=${encodeURIComponent(address.email)}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <LogIn size={13} /> Login
                    </button>
                    <button
                      onClick={() => setShowLoginNudge(false)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="tel"
              placeholder="Phone Number *"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className={INPUT}
            />
            <input
              type="text"
              placeholder="Address Line 1 *"
              value={address.addressLine1}
              onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
              className={INPUT}
            />
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={address.addressLine2}
              onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
              className={INPUT}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City *"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className={INPUT}
              />
              <input
                type="text"
                placeholder="State *"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className={INPUT}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="PIN Code *"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                className={INPUT}
              />
              <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className={INPUT}
              />
            </div>
            <button
              onClick={() => { if (validateAddress()) setStep("payment"); }}
              className={`${BTN_PRIMARY} mt-2`}
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* ══════════════ STEP 2: PAYMENT ══════════════ */}
        {step === "payment" && (
          <div className="space-y-4">
            {/* Order summary */}
            <div className="rounded-xl bg-background border border-border p-4 space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name}{item.variant ? ` (${item.variant})` : ""} × {item.quantity}
                  </span>
                  <span className="text-foreground font-medium">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground font-semibold">Total</span>
                <span className="text-foreground font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ship to</span>
                <span className="text-foreground text-right max-w-[60%]">
                  {address.addressLine1}, {address.city}
                </span>
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Payment Method</p>
              {([
                {
                  id: "ONLINE" as const,
                  title: "Pay Full Amount Online",
                  desc: `₹${totalAmount.toLocaleString("en-IN")} via PayU (UPI / Card / Net Banking)`,
                },
                {
                  id: "COD" as const,
                  title: "Cash on Delivery",
                  desc: `Pay ₹${totalAmount.toLocaleString("en-IN")} when delivered`,
                },
                {
                  id: "PARTIAL" as const,
                  title: "Pay 50% Now",
                  desc: `Pay ₹${Math.round(totalAmount * 0.5).toLocaleString("en-IN")} now · ₹${Math.round(totalAmount * 0.5).toLocaleString("en-IN")} on delivery`,
                },
              ]).map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="accent-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{opt.title}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep("address")} className={BTN_SECONDARY}>
                Back
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "COD"
                  ? "Place Order"
                  : paymentMethod === "PARTIAL"
                  ? `Pay ₹${Math.round(totalAmount * 0.5).toLocaleString("en-IN")} Now`
                  : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 3: POST-ORDER SIGNUP NUDGE ══════════════ */}
        {step === "signup_nudge" && (
          <div className="space-y-5">
            {/* Success header */}
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mb-3">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Order Placed!</h3>
              <p className="text-muted-foreground text-sm mt-1">
                A confirmation will be sent to <span className="text-foreground font-medium">{guestEmail}</span>
              </p>
            </div>

            {signupMode === "prompt" && (
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 space-y-4">
                <div>
                  <p className="font-semibold text-foreground">Save your details for next time?</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Create a free account to track orders, save addresses & enjoy faster checkout.
                  </p>
                </div>
                {/* Google one-tap */}
                <button
                  onClick={handleGoogleSignup}
                  disabled={signupLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-full border border-border bg-card hover:bg-secondary transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" /><span>or</span><div className="h-px flex-1 bg-border" />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSignupMode("form")}
                    className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={goToSuccess}
                    className="flex-1 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
                  >
                    Skip for Now
                  </button>
                </div>
              </div>
            )}

            {signupMode === "form" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Just set a password — name, email & phone are already filled in.
                </p>
                {/* Google option */}
                <button
                  onClick={handleGoogleSignup}
                  disabled={signupLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-full border border-border bg-card hover:bg-secondary transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" /><span>or set a password</span><div className="h-px flex-1 bg-border" />
                </div>
                <input type="text" value={guestName} disabled className={`${INPUT} opacity-60 cursor-not-allowed`} />
                <input type="email" value={guestEmail} disabled className={`${INPUT} opacity-60 cursor-not-allowed`} />
                <input type="tel" value={guestPhone} disabled className={`${INPUT} opacity-60 cursor-not-allowed`} />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password (min 6 chars) *"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateAccount()}
                    className={`${INPUT} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button
                  onClick={handleCreateAccount}
                  disabled={signupLoading}
                  className={BTN_PRIMARY}
                >
                  {signupLoading ? "Creating Account..." : "Create Account"}
                </button>
                <button onClick={goToSuccess} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                  Skip for Now
                </button>
              </div>
            )}

            {signupMode === "login_form" && (
              <div className="space-y-3">
                <input type="email" value={guestEmail} disabled className={`${INPUT} opacity-60 cursor-not-allowed`} />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password *"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`${INPUT} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={signupLoading}
                  className={BTN_PRIMARY}
                >
                  {signupLoading ? "Logging in..." : "Log In"}
                </button>
                <button onClick={goToSuccess} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                  Skip
                </button>
              </div>
            )}

            {signupMode === "done" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <CheckCircle size={20} className="text-green-500 shrink-0" />
                  <p className="text-sm font-medium text-foreground">You're all set!</p>
                </div>
                <button onClick={goToSuccess} className={BTN_PRIMARY}>
                  View Order
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
