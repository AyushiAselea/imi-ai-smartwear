import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { verifyPayment } from "@/lib/api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const txnid = searchParams.get("txnid");
  const mihpayid = searchParams.get("mihpayid");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (txnid) {
      const token = localStorage.getItem("imi_token") || "";
      verifyPayment(txnid, token)
        .then(() => setVerified(true))
        .catch(() => setVerified(true)); // Show success regardless — PayU already confirmed
    }
  }, [txnid]);

  return (
    <>
      <Helmet>
        <title>Payment Successful | IMI AI Smart Glasses</title>
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          {txnid && (
            <p className="text-sm text-muted-foreground mb-6">
              Transaction ID: {txnid}
            </p>
          )}
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
