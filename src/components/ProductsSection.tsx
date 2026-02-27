import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database, Play, CloudSun, Newspaper, MapPin, FileText, Send, StickyNote, HelpCircle, Save, History, User, Video, Image, ScanSearch, Radio, MessageSquare } from "lucide-react";
import mark1Img from "@/assets/mark1-glasses.jpeg";
import mark2Img from "@/assets/mark2-glasses.jpeg";

// Gallery images
import gallery1 from "@/assets/WhatsApp Image 2026-02-25 at 7.34.08 PM.jpeg";
import gallery2 from "@/assets/mark_2_1.jpeg";
import gallery3 from "@/assets/WhatsApp Image 2026-02-25 at 7.34.53 PM.jpeg";
import gallery4 from "@/assets/WhatsApp Image 2026-02-25 at 7.35.36 PM.jpeg";
import gallery5 from "@/assets/mark_2_2.jpeg";
import gallery6 from "@/assets/mark_2_3.jpeg";

import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/lib/api";

interface FeatureCategory {
  title: string;
  emoji: string;
  features: { icon: any; label: string }[];
}

// Static fallback products (used when backend has no products)
const staticProducts = [
  {
    name: "IMI Mark 1",
    tagline: "Smart Everyday AI Glasses",
    description: "Affordable AI glasses built for everyday smart lifestyle.",
    image: mark1Img,
    gallery: [gallery1, gallery4, gallery3],
    features: [
      { icon: Mic, label: 'Voice Activation ("Hey IMI")' },
      { icon: Brain, label: "Real-Time AI Chat" },
      { icon: Phone, label: "Smart Calling" },
      { icon: Music, label: "Instant Music" },
      { icon: Database, label: "AI Memory" },
    ],
    featureCategories: [
      {
        title: "Voice / Audio Features",
        emoji: "🎤",
        features: [
          { icon: Mic, label: 'Wake Up AI – Say "Hey Imi"' },
          { icon: Brain, label: "Chat with AI (Gemini Live)" },
          { icon: Music, label: "Play Music" },
          { icon: Phone, label: "Make Calls" },
          { icon: CloudSun, label: "Weather Info" },
          { icon: Newspaper, label: "Latest News" },
          { icon: Send, label: "Send WhatsApp Messages" },
          { icon: StickyNote, label: "Quick Notes" },
          { icon: HelpCircle, label: "General AI Q&A" },
        ],
      },
      {
        title: "Data / Memory Features",
        emoji: "💾",
        features: [
          { icon: Brain, label: "AI Memory System" },
          { icon: History, label: "Chat History Saved" },
          { icon: Save, label: "Meeting History Stored" },
          { icon: User, label: "Personalized Responses" },
        ],
      },
    ] as FeatureCategory[],
    cta: "Buy Mark 1",
    link: "/product/mark-1",
  },
  {
    name: "IMI Mark 2",
    tagline: "Advanced Vision AI Smart Glasses",
    description: "Next-generation AI glasses with camera and visual intelligence.",
    image: mark2Img,
    gallery: [gallery2, gallery5, gallery6],
    premium: true,
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
          { icon: Brain, label: "Chat with AI (Gemini Live)" },
          { icon: Music, label: "Play Music" },
          { icon: Phone, label: "Make Calls" },
          { icon: CloudSun, label: "Weather Info" },
          { icon: Send, label: "Send WhatsApp Messages" },
          { icon: StickyNote, label: "Quick Notes" },
          { icon: HelpCircle, label: "General AI Q&A" },
        ],
      },
      {
        title: "Data / Memory Features",
        emoji: "💾",
        features: [
          { icon: Brain, label: "AI Memory System" },
          { icon: History, label: "Chat History Saved" },
          { icon: Save, label: "Meeting History Stored" },
          { icon: User, label: "Personalized Responses" },
        ],
      },
      {
        title: "Capture Features",
        emoji: "📸",
        features: [
          { icon: Camera, label: "Take Photos Instantly" },
          { icon: Video, label: "Record Video from Glasses" },
          { icon: Image, label: "View Photos & Videos in App" },
        ],
      },
      {
        title: "Vision AI Features",
        emoji: "👁️",
        features: [
          { icon: ScanSearch, label: "Image Analysis" },
          { icon: Radio, label: "Live Video Stream Analysis" },
          { icon: Eye, label: "Object Recognition" },
          { icon: MessageSquare, label: "Visual Assistance Mode" },
        ],
      },
    ] as FeatureCategory[],
    cta: "Buy Mark 2",
    link: "/product/mark-2",
  },
];

