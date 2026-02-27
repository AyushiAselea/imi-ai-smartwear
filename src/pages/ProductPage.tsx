import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database, Shield, Truck, CreditCard, IndianRupee, Play, X, MessageSquare, CloudSun, Newspaper, MapPin, FileText, Send, StickyNote, HelpCircle, Save, History, User, Video, Image, ScanSearch, Radio, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mark1Img from "@/assets/mark1-glasses.jpeg";
import mark1WhiteImg from "@/assets/mark_1_white.jpeg";
import mark2Img from "@/assets/mark2-glasses.png";
import mark2WhiteImg from "@/assets/mark2_white.jpeg";
import mark2BlueImg from "@/assets/mark2_blue.jpeg";

// Gallery images for Mark 1 & Mark 2 showcase
import gallery1 from "@/assets/WhatsApp Image 2026-02-25 at 7.34.08 PM.jpeg";
import gallery3 from "@/assets/WhatsApp Image 2026-02-25 at 7.34.53 PM.jpeg";
import gallery4 from "@/assets/WhatsApp Image 2026-02-25 at 7.35.03 PM.jpeg";
import mark2Gallery1 from "@/assets/mark_2_1.jpeg";
import mark2Gallery2 from "@/assets/mark_2_2.jpeg";
import mark2Gallery3 from "@/assets/mark_2_3.jpeg";

const mark1Gallery = [gallery1, gallery4, gallery3];
const mark2Gallery = [mark2Gallery1, mark2Gallery2, mark2Gallery3];
const CLD = "https://res.cloudinary.com/dvvifezwm/video/upload/f_auto,q_auto";
const mark1Video = `${CLD}/13_nov_imi_reel_2_vacfxr.mp4`;
const mark2Video = `https://res.cloudinary.com/dvvifezwm/video/upload/v1772089510/30_oct_reel_2_h4vt3k.mp4`;
import { startPayment } from "@/lib/payment";
import { updateCart, syncSocialUser } from "@/lib/api";
import type { ShippingAddress } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";

interface Variant {
  id: string;
  label: string;
  color: string;
  colorHex: string;
  image: string;
}

interface FeatureCategory {
  title: string;
  emoji: string;
  features: { icon: any; label: string }[];
}

interface TechSpec {
  label: string;
  value: string;
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
  featureCategories: FeatureCategory[];
  technicalOverview: string;
  techSpecs: TechSpec[];
}

