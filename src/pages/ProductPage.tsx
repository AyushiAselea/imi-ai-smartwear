import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database, Shield, Truck, CreditCard, IndianRupee, Play, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mark1Img from "@/assets/mark1-glasses.jpg";
import mark2Img from "@/assets/mark2-glasses.png";
const CLD = "https://res.cloudinary.com/dvvifezwm/video/upload/f_auto,q_auto";
const mark1Video = `${CLD}/imi_ved2_akl631.mp4`;
const mark2Video = `${CLD}/imi_ved3_vnjdl5.mp4`;
import { startPayment } from "@/lib/payment";
import { updateCart, syncSocialUser } from "@/lib/api";
import type { ShippingAddress } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";

interface Variant {
  id: string;
  label: string;
  color: string;
  colorHex: string;
}

interface ProductInfo {
  name: string;
  tagline: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
  video: string;
  premium?: boolean;
  variants: Variant[];
  features: { icon: any; label: string }[];
}

const productData: Record<string, ProductInfo> = {
  "mark-1": {
    name: "IMI Mark 1",
    tagline: "Smart Everyday AI Glasses",
    description: "Affordable AI glasses built for everyday smart lifestyle. Voice-activated, AI-powered, and designed for the modern Indian user.",
    price: "₹3,999",
    originalPrice: "₹5,999",
    image: mark1Img,
    video: mark1Video,
    variants: [
      { id: "black", label: "Matte Black", color: "bg-gray-900", colorHex: "#111" },
      { id: "white", label: "Pearl White", color: "bg-white border border-gray-300", colorHex: "#f5f5f5" },
    ],
    features: [
      { icon: Mic, label: 'Voice Activation ("Hey IMI")' },
      { icon: Brain, label: "Real-Time AI Chat" },
      { icon: Phone, label: "Smart Calling" },
      { icon: Music, label: "Instant Music" },
      { icon: Database, label: "AI Memory" },
    ],
  },
  "mark-2": {
    name: "IMI Mark 2",
    tagline: "Advanced Vision AI Smart Glasses",
    description: "Next-generation AI glasses with camera and visual intelligence. See smarter, capture life, and talk naturally — all hands-free.",
    price: "₹6,999",
    originalPrice: "₹9,999",
    image: mark2Img,
    video: mark2Video,
    premium: true,
    variants: [
      { id: "black", label: "Matte Black", color: "bg-gray-900", colorHex: "#111" },
      { id: "white", label: "Pearl White", color: "bg-white border border-gray-300", colorHex: "#f5f5f5" },
    ],
    features: [
      { icon: Mic, label: "AI Voice Assistant" },
      { icon: Eye, label: "Real-Time Vision AI" },
      { icon: Camera, label: "Smart Capture (HD Photo & Video)" },
      { icon: Brain, label: "Live AI Chat" },
      { icon: Wifi, label: "Smart Connectivity" },
      { icon: Database, label: "Personal AI Memory" },
    ],
  },
};

