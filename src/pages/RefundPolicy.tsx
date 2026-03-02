import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Return &amp; Refund Policy</h1>
          <p className="text-sm text-gray-500">Last updated: March 2, 2026</p>
          <p className="mt-4 text-gray-400 leading-relaxed">
            At <span className="text-white font-medium">IMI Wearables</span>, customer satisfaction is our priority. If you receive a product that is damaged or defective, we will gladly arrange a return and replacement or refund subject to the conditions below.
          </p>
        </div>

        <div className="space-y-10 divide-y divide-gray-800">

          {/* Eligibility */}
          <section className="pt-10 first:pt-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✅</span>
              <h2 className="text-xl font-semibold text-white">Eligibility for Returns</h2>
            </div>
            <p className="text-gray-400 mb-3">
              Returns are accepted only if the product is <span className="text-white font-medium">damaged, defective, or incorrect</span> at the time of delivery.
            </p>
            <p className="text-gray-400 mb-2">To be eligible for a return:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400">
              <li>The return request must be made within <span className="text-white font-medium">15 days</span> of delivery</li>
              <li>The product must be unused and in original condition</li>
              <li>All original packaging, tags, accessories, and invoice must be included</li>
              <li>Proof of damage (photos/video) may be required</li>
            </ul>
          </section>

          {/* Non-Returnable */}
          <section className="pt-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">❌</span>
              <h2 className="text-xl font-semibold text-white">Non‑Returnable Items</h2>
            </div>
            <p className="text-gray-400 mb-2">Returns will <span className="text-white font-medium">NOT</span> be accepted for:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400">
              <li>Products damaged due to misuse or mishandling after delivery</li>
              <li>Normal wear and tear</li>
              <li>Minor color variations due to screen differences</li>
              <li>Products returned without original packaging</li>
              <li>Customized or prescription products (if applicable), unless defective</li>
            </ul>
          </section>

          {/* Replacement or Refund */}
          <section className="pt-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔄</span>
              <h2 className="text-xl font-semibold text-white">Replacement or Refund</h2>
            </div>
            <p className="text-gray-400 mb-3">Once your return request is approved:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 mb-4">
              <li>We will arrange pickup through our courier partner (where available), OR</li>
              <li>You may be asked to ship the product to our address</li>
            </ul>
            <p className="text-gray-400 mb-2">After inspection:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 mb-4">
              <li>A replacement will be shipped, OR</li>
              <li>A refund will be processed to the original payment method</li>
            </ul>
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 text-gray-400 text-sm">
              Refund processing time: <span className="text-white font-medium">5–10 business days</span> after approval.
            </div>
          </section>

          {/* Damaged on Delivery */}
          <section className="pt-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📦</span>
              <h2 className="text-xl font-semibold text-white">Damaged Product on Delivery</h2>
            </div>
            <p className="text-gray-400 mb-2">If the package appears damaged at the time of delivery:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400">
              <li>Please record an unboxing video</li>
              <li>Report the issue to us immediately</li>
              <li>Contact us within <span className="text-white font-medium">48 hours</span> for faster resolution</li>
            </ul>
          </section>

          {/* How to Request */}
          <section className="pt-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📩</span>
              <h2 className="text-xl font-semibold text-white">How to Request a Return</h2>
            </div>
            <p className="text-gray-400 mb-3">To initiate a return, contact us with:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 mb-6">
              <li>Order number</li>
              <li>Photos/video of the damaged product</li>
              <li>Reason for return</li>
            </ul>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-2">
              <p className="text-white font-semibold text-lg">IMI Glasses Support</p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Email:</span>{" "}
                <a href="mailto:tanay@imiglasses.com" className="text-primary hover:underline">tanay@imiglasses.com</a>
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Phone:</span>{" "}
                <a href="tel:+919024194918" className="text-primary hover:underline">+91 9024194918</a>
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Address:</span> 611 Horizon Tower, Opposite Mercedes Showroom, Malviya Nagar, Jaipur, Rajasthan, India
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Website:</span>{" "}
                <a href="https://www.imiglasses.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://www.imiglasses.com/
                </a>
              </p>
            </div>
          </section>

          {/* Final Decision */}
          <section className="pt-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚖️</span>
              <h2 className="text-xl font-semibold text-white">Final Decision</h2>
            </div>
            <p className="text-gray-400">
              IMI Glasses reserves the right to approve or reject returns based on inspection and policy compliance.
            </p>
          </section>

        </div>

        {/* Acknowledgement */}
        <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400 leading-relaxed">
          For any concerns about your order, please reach out to us at{" "}
          <a href="mailto:tanay@imiglasses.com" className="text-primary hover:underline">tanay@imiglasses.com</a>{" "}
          or call <a href="tel:+919024194918" className="text-primary hover:underline">+91 9024194918</a>. We're happy to help.
        </div>

        <div className="mt-8">
          <Link to="/" className="text-sm text-primary hover:underline">&larr; Back to Home</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
