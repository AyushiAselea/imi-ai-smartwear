import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database, Shield, Truck,
  CreditCard, IndianRupee, Play, X, MessageSquare, CloudSun, Newspaper,
  MapPin, FileText, Send, StickyNote, HelpCircle, Save, History, User,
  Video, Image, ScanSearch, Radio, ShoppingCart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ──────────────── Mark 1 product images (frame_glass) ──────────────── */
import m1_black_black from "@/assets/mark_1/mark1_black_black.png";
import m1_black_white from "@/assets/mark_1/mark1_black_white.png";
import m1_white_black from "@/assets/mark_1/mark1_white_black.png";
import m1_white_white from "@/assets/mark_1/mark1_white_white (1).png";
import m1_back_black from "@/assets/mark_1/mark1_back_black2.png";
import m1_black_balck1 from "@/assets/mark_1/mark1_black_balck1.png";
import m1_white_black2 from "@/assets/mark_1/mark1_white_black2.png";

/* ──────────────── Mark 2 product images (frame_glass) ──────────────── */
import m2_black_black from "@/assets/mark2/mark2_black_black.png";
import m2_black_white from "@/assets/mark2/mark2_black_white.png";
import m2_white_black from "@/assets/mark2/mark2_white_black.png";
import m2_white_white from "@/assets/mark2/mark2_white_white1.png";
import m2_blue_black from "@/assets/mark2/mark2_blue_black.png";
import m2_blue_white from "@/assets/mark2/mark2_blue_white.png";
import m2_black_black1 from "@/assets/mark2/mark2_black_black1.png";
import m2_black_white1 from "@/assets/mark2/mark2_black_white1.png";
import m2_blue_black1 from "@/assets/mark2/mark2_blue_black1.png";
import m2_white_black1 from "@/assets/mark2/mark2_white_black1.png";

/* ──────────────── Model / lifestyle shots ──────────────── */
import m1Model1 from "@/assets/mark1_models/WhatsApp Image 2026-02-25 at 7.34.08 PM.jpeg";
import m1Model2 from "@/assets/mark1_models/WhatsApp Image 2026-02-25 at 7.34.53 PM.jpeg";
import m1Model3 from "@/assets/mark1_models/WhatsApp Image 2026-02-25 at 7.35.03 PM.jpeg";
import m1Model4 from "@/assets/mark1_models/WhatsApp Image 2026-02-25 at 7.35.22 PM.jpeg";
import m1Model5 from "@/assets/mark1_models/WhatsApp Image 2026-02-25 at 7.35.36 PM.jpeg";
import m1Banner from "@/assets/mark2_models/app store deploy.jpg.jpeg";

import m2Model1 from "@/assets/mark2_models/mark_2_1.jpeg";
import m2Model2 from "@/assets/mark2_models/mark_2_2.jpeg";
import m2Model3 from "@/assets/mark2_models/mark_2_3.jpeg";
import m2Model4 from "@/assets/mark2_models/Imi web potr.1.jpg.jpeg";
import m2Model5 from "@/assets/mark2_models/imi web potr.3.jpg.jpeg";
import m2Model6 from "@/assets/mark2_models/imi web potr.4.jpg.jpeg";

import { startPayment } from "@/lib/payment";
import { updateCart, syncSocialUser } from "@/lib/api";
import type { ShippingAddress } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";

/* ================================================================== */
/*  TYPES                                                              */
/* ================================================================== */

interface GlassOption {
  id: string;
  label: string;
}

