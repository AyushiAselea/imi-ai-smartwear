import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: March 2, 2026</p>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Welcome to <span className="text-white font-medium">IMI Wearables</span> ("we," "our," "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website{" "}
            <a href="https://www.imiglasses.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              https://www.imiglasses.com/
            </a>{" "}
            .
          </p>
          <p className="mt-3 text-gray-400 leading-relaxed">
            This policy is designed in accordance with applicable Indian laws, including the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP Act), where applicable.
          </p>
          <p className="mt-3 text-gray-400 leading-relaxed">
            By using our Website, you consent to the practices described in this Privacy Policy.
          </p>
        </div>

        <div className="space-y-10 divide-y divide-gray-800">
          {/* Section 1 */}
          <section className="pt-10 first:pt-0">
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-400 mb-4">We may collect the following types of information:</p>

            <h3 className="text-base font-semibold text-gray-200 mb-2">a) Personal Information</h3>
            <p className="text-gray-400 mb-2">Information that identifies you as an individual, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-5">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping and billing address</li>
              <li>Payment details (processed via secure third‑party payment gateways)</li>
              <li>Account login details</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-200 mb-2">b) Non‑Personal Information</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-5">
              <li>Browser type and version</li>
              <li>IP address</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-200 mb-2">c) Sensitive Personal Data</h3>
            <p className="text-gray-400">
              We do <span className="text-white font-medium">not</span> intentionally collect sensitive personal data unless required for a specific service and with your explicit consent.
            </p>
          </section>

          {/* Section 2 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Collect Information</h2>
            <p className="text-gray-400 mb-2">We collect information when you:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Register or create an account</li>
              <li>Place an order</li>
              <li>Fill out forms on the Website</li>
              <li>Subscribe to newsletters or offers</li>
              <li>Contact customer support</li>
              <li>Interact with our Website through cookies and analytics tools</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-400 mb-2">We use your information for purposes including:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Processing and delivering your orders</li>
              <li>Providing customer support</li>
              <li>Managing your account</li>
              <li>Sending order confirmations and updates</li>
              <li>Improving our products and services</li>
              <li>Personalizing user experience</li>
              <li>Sending promotional communications (only with consent)</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">4. Legal Basis for Processing (India)</h2>
            <p className="text-gray-400 mb-2">We process personal data based on:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Your consent</li>
              <li>Performance of a contract (e.g., order fulfillment)</li>
              <li>Compliance with legal obligations</li>
              <li>Legitimate business interests, where permitted by law</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-400 mb-2">We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Enable core website functionality</li>
              <li>Remember user preferences</li>
              <li>Analyze traffic and usage</li>
              <li>Improve performance and security</li>
            </ul>
            <p className="text-gray-400">
              You can control cookies through your browser settings. Disabling cookies may affect website functionality.
            </p>
          </section>

          {/* Section 6 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">6. Sharing of Information</h2>
            <p className="text-gray-400 mb-2">
              We do <span className="text-white font-medium">not sell</span> your personal information.
            </p>
            <p className="text-gray-400 mb-2">We may share your information with:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Payment gateway providers</li>
              <li>Shipping and logistics partners</li>
              <li>IT and hosting service providers</li>
              <li>Analytics providers</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p className="text-gray-400">All third parties are obligated to protect your data.</p>
          </section>

          {/* Section 7 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">7. Data Storage and Security</h2>
            <p className="text-gray-400 mb-2">
              We implement reasonable security practices to protect your information from unauthorized access, misuse, loss, or disclosure, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Secure servers</li>
              <li>Encryption where appropriate</li>
              <li>Access controls</li>
              <li>Regular security monitoring</li>
            </ul>
            <p className="text-gray-400">However, no method of transmission over the Internet is completely secure.</p>
          </section>

          {/* Section 8 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">8. Data Retention</h2>
            <p className="text-gray-400 mb-2">We retain your personal data only as long as necessary for:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Providing services</li>
              <li>Legal compliance</li>
              <li>Dispute resolution</li>
              <li>Business purposes</li>
            </ul>
            <p className="text-gray-400">After this period, data is securely deleted or anonymized.</p>
          </section>

          {/* Section 9 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">9. Your Rights (Under Indian Law)</h2>
            <p className="text-gray-400 mb-2">Subject to applicable law, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Withdraw consent</li>
              <li>Request deletion of data</li>
              <li>Grievance redressal</li>
            </ul>
            <p className="text-gray-400">
              To exercise these rights, contact us using the details below.
            </p>
          </section>

          {/* Section 10 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">10. Children's Privacy</h2>
            <p className="text-gray-400">
              Our Website is not intended for children under 18 years of age. We do not knowingly collect personal information from minors.
            </p>
          </section>

          {/* Section 11 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">11. Third‑Party Links</h2>
            <p className="text-gray-400">
              Our Website may contain links to third‑party websites. We are not responsible for the privacy practices of those sites.
            </p>
          </section>

          {/* Section 12 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-400">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.
            </p>
          </section>

          {/* Section 13 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">13. Grievance Officer (India)</h2>
            <p className="text-gray-400 mb-4">
              In accordance with Indian law, the contact details of the Grievance Officer are provided below:
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-2">
              <p className="text-gray-300"><span className="text-white font-medium">Name:</span> Tanay</p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Email:</span>{" "}
                <a href="mailto:tanay@imiglasses.com" className="text-primary hover:underline">tanay@imiglasses.com</a>
              </p>
              <p className="text-gray-300"><span className="text-white font-medium">Address:</span> 611 Horizon Tower, Opposite Mercedes Showroom, Malviya Nagar, Jaipur, Rajasthan, India</p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Phone:</span>{" "}
                <a href="tel:+919024194918" className="text-primary hover:underline">+91 9024194918</a>
              </p>
            </div>
            <p className="mt-4 text-gray-400">
              We will respond to grievances within the time required by applicable law.
            </p>
          </section>

          {/* Section 14 */}
          <section className="pt-10">
            <h2 className="text-xl font-semibold text-white mb-4">14. Contact Us</h2>
            <p className="text-gray-400 mb-4">
              If you have any questions about this Privacy Policy or our data practices, you may contact us at:
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
              <p className="text-gray-300"><span className="text-white font-medium">Address:</span> 611 Horizon Tower, Opposite Mercedes Showroom, Malviya Nagar, Jaipur, Rajasthan, India</p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Phone:</span>{" "}
                <a href="tel:+919024194918" className="text-primary hover:underline">+91 9024194918</a>
              </p>
            </div>
          </section>
        </div>

        {/* Acknowledgement */}
        <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400 leading-relaxed">
          By using this Website, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
        </div>

        <div className="mt-8">
          <Link to="/" className="text-sm text-primary hover:underline">&larr; Back to Home</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
