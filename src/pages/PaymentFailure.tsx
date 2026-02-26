import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const txnid = searchParams.get("txnid");

  return (
    <>
      <Helmet>
        <title>Payment Failed | IMI AI Smart Glasses</title>
      </Helmet>
      <Navbar />
      <main className="pt-32 pb-16 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
          <p className="text-muted-foreground mb-2">
            Something went wrong with your payment. Please try again.
          </p>
          {txnid && (
            <p className="text-sm text-muted-foreground mb-6">
              Transaction ID: {txnid}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
            <Link
              to="/product/mark-1"
              className="px-8 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentFailure;
