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
import { checkEmail as checkEmailAPI, guestRegister, loginUser, type ShippingAddress } from "@/lib/api";
import { useNavigate } from "react-router-dom";

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

  /* ── Signup after order ── */
  const handleCreateAccount = async () => {
    if (!signupPassword || signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSignupLoading(true);
    try {
      const res = await guestRegister(guestName, guestEmail, signupPassword, guestPhone);
      localStorage.setItem("imi_token", res.token);
      sessionStorage.removeItem("imi_guest_info");
      setSignupMode("done");
      toast.success("Account created! Welcome to IMI.");
    } catch (err: any) {
      toast.error(err.message || "Signup failed. Try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  /* ── Login after order ── */
  const handleLogin = async () => {
    if (!loginPassword) { toast.error("Enter your password"); return; }
    setSignupLoading(true);
    try {
      const res = await loginUser(guestEmail, loginPassword);
      localStorage.setItem("imi_token", res.token);
      sessionStorage.removeItem("imi_guest_info");
      setSignupMode("done");
      toast.success("Logged in successfully!");
    } catch (err: any) {
      toast.error(err.message || "Login failed.");
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
                <input type="text" value={guestName} disabled className={`${INPUT} opacity-60 cursor-not-allowed`} />
                <input type="email" value={guestEmail} disabled className={`${INPUT} opacity-60 cursor-not-allowed`} />
                <input type="tel" value={guestPhone} disabled className={`${INPUT} opacity-60 cursor-not-allowed`} />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password (min 6 chars) *"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
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
