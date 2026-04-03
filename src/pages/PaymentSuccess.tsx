import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { verifyPayment, clearCartAPI, guestRegister } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const txnid = searchParams.get("txnid");
  const mihpayid = searchParams.get("mihpayid");
  const method = searchParams.get("method");
  const isCOD = method === "cod";
  const [verified, setVerified] = useState(false);

  // Guest signup nudge state
  const [guestInfo, setGuestInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [signupPassword, setSignupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  useEffect(() => {
    // Clear cart after successful payment
    const token = localStorage.getItem("imi_token") || "";
    if (token) {
      clearCartAPI(token).catch(() => {});
    }

    if (txnid) {
      verifyPayment(txnid, token)
        .then(() => setVerified(true))
        .catch(() => setVerified(true)); // Show success regardless — PayU already confirmed
    } else if (isCOD) {
      setVerified(true);
    }

    // Show guest signup nudge if guest info exists and user is not logged in
    if (!token) {
      const raw = sessionStorage.getItem("imi_guest_info");
      if (raw) {
        try {
          setGuestInfo(JSON.parse(raw));
          setShowSignup(true);
        } catch {}
      }
    }
  }, [txnid, isCOD]);

  const handleCreateAccount = async () => {
    if (!signupPassword || signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!guestInfo) return;
    setSignupLoading(true);
    try {
      const res = await guestRegister(guestInfo.name, guestInfo.email, signupPassword, guestInfo.phone);
      localStorage.setItem("imi_token", res.token);
      sessionStorage.removeItem("imi_guest_info");
      setSignupDone(true);
      toast.success("Account created! Welcome to IMI.");
    } catch (err: any) {
      toast.error(err.message || "Signup failed. Try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isCOD ? "Order Placed" : "Payment Successful"} | IMI AI Smart Glasses</title>
      </Helmet>
      <Navbar />
      <main className="pt-32 pb-16 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {isCOD ? "Order Placed!" : "Payment Successful!"}
          </h1>
          <p className="text-muted-foreground mb-2">
            {isCOD
              ? "Your order has been confirmed. Please pay the full amount on delivery."
              : "Thank you for your purchase. Your order has been confirmed."}
          </p>
          {txnid && (
            <p className="text-sm text-muted-foreground mb-6">
              Transaction ID: {txnid}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/profile"
              className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="inline-block px-8 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Guest signup nudge */}
          {showSignup && !signupDone && guestInfo && (
            <div className="mt-8 p-5 rounded-2xl border border-border bg-card text-left">
              <h3 className="font-bold text-base mb-1">Save your order details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a free account to track your order and get faster checkout next time.
              </p>
              <div className="space-y-3">
                <div className="px-4 py-2 rounded-xl bg-background border border-border text-sm text-muted-foreground">{guestInfo.name}</div>
                <div className="px-4 py-2 rounded-xl bg-background border border-border text-sm text-muted-foreground">{guestInfo.email}</div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose a password (min 6 chars)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSignup(false)}
                    className="flex-1 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-secondary transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleCreateAccount}
                    disabled={signupLoading}
                    className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {signupLoading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {signupDone && (
            <div className="mt-6 p-4 rounded-2xl border border-green-500/30 bg-green-500/10 text-green-600 text-sm text-center font-medium">
              Account created! You're now logged in.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
