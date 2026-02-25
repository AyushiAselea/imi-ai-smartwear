import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database, Shield, Truck, CreditCard, IndianRupee, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mark1Img from "@/assets/mark1-glasses.jpg";
import mark2Img from "@/assets/mark2-glasses.png";
import mark1Video from "@/assets/mark 1.mp4";
import mark2Video from "@/assets/mark 2.mp4";

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
  const product = slug ? productData[slug] : null;
  const [selectedVariant, setSelectedVariant] = useState("black");
  const [showVideo, setShowVideo] = useState(false);

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
              <button className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity">
                Buy Now — {product.price}
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
    </>
  );
};

export default ProductPage;
