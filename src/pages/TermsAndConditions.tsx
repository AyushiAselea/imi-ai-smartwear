import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Terms and Conditions</h1>
          <p className="text-sm text-gray-500">Last updated: March 2, 2026</p>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Welcome to <span className="text-white font-medium">IMI Wearables</span> ("we," "our," "us"). These Terms and Conditions ("Terms") govern your use of our website{" "}
            <a href="https://www.imiglasses.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              https://www.imiglasses.com/
            </a>{" "}
            and the purchase of products from us.
          </p>
          <p className="mt-3 text-gray-400 leading-relaxed">
            By accessing this Website or placing an order, you agree to be bound by these Terms. If you do not agree, please do not use our Website.
          </p>
          <p className="mt-3 text-gray-400 leading-relaxed">
            These Terms are governed by applicable Indian laws, including the Information Technology Act, 2000, Consumer Protection Act, 2019, and other relevant regulations.
          </p>
        </div>

        <div className="space-y-10 divide-y divide-gray-800">

          {/* Section 1 */}
          <section className="pt-10 first:pt-0">
            <h2 className="text-xl font-semibold text-white mb-4">1. Eligibility</h2>
            <p className="text-gray-400 mb-2">By using this Website, you confirm that:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>You are at least 18 years of age, or using the Website under supervision of a parent/guardian</li>
              <li>You are legally capable of entering into binding contracts under Indian law</li>
              <li>The information you provide is accurate and complete</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">2. Account Registration</h2>
            <p className="text-gray-400 mb-2">To access certain features, you may need to create an account. You agree to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Provide accurate information</li>
              <li>Keep login credentials confidential</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
            <p className="text-gray-400">We reserve the right to suspend or terminate accounts for false information or misuse.</p>
          </section>

          {/* Section 3 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">3. Products and Services</h2>
            <p className="text-gray-400 mb-2">
              IMI Glasses sells eyewear products including frames, lenses, sunglasses, and related accessories. We strive to ensure product descriptions, images, and prices are accurate. However:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Colors may vary due to screen differences</li>
              <li>Minor variations may occur</li>
              <li>Availability is subject to stock</li>
            </ul>
            <p className="text-gray-400">We reserve the right to modify or discontinue products without notice.</p>
          </section>

          {/* Section 4 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">4. Pricing and Payments</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>All prices are listed in Indian Rupees (INR) unless stated otherwise</li>
              <li>Prices include applicable taxes unless specified</li>
              <li>We reserve the right to change prices at any time</li>
            </ul>
            <p className="text-gray-400 mb-2">Payment methods may include:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Online payment (UPI, cards, net banking, wallets)</li>
              <li>Cash on Delivery (if available)</li>
              <li>Partial payment options (if offered on the Website)</li>
            </ul>
            <p className="text-gray-400">Orders are confirmed only after successful payment authorization.</p>
          </section>

          {/* Section 5 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">5. Order Acceptance and Cancellation</h2>
            <p className="text-gray-400 mb-2">We reserve the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Refuse or cancel any order</li>
              <li>Limit quantities</li>
              <li>Cancel orders due to pricing errors, stock issues, or suspected fraud</li>
            </ul>
            <p className="text-gray-400">
              If payment has been made and the order is cancelled, a refund will be processed as per our Refund Policy.
            </p>
          </section>

          {/* Section 6 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">6. Shipping and Delivery</h2>
            <p className="text-gray-400 mb-2">Delivery timelines are estimates and may vary due to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Location</li>
              <li>Courier delays</li>
              <li>Weather or unforeseen circumstances</li>
            </ul>
            <p className="text-gray-400 mb-2">
              Risk of loss passes to you upon delivery to the shipping address provided.
            </p>
            <p className="text-gray-400">
              Please ensure accurate address details. We are not responsible for delays due to incorrect information.
            </p>
          </section>

          {/* Section 7 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">7. Returns, Refunds, and Exchanges</h2>
            <p className="text-gray-400 mb-2">
              Returns and refunds are governed by our separate{" "}
              <Link to="/refund-policy" className="text-primary hover:underline">Return &amp; Refund Policy</Link>{" "}
              available on the Website.
            </p>
            <p className="text-gray-400 mb-2">Products must be returned in original condition unless defective or damaged.</p>
            <p className="text-gray-400">Customized or prescription products may not be eligible for return unless faulty.</p>
          </section>

          {/* Section 8 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">8. User Responsibilities</h2>
            <p className="text-gray-400 mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Use the Website for unlawful purposes</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Interfere with Website security or functionality</li>
              <li>Upload harmful code or content</li>
              <li>Misrepresent identity or information</li>
            </ul>
            <p className="text-gray-400">Violation may result in termination of access and legal action.</p>
          </section>

          {/* Section 9 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">9. Intellectual Property</h2>
            <p className="text-gray-400 mb-2">All content on this Website, including logos, designs, text, images, graphics, and software, is the property of IMI Glasses or its licensors and is protected by intellectual property laws.</p>
            <p className="text-gray-400">You may not reproduce, distribute, or use content without prior written permission.</p>
          </section>

          {/* Section 10 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">10. Third‑Party Links and Services</h2>
            <p className="text-gray-400 mb-2">
              The Website may contain links to third‑party websites or services. We are not responsible for their content, policies, or practices.
            </p>
            <p className="text-gray-400">Use of third‑party services is at your own risk.</p>
          </section>

          {/* Section 11 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">11. Disclaimer of Warranties</h2>
            <p className="text-gray-400 mb-2">
              The Website and products are provided on an "as is" and "as available" basis. We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Continuous or error‑free operation</li>
              <li>That defects will be corrected</li>
              <li>That the Website is free of viruses or harmful components</li>
            </ul>
            <p className="text-gray-400">To the maximum extent permitted by law, we disclaim all warranties, express or implied.</p>
          </section>

          {/* Section 12 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">12. Limitation of Liability</h2>
            <p className="text-gray-400 mb-2">To the extent permitted by law, IMI Glasses shall not be liable for:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Indirect or consequential damages</li>
              <li>Loss of profits or data</li>
              <li>Delays beyond our control</li>
              <li>Unauthorized access to your information</li>
            </ul>
            <p className="text-gray-400">Our total liability shall not exceed the amount paid for the product in question.</p>
          </section>

          {/* Section 13 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">13. Indemnification</h2>
            <p className="text-gray-400">
              You agree to indemnify and hold harmless IMI Glasses, its owners, employees, and affiliates from any claims, damages, or expenses arising from your use of the Website, violation of these Terms, or infringement of any rights.
            </p>
          </section>

          {/* Section 14 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">14. Privacy</h2>
            <p className="text-gray-400">
              Your use of the Website is also governed by our{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
              available on the Website.
            </p>
          </section>

          {/* Section 15 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">15. Termination</h2>
            <p className="text-gray-400">
              We may suspend or terminate access to the Website at any time for violation of these Terms or for security reasons, without prior notice.
            </p>
          </section>

          {/* Section 16 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">16. Governing Law and Jurisdiction</h2>
            <p className="text-gray-400">
              These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in <span className="text-white font-medium">Jaipur, Rajasthan, India</span>.
            </p>
          </section>

          {/* Section 17 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">17. Changes to Terms</h2>
            <p className="text-gray-400 mb-2">
              We may update these Terms from time to time. Updated versions will be posted on this page with a revised "Last updated" date.
            </p>
            <p className="text-gray-400">Continued use of the Website constitutes acceptance of the revised Terms.</p>
          </section>

          {/* Section 18 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">18. Grievance Officer (India)</h2>
            <p className="text-gray-400 mb-4">
              In accordance with Indian law, the contact details of the Grievance Officer are provided below:
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-2">
              <p className="text-gray-300"><span className="text-white font-medium">Name:</span> Tanay</p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Email:</span>{" "}
                <a href="mailto:tanay@imiglasses.com" className="text-primary hover:underline">tanay@imiglasses.com</a>
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Address:</span> 611 Horizon Tower, Opposite Mercedes Showroom, Malviya Nagar, Jaipur, Rajasthan, India
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Phone:</span>{" "}
                <a href="tel:+919024194918" className="text-primary hover:underline">+91 9024194918</a>
              </p>
            </div>
          </section>

          {/* Section 19 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">19. Contact Information</h2>
            <p className="text-gray-400 mb-4">
              For any questions regarding these Terms, please contact:
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-2">
              <p className="text-white font-semibold text-lg">IMI Glasses</p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Website:</span>{" "}
                <a href="https://www.imiglasses.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://www.imiglasses.com/
                </a>
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Email:</span>{" "}
                <a href="mailto:tanay@imiglasses.com" className="text-primary hover:underline">tanay@imiglasses.com</a>
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Address:</span> 611 Horizon Tower, Opposite Mercedes Showroom, Malviya Nagar, Jaipur, Rajasthan, India
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Phone:</span>{" "}
                <a href="tel:+919024194918" className="text-primary hover:underline">+91 9024194918</a>
              </p>
            </div>
          </section>

        </div>

        {/* Acknowledgement */}
        <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400 leading-relaxed">
          By using this Website, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
        </div>

        <div className="mt-8">
          <Link to="/" className="text-sm text-primary hover:underline">&larr; Back to Home</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