// Map icon name strings from backend to icon components
const iconMap: Record<string, any> = { Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database };

function mapBackendProduct(p: Product) {
  return {
    _id: p._id,
    name: p.name,
    tagline: p.category || "",
    description: p.description,
    image: p.image || p.images?.[0] || "",
    features: [] as { icon: any; label: string }[],
    cta: `Buy ${p.name}`,
    link: `/product/${p._id}`,
    premium: (p.category || "").toLowerCase().includes("premium"),
    price: p.price,
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" as const },
  }),
};

const ProductsSection = () => {
  const { products: backendProducts, loading } = useProducts();

  // Use backend products if available, otherwise fall back to static
  const displayProducts = backendProducts.length > 0
    ? backendProducts.map(mapBackendProduct)
    : staticProducts;

  return (
    <section id="products" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Two Versions. One Intelligent Future.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose the IMI that fits your lifestyle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden ${product.premium ? "glow-border" : "border border-border"} bg-card p-8 flex flex-col`}
            >
              {product.premium && (
                <span className="absolute top-4 right-4 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Premium
                </span>
              )}

              <Link to={product.link || (product.premium ? "/product/mark-2" : "/product/mark-1")}>
                <img
                  src={product.image}
                  alt={`${product.name} - ${product.tagline}`}
                  className="w-full aspect-square object-cover rounded-xl mb-8 hover:scale-[1.02] transition-transform duration-300"
                />
              </Link>

              {/* Gallery thumbnails */}
              {"gallery" in product && (product as any).gallery && (
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {(product as any).gallery.map((img: string, idx: number) => (
                    <Link key={idx} to={product.link || (product.premium ? "/product/mark-2" : "/product/mark-1")} className="rounded-lg overflow-hidden border border-border block">
                      <img
                        src={img}
                        alt={`${product.name} look ${idx + 1}`}
                        className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>
                  ))}
                </div>
              )}

              <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
              <p className="text-primary text-sm font-medium mb-3">{product.tagline}</p>
              <p className="text-muted-foreground text-sm mb-6">{product.description}</p>

              {product.features.length > 0 && (
                <div className="grid grid-cols-1 gap-3 mb-6 flex-1">
                  {product.features.map((f: any) => (
                    <div key={f.label} className="flex items-center gap-3 text-sm">
                      <f.icon size={16} className="text-primary shrink-0" />
                      <span className="text-foreground/80">{f.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Expandable Feature Categories */}
              {"featureCategories" in product && (product as any).featureCategories && (
                <div className="space-y-2 mb-8">
                  {(product as any).featureCategories.map((cat: FeatureCategory) => (
                    <details key={cat.title} className="group rounded-lg border border-border bg-background/50 overflow-hidden">
                      <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-secondary/50 transition-colors text-sm">
                        <span>{cat.emoji}</span>
                        <span className="font-medium text-foreground flex-1">{cat.title}</span>
                        <span className="text-xs text-muted-foreground group-open:hidden">{cat.features.length}</span>
                        <svg className="w-3.5 h-3.5 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </summary>
                      <div className="px-4 pb-3 space-y-2">
                        {cat.features.map((f: any) => (
                          <div key={f.label} className="flex items-start gap-2 text-xs">
                            <f.icon size={14} className="text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/70">{f.label}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              )}

              {"price" in product && product.price && (
                <p className="text-lg font-bold text-foreground mb-4">₹{product.price.toLocaleString("en-IN")}</p>
              )}

              <a
                href={product.link || (product.premium ? "/product/mark-2" : "/product/mark-1")}
                className={`block text-center py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 ${
                  product.premium
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {product.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