const productData: Record<string, ProductInfo> = {
  "mark-1": {
    name: "IMI Mark 1",
    tagline: "Smart Everyday AI Glasses",
    description: "Affordable AI glasses built for everyday smart lifestyle. Voice-activated, AI-powered, and designed for the modern Indian user.",
    price: "₹2,499",
    originalPrice: "₹5,999",
    image: mark1Img,
    video: mark1Video,
    variants: [
      { id: "black", label: "Matte Black", color: "bg-gray-900", colorHex: "#111", image: mark1Img },
      { id: "white", label: "Pearl White", color: "bg-white border border-gray-300", colorHex: "#f5f5f5", image: mark1WhiteImg },
    ],
    features: [
      { icon: Mic, label: 'Voice Activation ("Hey IMI")' },
      { icon: Brain, label: "Real-Time AI Chat" },
      { icon: Phone, label: "Smart Calling" },
      { icon: Music, label: "Instant Music" },
      { icon: Database, label: "AI Memory" },
    ],
    technicalOverview: "The IMI MARK I Smart Glasses by IMI WEARABLES are advanced Bluetooth-enabled AI smart glasses designed for seamless connectivity and daily convenience. These stylish glasses feature Type-C charging and come equipped with dual 55mAh batteries for long-lasting performance. Built with a durable PVC frame and life waterproof design, they are ideal for everyday use. Powered by the Hyper MZT app, the MARK I Smart Glasses offer App Control functionality, enabling users to manage multiple smart features effortlessly. Key functions include wireless calling, music playback, voice assistant integration, real-time AI translation, weather updates, gaming support, and even a remote camera feature. Perfect for multitaskers and tech enthusiasts, these glasses combine style, innovation, and practicality — delivering a truly smart wearable experience in a sleek, modern design.",
    techSpecs: [
      { label: "Product Type", value: "AI Smart Glasses (App Controlled)" },
      { label: "Battery", value: "55mAh + 55mAh" },
      { label: "Charging", value: "Type-C" },
      { label: "Frame Material", value: "PVC" },
      { label: "Package Size", value: "19 × 8 × 7 cm" },
      { label: "Gross Weight", value: "0.350 kg" },
      { label: "Connectivity", value: "Bluetooth" },
      { label: "App", value: "Hyper MZT" },
      { label: "Water Resistance", value: "Life Waterproof" },
      { label: "Key Features", value: "Speaker, AI Assistant, Real-time Translation, Waterproof Design" },
    ],
    featureCategories: [
      {
        title: "Voice / Audio Features",
        emoji: "🎤",
        features: [
          { icon: Mic, label: 'Wake Up AI – Say "Hey Imi"' },
          { icon: Brain, label: "Chat with AI (Gemini Live) – Real-time voice conversation" },
          { icon: Music, label: "Play Music – \"Play a song\"" },
          { icon: Play, label: "Open YouTube – \"Open YouTube\"" },
          { icon: Phone, label: "Make Calls – \"Call someone\"" },
          { icon: CloudSun, label: "Weather Info – \"What's the weather?\"" },
          { icon: Newspaper, label: "Latest News – Ask for current news" },
          { icon: MapPin, label: "Plan Trips – \"Distance between cities\"" },
          { icon: FileText, label: "Record Meeting Notes – \"Start meeting minutes\"" },
          { icon: Send, label: "Send WhatsApp Messages – Auto-send via voice command" },
          { icon: StickyNote, label: "Quick Notes – Instantly save short voice/text notes" },
          { icon: HelpCircle, label: "General AI Q&A – Ask anything like a smart assistant" },
        ],
      },
      {
        title: "Data / Memory Features",
        emoji: "💾",
        features: [
          { icon: Brain, label: "AI Memory System – Learns user preferences" },
          { icon: History, label: "Chat History Saved – Conversation context remembered" },
          { icon: Save, label: "Meeting History Stored – Save & review transcriptions" },
          { icon: StickyNote, label: "Saved Quick Notes – View, edit, or delete anytime" },
          { icon: User, label: "Personalized Responses – AI adapts to user behavior" },
        ],
      },
    ],
  },
  "mark-2": {
    name: "IMI Mark 2",
    tagline: "Advanced Vision AI Smart Glasses",
    description: "Next-generation AI glasses with camera and visual intelligence. See smarter, capture life, and talk naturally — all hands-free.",
    price: "₹11,999",
    originalPrice: "₹14,999",
    image: mark2Img,
    video: mark2Video,
    premium: true,
    variants: [
      { id: "black", label: "Matte Black", color: "bg-gray-900", colorHex: "#111", image: mark2Img },
      { id: "white", label: "Pearl White", color: "bg-white border border-gray-300", colorHex: "#f5f5f5", image: mark2WhiteImg },
      { id: "blue", label: "Ocean Blue", color: "bg-blue-600", colorHex: "#2563eb", image: mark2BlueImg },
    ],
    features: [
      { icon: Mic, label: "AI Voice Assistant" },
      { icon: Eye, label: "Real-Time Vision AI" },
      { icon: Camera, label: "Smart Capture (HD Photo & Video)" },
      { icon: Brain, label: "Live AI Chat" },
      { icon: Wifi, label: "Smart Connectivity" },
      { icon: Database, label: "Personal AI Memory" },
    ],
    featureCategories: [
      {
        title: "Voice / Audio Features",
        emoji: "🎤",
        features: [
          { icon: Mic, label: 'Wake Up AI – Say "Hey Imi"' },
          { icon: Brain, label: "Chat with AI (Gemini Live) – Real-time voice conversation" },
          { icon: Music, label: "Play Music – \"Play a song\"" },
          { icon: Play, label: "Open YouTube – \"Open YouTube\"" },
          { icon: Phone, label: "Make Calls – \"Call someone\"" },
          { icon: CloudSun, label: "Weather Info – \"What's the weather?\"" },
          { icon: Newspaper, label: "Latest News – Ask for current news" },
          { icon: MapPin, label: "Plan Trips – \"Distance between cities\"" },
          { icon: FileText, label: "Record Meeting Notes – \"Start meeting minutes\"" },
          { icon: Send, label: "Send WhatsApp Messages – Auto-send via voice command" },
          { icon: StickyNote, label: "Quick Notes – Instantly save short voice/text notes" },
          { icon: HelpCircle, label: "General AI Q&A – Ask anything like a smart assistant" },
        ],
      },
      {
        title: "Data / Memory Features",
        emoji: "💾",
        features: [
          { icon: Brain, label: "AI Memory System – Learns user preferences" },
          { icon: History, label: "Chat History Saved – Conversation context remembered" },
          { icon: Save, label: "Meeting History Stored – Save & review transcriptions" },
          { icon: StickyNote, label: "Saved Quick Notes – View, edit, or delete anytime" },
          { icon: User, label: "Personalized Responses – AI adapts to user behavior" },
        ],
      },
      {
        title: "Capture Features",
        emoji: "📸",
        features: [
          { icon: Camera, label: "Take Photos – Capture images instantly" },
          { icon: Video, label: "Record Video – Record videos directly from glasses camera" },
          { icon: Image, label: "View Photos & Videos – Access gallery inside the app" },
        ],
      },
      {
        title: "Vision AI Features",
        emoji: "👁️",
        features: [
          { icon: ScanSearch, label: "Image Analysis – \"What is in front of me?\"" },
          { icon: Radio, label: "Live Video Stream Analysis – Real-time scene understanding" },
          { icon: Eye, label: "Object Recognition – Detect objects or text" },
          { icon: MessageSquare, label: "Visual Assistance Mode – Describe surroundings" },
        ],
      },
    ],
    technicalOverview: "IMI AI Glasses are next-generation smart eyewear designed for productivity, convenience, and style. Powered by a JL7018F Stereo ENC processor with Allwinner V821 auxiliary chipset, these glasses deliver fast performance with advanced noise reduction capabilities. Equipped with a Sony 818 8MP HD camera, IMI Glasses capture high-quality photos and videos with exceptional clarity, making them ideal for real-time streaming, documentation, and AI-based features. The glasses include 32GB of built-in memory, providing ample space for recordings and app data. Connectivity is seamless with dual WiFi (5GHz) and Bluetooth, offering a strong and stable range of up to 210 meters. Audio performance is enhanced with 150Ω H3.0 speakers and ENC (Environmental Noise Cancellation), ensuring clear music playback and crystal-clear voice calls. Crafted from premium PC and ABS materials, the frame is both lightweight and durable, weighing only 42.5 grams for extended comfort during daily wear.",
    techSpecs: [
      { label: "Processor", value: "JL7018F Stereo ENC + Allwinner V821" },
      { label: "Camera", value: "Sony 818 8MP HD" },
      { label: "Storage", value: "32GB Built-in Memory" },
      { label: "Battery", value: "270mAh Li-Polymer" },
      { label: "Playback Time", value: "Up to 1.5 hours" },
      { label: "Charging", value: "Magnetic Type-C (2hr)" },
      { label: "Connectivity", value: "Dual WiFi (5GHz) + Bluetooth" },
      { label: "Range", value: "Up to 210 meters" },
      { label: "Speakers", value: "150Ω H3.0 with ENC" },
      { label: "Frame Material", value: "PC + ABS" },
      { label: "Weight", value: "42.5 grams" },
      { label: "Water Resistance", value: "IP52" },
      { label: "App", value: "IMI Glasses (Android & iOS)" },
      { label: "Languages", value: "25+ Real-time Translation" },
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const product = slug ? productData[slug] : null;
  const variantParam = searchParams.get("variant");
  const [selectedVariant, setSelectedVariant] = useState(
    variantParam && product?.variants.some(v => v.id === variantParam) ? variantParam : "black"
  );
  const [showVideo, setShowVideo] = useState(false);
  const [buyingLoading, setBuyingLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { products: backendProducts } = useProducts();

  // Scroll to top and update variant when URL changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (variantParam && product?.variants.some(v => v.id === variantParam)) {
      setSelectedVariant(variantParam);
    }
  }, [slug, variantParam]);

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

  // Derive current image from selected variant
  const currentImage = product
    ? (product.variants.find((v) => v.id === selectedVariant)?.image || product.image)
    : "";

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
            image: currentImage,
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
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Product Image / Video */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:sticky md:top-36 space-y-4"
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
                    src={currentImage}
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
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Key Features</h3>
                {product.features.map((f: any) => (
                  <div key={f.label} className="flex items-center gap-3 text-sm">
                    <f.icon size={18} className="text-primary shrink-0" />
                    <span className="text-foreground/80">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Detailed Feature Categories */}
              {product.featureCategories && (
                <div className="space-y-6 pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">All Features</h3>
                  {product.featureCategories.map((cat: any) => (
                    <details key={cat.title} className="group rounded-xl border border-border bg-card/50 overflow-hidden">
                      <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="font-semibold text-sm text-foreground flex-1">{cat.title}</span>
                        <span className="text-xs text-muted-foreground group-open:hidden">{cat.features.length} features</span>
                        <svg className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </summary>
                      <div className="px-5 pb-4 space-y-2.5">
                        {cat.features.map((f: any) => (
                          <div key={f.label} className="flex items-start gap-3 text-sm">
                            <f.icon size={16} className="text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{f.label}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              )}

              {/* Technical Overview */}
              {product.technicalOverview && (
                <details className="group border border-border rounded-2xl overflow-hidden">
                  <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none hover:bg-muted/50 transition-colors">
                    <span className="text-lg">📋</span>
                    <span className="font-semibold text-sm text-foreground flex-1">Technical Overview</span>
                    <svg className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="px-5 pb-5 space-y-4">
                    <p className="text-sm text-foreground/75 leading-relaxed">{product.technicalOverview}</p>
                    {product.techSpecs && product.techSpecs.length > 0 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        {product.techSpecs.map((spec) => (
                          <div key={spec.label} className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{spec.label}</span>
                            <span className="text-sm text-foreground">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    if (!user) {
                      toast.error("Please sign in to add items to cart");
                      navigate("/auth");
                      return;
                    }
                    setAddingToCart(true);
                    try {
                      const priceNum = parseInt(product.price.replace(/[₹,]/g, ""));
                      await addToCart({
                        productId: slug || "",
                        name: product.name,
                        price: priceNum,
                        image: currentImage,
                        variant: selectedVariant,
                      });
                      toast.success("Added to cart!");
                    } catch (err: any) {
                      toast.error(err.message || "Failed to add to cart");
                    } finally {
                      setAddingToCart(false);
                    }
                  }}
                  disabled={addingToCart}
                  className="flex-1 py-4 rounded-full border-2 border-primary text-primary font-semibold text-lg hover:bg-primary/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={buyingLoading}
                  className="flex-1 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {buyingLoading ? "Processing..." : `Buy Now — ${product.price}`}
                </button>
              </div>

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

          {/* Mark 1 & Mark 2 Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">Style Meets Intelligence</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Designed to look effortless, engineered to think ahead.</p>

            {/* Product Gallery — only show current model */}
            {(() => {
              const gallery = slug === "mark-1" ? mark1Gallery : mark2Gallery;
              const label = slug === "mark-1" ? "IMI Mark 1" : "IMI Mark 2";
              const borderCls = slug === "mark-2" ? "glow-border" : "border border-border";
              return (
                <div className="mb-16">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-primary" />
                    {label}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map((img, idx) => (
                      <div key={`g-${idx}`} className={`rounded-2xl overflow-hidden ${borderCls} group`}>
                        <img
                          src={img}
                          alt={`${label} - Look ${idx + 1}`}
                          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </motion.div>

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
                    to={`/product/${key}?variant=${v.id}`}
                    onClick={() => { if (key === slug) setSelectedVariant(v.id); }}
                    className={`rounded-2xl border bg-card p-4 hover:border-primary/50 transition-colors group ${
                      slug === key && selectedVariant === v.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-muted">
                      <img
                        src={v.image}
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