interface FrameVariant {
  id: string;
  label: string;
  colorHex: string;
  /** key = glass-option id, value = main product image */
  images: Record<string, string>;
  /** extra angle images for thumbnail strip (keyed by glass id) */
  extraImages: Record<string, string[]>;
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

interface FeatureCard {
  icon: any;
  title: string;
  description: string;
  video?: string;
  image?: string;
  wide?: boolean;
}

interface ProductInfo {
  name: string;
  tagline: string;
  description: string;
  price: string;
  originalPrice: string;
  video: string;
  premium?: boolean;
  glassOptions: GlassOption[];
  frameVariants: FrameVariant[];
  modelImages: string[];
  highlights: string[];
  technicalOverview: string;
  techSpecs: TechSpec[];
  featureCards: FeatureCard[];
  featureCategories: FeatureCategory[];
}

/* ================================================================== */
/*  PRODUCT DATA                                                       */
/* ================================================================== */

const CLD = "https://res.cloudinary.com/dvvifezwm/video/upload/f_auto,q_auto";
const mark1Video = `${CLD}/13_nov_imi_reel_2_vacfxr.mp4`;
const mark2Video = `https://res.cloudinary.com/dvvifezwm/video/upload/v1772089510/30_oct_reel_2_h4vt3k.mp4`;

const productData: Record<string, ProductInfo> = {
  "mark-1": {
    name: "IMI Mark 1",
    tagline: "Smart Everyday AI Glasses",
    description:
      "Affordable AI glasses built for everyday smart lifestyle. Voice-activated, AI-powered, and designed for the modern Indian user. Say \"Hey IMI\" and get answers quickly. The game will never be the same with IMI Mark 1.",
    price: "₹2,499",
    originalPrice: "₹5,999",
    video: mark1Video,
    glassOptions: [
      { id: "black", label: "Black Glass" },
      { id: "transparent", label: "Transparent" },
    ],
    frameVariants: [
      {
        id: "black",
        label: "Matte Black",
        colorHex: "#111",
        images: {
          black: m1_black_black,
          transparent: m1_black_white,
        },
        extraImages: {
          black: [m1_black_balck1, m1_back_black],
          transparent: [m1_black_balck1, m1_back_black],
        },
      },
      {
        id: "white",
        label: "Pearl White",
        colorHex: "#f5f5f5",
        images: {
          black: m1_white_black,
          transparent: m1_white_white,
        },
        extraImages: {
          black: [m1_white_black2, m1_back_black],
          transparent: [m1_white_black2, m1_back_black],
        },
      },
    ],
    modelImages: [m1Model1, m1Model2, m1Model3, m1Model4, m1Model5],
    highlights: [
      "Voice activation — just say \"Hey IMI\"",
      "Real-time AI chat powered by Gemini",
      "Smart calling & instant music",
      "Dual 55 mAh batteries + Type-C charging",
      "PVC frame with life-waterproof design",
      "AI memory that learns your preferences",
    ],
    technicalOverview:
      "The IMI MARK I Smart Glasses by IMI WEARABLES are advanced Bluetooth-enabled AI smart glasses designed for seamless connectivity and daily convenience. These stylish glasses feature Type-C charging and come equipped with dual 55mAh batteries for long-lasting performance. Built with a durable PVC frame and life waterproof design, they are ideal for everyday use.",
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
      { label: "Key Features", value: "Speaker, AI Assistant, Real-time Translation, Waterproof" },
    ],
    featureCards: [
      {
        icon: Brain,
        title: "IMI AI",
        description:
          'Say "Hey IMI" to get real-time AI answers. Get recommendations, check facts, plan trips, or discover local finds — all hands-free. IMI AI helps you take every aspect of your day to the max.',
        video: mark1Video,
        wide: true,
      },
      {
        icon: Music,
        title: "Immersive audio",
        description:
          "Enjoy your favourite music with speakers built right into the frames. Listen to Spotify, Apple Music, and more with just a tap.",
        image: m1Banner,
      },
      {
        icon: Phone,
        title: "Hands-free communication",
        description:
          "Make calls straight from your glasses. Send and receive texts and voice messages hands-free. You can even share your unique POV thanks to smart connectivity.",
        image: m1Banner,
      },
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
    description:
      "Next-generation AI glasses with camera and visual intelligence. See smarter, capture life, and talk naturally — all hands-free. Equipped with a Sony 818 8MP HD camera for stunning photos and video.",
    price: "₹11,999",
    originalPrice: "₹14,999",
    video: mark2Video,
    premium: true,
    glassOptions: [
      { id: "black", label: "Black Glass" },
      { id: "transparent", label: "Transparent" },
    ],
    frameVariants: [
      {
        id: "black",
        label: "Matte Black",
        colorHex: "#111",
        images: {
          black: m2_black_black,
          transparent: m2_black_white,
        },
        extraImages: {
          black: [m2_black_black1, m2_black_white1],
          transparent: [m2_black_white1, m2_black_black1],
        },
      },
      {
        id: "white",
        label: "Pearl White",
        colorHex: "#f5f5f5",
        images: {
          black: m2_white_black,
          transparent: m2_white_white,
        },
        extraImages: {
          black: [m2_white_black1, m2_black_white1],
          transparent: [m2_white_black1, m2_black_white1],
        },
      },
      {
        id: "blue",
        label: "Ocean Blue",
        colorHex: "#2563eb",
        images: {
          black: m2_blue_black,
          transparent: m2_blue_white,
        },
        extraImages: {
          black: [m2_blue_black1, m2_black_white1],
          transparent: [m2_blue_black1, m2_black_white1],
        },
      },
    ],
    modelImages: [m2Model1, m2Model2, m2Model3, m2Model4, m2Model5, m2Model6],
    highlights: [
      "Sony 818 8MP HD camera for UHD photos and videos",
      "Two discreet open-ear Bluetooth speakers + 5-mic array",
      "32 GB flash storage (1,000+ photos, 100+ 30s videos)",
      "Up to 1.5 hours battery life, magnetic Type-C charging",
      "Dual WiFi (5 GHz) + Bluetooth, range up to 210 m",
      "IP52 water resistance, only 42.5 g",
    ],
    technicalOverview:
      "IMI AI Glasses are next-generation smart eyewear designed for productivity, convenience, and style. Powered by a JL7018F Stereo ENC processor with Allwinner V821 auxiliary chipset, these glasses deliver fast performance with advanced noise reduction. Equipped with a Sony 818 8MP HD camera, IMI Glasses capture high-quality photos and videos with exceptional clarity.",
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
    featureCards: [
      {
        icon: Brain,
        title: "IMI AI",
        description:
          'Say "Hey IMI" to get real-time AI answers on anything. With Vision AI, your glasses can see what you see and give you instant context — all hands-free.',
        video: mark2Video,
        wide: true,
      },
      {
        icon: Camera,
        title: "Hands-free capture",
        description:
          "Capture the action as it happens with IMI Mark 2's 8MP camera. Take videos or photos from your unique POV. With just a \"Hey IMI\" or a tap, you can always get the shot.",
        image: m2Model1,
      },
      {
        icon: Music,
        title: "Immersive audio",
        description:
          "The open-ear design lets you enjoy your favourite music with speakers built straight into the frames. Listen to Spotify, Apple Music, and more with just a tap.",
        image: m2Model2,
      },
      {
        icon: Phone,
        title: "Hands-free communication",
        description:
          "Stay connected like never before. Make calls, send messages, and share your unique POV thanks to the built-in camera. The speakers feature an open-ear design for all-day comfort.",
        image: m2Model3,
      },
      {
        icon: Eye,
        title: "Vision AI",
        description:
          "Point your glasses at anything and ask. IMI's Vision AI identifies objects, reads text, translates languages, and provides real-time scene understanding.",
        image: m2Model4,
      },
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
          { icon: Video, label: "Record Video – Record videos from glasses camera" },
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
  },
};

const badges = [
  { icon: Truck, label: "Free Shipping" },
  { icon: Shield, label: "1 Year Warranty" },
  { icon: CreditCard, label: "EMI Available" },
  { icon: IndianRupee, label: "COD Available" },
];

/* ================================================================== */
/*  COMPONENT                                                          */
/* ================================================================== */

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const product = slug ? productData[slug] : null;

  const variantParam = searchParams.get("variant");
  const [selectedFrame, setSelectedFrame] = useState(
    variantParam && product?.frameVariants.some((v) => v.id === variantParam)
      ? variantParam
      : "black"
  );
  const [selectedGlass, setSelectedGlass] = useState("black");
  const [activeThumb, setActiveThumb] = useState(0); // 0 = main, 1/2 = extras
  const [showVideo, setShowVideo] = useState(false);
  const [buyingLoading, setBuyingLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { products: backendProducts } = useProducts();

  // Scroll to top + reset on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (variantParam && product?.frameVariants.some((v) => v.id === variantParam)) {
      setSelectedFrame(variantParam);
    }
    setActiveThumb(0);
    setShowVideo(false);
  }, [slug, variantParam]);

  // Reset thumb when selections change
  useEffect(() => {
    setActiveThumb(0);
    setShowVideo(false);
  }, [selectedFrame, selectedGlass]);

  /* ── Checkout modal state ── */
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

  /* ── Derived values ── */
  const frame = product?.frameVariants.find((v) => v.id === selectedFrame) || product?.frameVariants[0];
  const mainImage = frame?.images[selectedGlass] || "";
  const extraImages = frame?.extraImages[selectedGlass] || [];
  const allImages = [mainImage, ...extraImages];
  const currentImage = allImages[activeThumb] || mainImage;

  const getBackendProductId = (): string | null => {
    if (!product || backendProducts.length === 0) return null;
    const match = backendProducts.find(
      (bp: any) =>
        bp.name.toLowerCase().includes(product.name.toLowerCase().replace("imi ", "")) ||
        bp.name.toLowerCase() === product.name.toLowerCase()
    );
    return match ? match._id : null;
  };

  // Abandoned cart tracking
  useEffect(() => {
    if (product) {
      const sessionId =
        sessionStorage.getItem("imi_session_id") ||
        `s_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      if (!sessionStorage.getItem("imi_session_id")) sessionStorage.setItem("imi_session_id", sessionId);
      const priceNum = parseInt(product.price.replace(/[₹,]/g, ""));
      updateCart({
        sessionId,
        userId: user?.id,
        email: user?.email || "",
        products: [{ productId: slug || "", name: product.name, price: priceNum, quantity: 1, image: currentImage }],
        totalAmount: priceNum,
      });
    }
  }, [slug, product, user]);

  /* ── Buy / Cart handlers ── */
  const handleBuyNow = async () => {
    if (!user) { toast.info("Please sign in to continue with purchase"); navigate("/auth"); return; }
    let token = localStorage.getItem("imi_token") || "";
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
    if (!token) { toast.info("Please sign in again to continue"); navigate("/auth"); return; }
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

  const handleProceedToPayment = () => { if (!validateAddress()) return; setCheckoutStep("payment"); };

  const handleConfirmOrder = async () => {
    setBuyingLoading(true);
    try {
      const token = localStorage.getItem("imi_token") || "";
      if (!token) { toast.error("Session expired. Please sign in again."); navigate("/auth"); return; }
      const sessionId = sessionStorage.getItem("imi_session_id") || "";
      const backendProductId = getBackendProductId();
      const priceNum = parseInt(product!.price.replace(/[₹,]/g, ""));
      const payload = backendProductId ? { productId: backendProductId } : { productName: product!.name, price: priceNum };
      const result = await startPayment(payload, 1, token, paymentMethod, address, sessionId);
      if (result.type === "cod") { toast.success("Order placed successfully! Pay on delivery."); setShowCheckout(false); navigate("/payment/success?method=cod"); }
      // Clear cart after any successful purchase (COD or redirect)
      try { const { clearCartAPI } = await import("@/lib/api"); const tk = localStorage.getItem("imi_token"); if (tk) await clearCartAPI(tk); } catch {}
    } catch (err: any) { toast.error(err.message || "Payment failed. Please try again."); } finally { setBuyingLoading(false); }
  };

  const priceNum = product ? parseInt(product.price.replace(/[₹,]/g, "")) : 0;

  /* ── 404 ── */
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

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <>
      <Helmet>
        <title>{product.name} | IMI AI Smart Glasses India</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <Navbar />

      <main className="pt-28 pb-16 bg-background">
        {/* ═══════════════ HERO: IMAGE + DETAILS ═══════════════ */}
        <section className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* ── Left: Product image + thumbnails ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:sticky md:top-32"
            >
              {/* Main image */}
              <div className={`rounded-2xl overflow-hidden bg-white ${product.premium ? "glow-border" : "border border-border"}`}>
                {showVideo ? (
                  <video src={product.video} className="w-full aspect-square object-cover" controls autoPlay playsInline />
                ) : (
                  <img src={currentImage} alt={product.name} className="w-full aspect-square object-contain p-4" />
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveThumb(i); setShowVideo(false); }}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                      !showVideo && activeThumb === i ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
                {/* Video thumb */}
                <button
                  onClick={() => setShowVideo(true)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-black flex items-center justify-center ${
                    showVideo ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <Play size={20} className="text-white" />
                </button>
              </div>
            </motion.div>

            {/* ── Right: Product details ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              {product.premium && (
                <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Premium
                </span>
              )}

              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
                <p className="text-primary font-medium mt-1">{product.tagline}</p>
              </div>

              {/* Glass type selector (image thumbnails) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Glass Type</h3>
                <div className="flex gap-3">
                  {product.glassOptions.map((g) => {
                    const thumb = frame?.images[g.id] || "";
                    return (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGlass(g.id)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                          selectedGlass === g.id
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                          <img src={thumb} alt={g.label} className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="text-xs font-medium text-foreground">{g.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frame colour */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Frame colour:</h3>
                  <span className="text-sm font-semibold text-foreground">{frame?.label}</span>
                </div>
                <div className="flex gap-3">
                  {product.frameVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedFrame(v.id)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedFrame === v.id ? "border-primary ring-2 ring-primary/30 scale-110" : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                      title={v.label}
                    />
                  ))}
                </div>
              </div>

              {/* Powered by Gemini */}
              <div className="flex items-center gap-2.5 py-1">
                <span className="text-xs text-muted-foreground font-medium tracking-wide">AI powered by</span>
                <span className="flex items-center gap-1.5">
                  <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                    <path d="M14 1C14 1 16 11.5 22.5 14C16 16.5 14 27 14 27C14 27 12 16.5 5.5 14C12 11.5 14 1 14 1Z" fill="url(#g1)" />
                    <defs>
                      <linearGradient id="g1" x1="5.5" y1="27" x2="22.5" y2="1" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1AA260" />
                        <stop offset="33%" stopColor="#4285F4" />
                        <stop offset="66%" stopColor="#EA4335" />
                        <stop offset="100%" stopColor="#FBBC04" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-sm font-semibold text-foreground">Gemini</span>
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">{product.price}</span>
                <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                <span className="text-sm font-semibold text-primary">
                  Save {Math.round((1 - parseInt(product.price.replace(/[₹,]/g, "")) / parseInt(product.originalPrice.replace(/[₹,]/g, ""))) * 100)}%
                </span>
              </div>

              {/* Buy / Cart buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={buyingLoading}
                  className="flex-1 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {buyingLoading ? "Processing..." : `Buy Now — ${product.price}`}
                </button>
                <button
                  onClick={async () => {
                    if (!user) { toast.error("Please sign in to add items to cart"); navigate("/auth"); return; }
                    setAddingToCart(true);
                    try {
                      const priceNum = parseInt(product.price.replace(/[₹,]/g, ""));
                      await addToCart({ productId: slug || "", name: product.name, price: priceNum, image: currentImage, variant: selectedFrame });
                      toast.success("Added to cart!");
                    } catch (err: any) { toast.error(err.message || "Failed to add to cart"); } finally { setAddingToCart(false); }
                  }}
                  disabled={addingToCart}
                  className="flex-1 py-4 rounded-full border-2 border-primary text-primary font-semibold text-lg hover:bg-primary/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              </div>
              {slug === "mark-1" && (
                <p className="text-center text-xs font-semibold text-primary/80 tracking-wide">🔥 Limited offer — only for the first 100 users!</p>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {badges.map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <b.icon size={16} className="text-primary" />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ ABOUT SECTION (full-width below hero) ═══════════════ */}
        <section className="max-w-6xl mx-auto px-6 mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">About {product.name}</h2>
            <div className="grid md:grid-cols-2 gap-10">
              {/* Left: description */}
              <p className="text-muted-foreground leading-relaxed text-base">{product.description}</p>
              {/* Right: bullet highlights */}
              <ul className="space-y-3">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/85">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ FEATURES SECTION ═══════════════ */}
        <section className="max-w-6xl mx-auto px-6 mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">Features</h2>
              <div className="h-px flex-1 ml-6 bg-border" />
            </div>

            {/* Feature cards */}
            <div className="space-y-6">
              {product.featureCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08 }}
                  className={`grid ${card.wide ? "md:grid-cols-[1fr_1.2fr]" : "md:grid-cols-2"} gap-6 items-center ${
                    i > 0 && !card.wide ? "" : ""
                  }`}
                >
                  {/* Text */}
                  <div className={`space-y-3 ${i % 2 !== 0 && !card.wide ? "md:order-2" : ""}`}>
                    <div className="flex items-center gap-2">
                      <card.icon size={20} className="text-primary" />
                      <h3 className="text-lg font-bold">{card.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                  {/* Media */}
                  <div className={`rounded-2xl overflow-hidden bg-muted ${i % 2 !== 0 && !card.wide ? "md:order-1" : ""}`}>
                    {card.video ? (
                      <div className="relative group cursor-pointer aspect-video">
                        <video src={card.video} className="w-full h-full object-cover" muted playsInline loop preload="metadata"
                          onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                          onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={18} className="text-black ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : card.image ? (
                      <img src={card.image} alt={card.title} className="w-full aspect-video object-cover" loading="lazy" />
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detailed collapsible feature categories */}
            <div className="space-y-4 mt-12">
              <h3 className="text-lg font-bold mb-4">All Features</h3>
              {product.featureCategories.map((cat) => (
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
          </motion.div>
        </section>

        {/* ═══════════════ TECH SPECS ═══════════════ */}
        <section className="max-w-6xl mx-auto px-6 mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Technical Specifications</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-3xl">{product.technicalOverview}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
              {product.techSpecs.map((spec) => (
                <div key={spec.label} className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{spec.label}</span>
                  <span className="text-sm text-foreground font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ MODEL / LIFESTYLE GALLERY ═══════════════ */}
        <section className="max-w-6xl mx-auto px-6 mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Style Meets Intelligence</h2>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">Designed to look effortless, engineered to think ahead.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.modelImages.map((img, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden ${product.premium ? "glow-border" : "border border-border"} group`}>
                  <img src={img} alt={`${product.name} look ${i + 1}`} className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ ALL MODELS ═══════════════ */}
        <section className="max-w-6xl mx-auto px-6 mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Explore All Models</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(productData).flatMap(([key, p]) =>
                p.frameVariants.map((v) => (
                  <Link
                    key={`${key}-${v.id}`}
                    to={`/product/${key}?variant=${v.id}`}
                    onClick={() => { if (key === slug) setSelectedFrame(v.id); }}
                    className={`rounded-2xl border bg-card p-4 hover:border-primary/50 transition-colors group ${
                      slug === key && selectedFrame === v.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-white">
                      <img src={v.images.black} alt={`${p.name} - ${v.label}`} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <h3 className="font-bold text-base">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: v.colorHex }} />
                      <span className="text-sm text-muted-foreground">{v.label}</span>
                    </div>
                    <p className="text-primary font-semibold mt-2">{p.price}</p>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />

      {/* ═══════════════ CHECKOUT MODAL ═══════════════ */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">{checkoutStep === "address" ? "Shipping Address" : "Payment Method"}</h2>
              <button onClick={() => setShowCheckout(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
            </div>

            {checkoutStep === "address" && (
              <div className="space-y-3">
                <input type="text" placeholder="Full Name *" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                <input type="tel" placeholder="Phone Number *" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                <input type="text" placeholder="Address Line 1 *" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                <input type="text" placeholder="Address Line 2 (Optional)" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="City *" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                  <input type="text" placeholder="State *" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="PIN Code *" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                  <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                </div>
                <button onClick={handleProceedToPayment} className="w-full py-3 mt-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">Continue to Payment</button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="space-y-4">
                <div className="rounded-xl bg-background border border-border p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Product</span><span className="text-foreground font-medium">{product?.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="text-foreground font-bold">₹{priceNum.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Ship to</span><span className="text-foreground text-right text-xs max-w-[60%]">{address.addressLine1}, {address.city}</span></div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Choose Payment</p>
                  {([
                    { id: "ONLINE" as const, title: "Pay Full Amount Online", desc: `₹${priceNum.toLocaleString()} via PayU (UPI / Card / Net Banking)` },
                    { id: "COD" as const, title: "Cash on Delivery", desc: `Pay ₹${priceNum.toLocaleString()} when delivered` },
                    { id: "PARTIAL" as const, title: "Pay 50% Now", desc: `Pay ₹${Math.round(priceNum * 0.5).toLocaleString()} now · ₹${Math.round(priceNum * 0.5).toLocaleString()} on delivery` },
                  ]).map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"}`}>
                      <input type="radio" name="pm" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="accent-primary" />
                      <div className="flex-1"><p className="text-sm font-medium text-foreground">{opt.title}</p><p className="text-xs text-muted-foreground">{opt.desc}</p></div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setCheckoutStep("address")} className="flex-1 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">Back</button>
                  <button onClick={handleConfirmOrder} disabled={buyingLoading} className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                    {buyingLoading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : paymentMethod === "PARTIAL" ? `Pay ₹${Math.round(priceNum * 0.5).toLocaleString()} Now` : `Pay ₹${priceNum.toLocaleString()}`}
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
