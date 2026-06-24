import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Shipping &amp; Delivery Policy</h1>
          <p className="text-sm text-gray-500">Last Updated: March 2, 2026</p>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Thank you for shopping with <span className="text-white font-medium">IMI Wearables</span>. We aim to ensure that your order reaches you safely and as quickly as possible.
          </p>
        </div>

        <div className="space-y-10 divide-y divide-gray-800">

          {/* Order Processing */}
          <section className="pt-10 first:pt-0">
            <h2 className="text-xl font-semibold text-white mb-4">Order Processing</h2>
            <p className="text-gray-400 mb-3">
              All orders are processed within 1–2 business days after confirmation. Orders placed on weekends or public holidays will be processed on the next working day.
            </p>
            <p className="text-gray-400">
              Once your order has been dispatched, you will receive a confirmation email or SMS containing tracking details.
            </p>
          </section>

          {/* Delivery Timeline */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">Delivery Timeline</h2>
            <p className="text-gray-400 mb-2">Estimated delivery times after dispatch are:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400">
              <li>Metro Cities: 3–5 business days</li>
              <li>Other Cities &amp; Towns: 5–8 business days</li>
              <li>Remote Locations: 7–10 business days</li>
            </ul>
            <p className="text-gray-400 mt-3">
              Please note that delivery timelines are estimates and may vary due to courier operations, weather conditions, or other circumstances beyond our control.
            </p>
          </section>

          {/* Shipping Charges */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">Shipping Charges</h2>
            <p className="text-gray-400 mb-3">
              Any applicable shipping charges will be displayed during checkout before payment is completed.
            </p>
            <p className="text-gray-400">
              From time to time, IMI Wearables may offer free shipping on selected products, promotional campaigns, or qualifying order values.
            </p>
          </section>

          {/* Tracking Your Order */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">Tracking Your Order</h2>
            <p className="text-gray-400">
              Once your shipment is dispatched, tracking information will be shared via email or SMS. You can use the provided tracking link to monitor the status of your order.
            </p>
          </section>

          {/* Delivery Issues */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">Delivery Issues</h2>
            <p className="text-gray-400 mb-2">While we work with trusted logistics partners, delays may occasionally occur due to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 mb-3">
              <li>Severe weather conditions</li>
              <li>Natural disasters or regional restrictions</li>
              <li>Courier network disruptions</li>
              <li>Incorrect or incomplete delivery information provided during checkout</li>
            </ul>
            <p className="text-gray-400">
              If your order has not arrived within the expected timeframe, please contact our support team and we will assist you in resolving the issue.
            </p>
          </section>

          {/* Failed Delivery Attempts */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">Failed Delivery Attempts</h2>
            <p className="text-gray-400">
              If a delivery cannot be completed because the recipient is unavailable, the address is incorrect, or the shipment is refused, additional shipping or re-delivery charges may apply.
            </p>
          </section>

          {/* Contact Us */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-gray-400 mb-3">For any shipping or delivery-related questions, please contact us:</p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-2">
              <p className="text-white font-semibold text-lg">IMI Wearables</p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Email:</span>{" "}
                <a href="mailto:tanay@imiglasses.com" className="text-primary hover:underline">tanay@imiglasses.com</a>
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Phone:</span>{" "}
                <a href="tel:+919024194918" className="text-primary hover:underline">+91 9024194918</a>
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Address:</span> Aselea Network, Third Floor, Shop No 230/CS/15-16, RHB, Pratap Nagar, Sanganer, Jaipur, Rajasthan - 302033, India
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Website:</span>{" "}
                <a href="https://www.imiglasses.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  www.imiglasses.com
                </a>
              </p>
            </div>
          </section>

        </div>

        <div className="mt-8">
          <Link to="/" className="text-sm text-primary hover:underline">&larr; Back to Home</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;
