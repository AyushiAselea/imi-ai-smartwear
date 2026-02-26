import { useTheme } from "@/hooks/useTheme";
import logoWhite from "@/assets/new Final IMI LOGO.png";
import logoBlack from "@/assets/WhatsApp Image 2025-09-08 at 6.23.45 PM.png";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Youtube, Send } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const { theme } = useTheme();
  const logo = theme === "dark" ? logoWhite : logoBlack;
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Could integrate with backend newsletter API
      alert("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* About Us */}
          <div>
            <img src={logoWhite} alt="IMI" className="h-8 w-auto mb-5" />
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              IMI Wearables is India's leading AI smart glasses brand. We combine cutting-edge artificial intelligence with stylish eyewear to make everyday life smarter, hands-free, and future-ready.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/imi.wearables/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://x.com/ImiWearables" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter size={16} />
              </a>
              <a href="https://www.linkedin.com/company/imi-wearables/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="https://www.youtube.com/@IMIWearables" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              <li><a href="#products" className="text-sm text-gray-400 hover:text-white transition-colors">Products</a></li>
              <li><a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#compare" className="text-sm text-gray-400 hover:text-white transition-colors">Compare Models</a></li>
              <li><a href="#why" className="text-sm text-gray-400 hover:text-white transition-colors">Why IMI</a></li>
              <li><a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">Reviews</a></li>
              <li><a href="/refund-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">IMI Wearables Pvt. Ltd.<br />New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <a href="mailto:support@imiwearables.com" className="text-sm text-gray-400 hover:text-white transition-colors">support@imiwearables.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-gray-400 hover:text-white transition-colors">+91 98765 43210</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to get the latest updates on new products, features, and exclusive offers.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} IMI Wearables Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="/refund-policy" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
