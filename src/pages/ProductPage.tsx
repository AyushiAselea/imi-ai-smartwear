import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database, Shield, Truck, CreditCard, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mark1Img from "@/assets/mark1-glasses.jpg";
import mark2Img from "@/assets/mark2-glasses.jpg";

const productData: Record<string, any> = {
  "mark-1": {
    name: "IMI Mark 1",
    tagline: "Smart Everyday AI Glasses",
    description: "Affordable AI glasses built for everyday smart lifestyle. Voice-activated, AI-powered, and designed for the modern Indian user.",
    price: "₹3,999",
    originalPrice: "₹5,999",
    image: mark1Img,
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
    premium: true,
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
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-28"
            >
              <div className={`rounded-2xl overflow-hidden ${product.premium ? "glow-border" : "border border-border"}`}>
                <img
                  src={product.image}
                  alt={`${product.name} - ${product.tagline}`}
                  className="w-full aspect-square object-cover"
                />
              </div>
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
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductPage;
