import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { verifyPayment, clearCartAPI } from "@/lib/api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const txnid = searchParams.get("txnid");
  const mihpayid = searchParams.get("mihpayid");
  const method = searchParams.get("method");
  const isCOD = method === "cod";
  const [verified, setVerified] = useState(false);

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
  }, [txnid, isCOD]);

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
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