const badges = [
  { icon: Truck, label: "Free Shipping" },
  { icon: Shield, label: "1 Year Warranty" },
  { icon: CreditCard, label: "EMI Available" },
  { icon: IndianRupee, label: "COD Available" },
];

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? productData[slug] : null;
  const [selectedVariant, setSelectedVariant] = useState("black");
  const [showVideo, setShowVideo] = useState(false);
  const [buyingLoading, setBuyingLoading] = useState(false);
  const { user } = useAuth();
  const { products: backendProducts } = useProducts();

  // ── Checkout modal state ──
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"address" | "payment">("address");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD" | "PARTIAL">("ONLINE");
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // Find matching backend product by name for payment integration
  const getBackendProductId = (): string | null => {
    if (!product || backendProducts.length === 0) return null;
    const match = backendProducts.find(
      (bp) => bp.name.toLowerCase().includes(product.name.toLowerCase().replace("imi ", ""))
        || bp.name.toLowerCase() === product.name.toLowerCase()
    );
    return match ? match._id : null;
  };

  // Track abandoned cart when user views a product
  useEffect(() => {
    if (product) {
      const sessionId = sessionStorage.getItem("imi_session_id") || `s_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      if (!sessionStorage.getItem("imi_session_id")) {
        sessionStorage.setItem("imi_session_id", sessionId);
      }
      const priceNum = parseInt(product.price.replace(/[₹,]/g, ""));
      updateCart({
        sessionId,
        userId: user?.id,
        email: user?.email || "",
        products: [
          {
            productId: slug || "",
            name: product.name,
            price: priceNum,
            quantity: 1,
            image: product.image,
          },
        ],
        totalAmount: priceNum,
      });
    }
  }, [slug, product, user]);

  const handleBuyNow = async () => {
    if (!user) {
      toast.info("Please sign in to continue with purchase");
      navigate("/auth");
      return;
    }

    let token = localStorage.getItem("imi_token") || "";

    // Token missing but user is logged in (backend was cold-starting during login)
    // Re-sync silently before blocking the user.
    if (!token && user.email) {
      try {
        toast.loading("Connecting to payment server...", { id: "sync-toast" });
        const res = await syncSocialUser(user.email, user.displayName || undefined, "google");
        localStorage.setItem("imi_token", res.token);
        token = res.token;
        toast.dismiss("sync-toast");
      } catch {
        toast.dismiss("sync-toast");
        toast.error("Unable to reach payment server. Please try again in a moment.");
        return;
      }
    }

    if (!token) {
      toast.info("Please sign in again to continue");
      navigate("/auth");
      return;
    }

    // Open checkout modal
    setShowCheckout(true);
    setCheckoutStep("address");
  };

  const validateAddress = (): boolean => {
    if (!address.fullName.trim()) { toast.error("Full name is required"); return false; }
    if (!address.phone.trim() || address.phone.trim().length < 10) { toast.error("Valid phone number is required"); return false; }
    if (!address.addressLine1.trim()) { toast.error("Address line 1 is required"); return false; }
    if (!address.city.trim()) { toast.error("City is required"); return false; }
    if (!address.state.trim()) { toast.error("State is required"); return false; }
    if (!address.postalCode.trim() || address.postalCode.trim().length < 5) { toast.error("Valid postal code is required"); return false; }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateAddress()) return;
    setCheckoutStep("payment");
  };

  const handleConfirmOrder = async () => {
    setBuyingLoading(true);
    try {
      const token = localStorage.getItem("imi_token") || "";
      if (!token) { toast.error("Session expired. Please sign in again."); navigate("/auth"); return; }

      const sessionId = sessionStorage.getItem("imi_session_id") || "";
      const backendProductId = getBackendProductId();
      const priceNum = parseInt(product!.price.replace(/[₹,]/g, ""));
      const payload = backendProductId
        ? { productId: backendProductId }
        : { productName: product!.name, price: priceNum };

      const result = await startPayment(payload, 1, token, paymentMethod, address, sessionId);

      if (result.type === "cod") {
        toast.success("Order placed successfully! Pay on delivery.");
        setShowCheckout(false);
        navigate("/payment/success?method=cod");
      }
      // For ONLINE/PARTIAL, startPayment redirects to PayU — code below won't execute
    } catch (err: any) {
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setBuyingLoading(false);
    }
  };

  const priceNum = product ? parseInt(product.price.replace(/[₹,]/g, "")) : 0;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | IMI AI Smart Glasses India</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Product Image / Video */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-28 space-y-4"
            >
              <div className={`rounded-2xl overflow-hidden ${product.premium ? "glow-border" : "border border-border"}`}>
                {showVideo ? (
                  <video
                    src={product.video}
                    className="w-full aspect-square object-cover"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={product.image}
                    alt={`${product.name} - ${product.tagline}`}
                    className="w-full aspect-square object-cover"
                  />
                )}
              </div>
              {/* Toggle Image / Video */}
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-sm font-medium text-foreground"
              >
                <Play size={16} className="text-primary" />
                {showVideo ? "View Photo" : "Watch Product Video"}
              </button>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {product.premium && (
                <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Premium
                </span>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight glow-text">{product.name}</h1>
                <p className="text-primary font-medium mt-2">{product.tagline}</p>
              </div>
              <p className="text-muted-foreground text-lg">{product.description}</p>

              {/* Color Variants */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Color</h3>
                <div className="flex gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                        selectedVariant === v.id
                          ? "border-primary ring-2 ring-primary/30 text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${v.color}`} />
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">{product.price}</span>
                <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                <span className="text-sm font-semibold text-primary">Save {Math.round((1 - parseInt(product.price.replace(/[₹,]/g, '')) / parseInt(product.originalPrice.replace(/[₹,]/g, ''))) * 100)}%</span>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Features</h3>
                {product.features.map((f: any) => (
                  <div key={f.label} className="flex items-center gap-3 text-sm">
                    <f.icon size={18} className="text-primary shrink-0" />
                    <span className="text-foreground/80">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuyNow}
                disabled={buyingLoading}
                className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {buyingLoading ? "Processing..." : `Buy Now — ${product.price}`}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {badges.map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <b.icon size={16} className="text-primary" />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Both Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">Explore All Models</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(productData).flatMap(([key, p]) =>
                p.variants.map((v) => (
                  <Link
                    key={`${key}-${v.id}`}
                    to={`/product/${key}`}
                    className={`rounded-2xl border bg-card p-4 hover:border-primary/50 transition-colors group ${
                      slug === key && selectedVariant === v.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-muted">
                      <img
                        src={p.image}
                        alt={`${p.name} - ${v.label}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-base">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-3 h-3 rounded-full ${v.color}`} />
                      <span className="text-sm text-muted-foreground">{v.label}</span>
                    </div>
                    <p className="text-primary font-semibold mt-2">{p.price}</p>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />

      {/* ── Checkout Modal ── */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">
                {checkoutStep === "address" ? "Shipping Address" : "Payment Method"}
              </h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {checkoutStep === "address" && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                />
                <input
                  type="text"
                  placeholder="Address Line 1 *"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City *"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="PIN Code *"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full py-3 mt-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="space-y-4">
                {/* Order summary */}
                <div className="rounded-xl bg-background border border-border p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product</span>
                    <span className="text-foreground font-medium">{product?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-foreground font-bold">₹{priceNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ship to</span>
                    <span className="text-foreground text-right text-xs max-w-[60%]">{address.addressLine1}, {address.city}</span>
                  </div>
                </div>

                {/* Payment options */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Choose Payment</p>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "ONLINE" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <input type="radio" name="pm" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} className="accent-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Pay Full Amount Online</p>
                      <p className="text-xs text-muted-foreground">₹{priceNum.toLocaleString()} via PayU (UPI / Card / Net Banking)</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <input type="radio" name="pm" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="accent-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay ₹{priceNum.toLocaleString()} when delivered</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "PARTIAL" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <input type="radio" name="pm" checked={paymentMethod === "PARTIAL"} onChange={() => setPaymentMethod("PARTIAL")} className="accent-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Pay 50% Now</p>
                      <p className="text-xs text-muted-foreground">
                        Pay ₹{Math.round(priceNum * 0.5).toLocaleString()} now · ₹{Math.round(priceNum * 0.5).toLocaleString()} on delivery
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setCheckoutStep("address")}
                    className="flex-1 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={buyingLoading}
                    className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {buyingLoading
                      ? "Processing..."
                      : paymentMethod === "COD"
                      ? "Place Order"
                      : paymentMethod === "PARTIAL"
                      ? `Pay ₹${Math.round(priceNum * 0.5).toLocaleString()} Now`
                      : `Pay ₹${priceNum.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
