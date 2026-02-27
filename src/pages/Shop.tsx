import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import mark1Img from "@/assets/mark_1/mark1_black_black.png";
import mark1WhiteImg from "@/assets/mark_1/mark1_white_black.png";
import mark2Img from "@/assets/mark2/mark2_black_black.png";
import mark2WhiteImg from "@/assets/mark2/mark2_white_black.png";
import mark2BlueImg from "@/assets/mark2/mark2_blue_black.png";

interface ProductCard {
  slug: string;
  name: string;
  variant: string;
  variantColor: string;
  tagline: string;
  price: string;
  originalPrice: string;
  image: string;
  premium?: boolean;
  upcoming?: boolean;
  features: { icon: any; label: string }[];
}

const allProducts: ProductCard[] = [
  // Mark 1
  {
    slug: "mark-1",
    name: "IMI Mark 1",
    variant: "Matte Black",
    variantColor: "bg-gray-900",
    tagline: "Smart Everyday AI Glasses",
    price: "₹2,499",
    originalPrice: "₹5,999",
    image: mark1Img,
    features: [
      { icon: Mic, label: "Voice Activation" },
      { icon: Brain, label: "Real-Time AI Chat" },
      { icon: Phone, label: "Smart Calling" },
      { icon: Music, label: "Instant Music" },
      { icon: Database, label: "AI Memory" },
    ],
  },
  {
    slug: "mark-1",
    name: "IMI Mark 1",
    variant: "Pearl White",
    variantColor: "bg-white border border-gray-300",
    tagline: "Smart Everyday AI Glasses",
    price: "₹2,499",
    originalPrice: "₹5,999",
    image: mark1WhiteImg,
    features: [
      { icon: Mic, label: "Voice Activation" },
      { icon: Brain, label: "Real-Time AI Chat" },
      { icon: Phone, label: "Smart Calling" },
      { icon: Music, label: "Instant Music" },
      { icon: Database, label: "AI Memory" },
    ],
  },
  // Mark 2
  {
    slug: "mark-2",
    name: "IMI Mark 2",
    variant: "Matte Black",
    variantColor: "bg-gray-900",
    tagline: "Advanced Vision AI Smart Glasses",
    price: "₹11,999",
    originalPrice: "₹14,999",
    image: mark2Img,
    premium: true,
    features: [
      { icon: Mic, label: "AI Voice Assistant" },
      { icon: Eye, label: "Real-Time Vision AI" },
      { icon: Camera, label: "Smart Capture" },
      { icon: Brain, label: "Live AI Chat" },
      { icon: Wifi, label: "Smart Connectivity" },
      { icon: Database, label: "AI Memory" },
    ],
  },
  {
    slug: "mark-2",
    name: "IMI Mark 2",
    variant: "Pearl White",
    variantColor: "bg-white border border-gray-300",
    tagline: "Advanced Vision AI Smart Glasses",
    price: "₹11,999",
    originalPrice: "₹14,999",
    image: mark2WhiteImg,
    premium: true,
    features: [
      { icon: Mic, label: "AI Voice Assistant" },
      { icon: Eye, label: "Real-Time Vision AI" },
      { icon: Camera, label: "Smart Capture" },
      { icon: Brain, label: "Live AI Chat" },
      { icon: Wifi, label: "Smart Connectivity" },
      { icon: Database, label: "AI Memory" },
    ],
  },
  {
    slug: "mark-2",
    name: "IMI Mark 2",
    variant: "Ocean Blue",
    variantColor: "bg-blue-600",
    tagline: "Advanced Vision AI Smart Glasses",
    price: "₹11,999",
    originalPrice: "₹14,999",
    image: mark2BlueImg,
    premium: true,
    features: [
      { icon: Mic, label: "AI Voice Assistant" },
      { icon: Eye, label: "Real-Time Vision AI" },
      { icon: Camera, label: "Smart Capture" },
      { icon: Brain, label: "Live AI Chat" },
      { icon: Wifi, label: "Smart Connectivity" },
      { icon: Database, label: "AI Memory" },
    ],
  },
  // Mark 2 Pro — Upcoming
  {
    slug: "",
    name: "IMI Mark 2 Pro",
    variant: "Coming Soon",
    variantColor: "bg-gradient-to-r from-primary to-purple-500",
    tagline: "The Future of AI Eyewear",
    price: "TBA",
    originalPrice: "",
    image: "",
    premium: true,
    upcoming: true,
    features: [
      { icon: Eye, label: "Advanced Vision AI" },
      { icon: Camera, label: "4K Smart Capture" },
      { icon: Brain, label: "On-Device AI" },
      { icon: Wifi, label: "5G Connectivity" },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Shop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shop All Products | IMI AI Smart Glasses</title>
        <meta name="description" content="Browse all IMI smart glasses — Mark 1, Mark 2, and the upcoming Mark 2 Pro. Find the perfect AI eyewear for your lifestyle." />
      </Helmet>
      <Navbar />
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 glow-text">
              Shop All Products
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Choose from our full range of AI-powered smart glasses.
            </p>
          </motion.div>

          {/* Mark 1 Section */}
          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3"
            >
              <span className="w-2 h-8 rounded-full bg-primary" />
              IMI Mark 1
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts
                .filter((p) => p.name === "IMI Mark 1")
                .map((product, i) => (
                  <ProductCardItem key={`mark1-${i}`} product={product} index={i} />
                ))}
            </div>
          </div>

          {/* Mark 2 Section */}
          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3"
            >
              <span className="w-2 h-8 rounded-full bg-primary" />
              IMI Mark 2
              <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                Premium
              </span>
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts
                .filter((p) => p.name === "IMI Mark 2")
                .map((product, i) => (
                  <ProductCardItem key={`mark2-${i}`} product={product} index={i} />
                ))}
            </div>
          </div>

          {/* Mark 2 Pro — Upcoming */}
          <div className="mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3"
            >
              <span className="w-2 h-8 rounded-full bg-gradient-to-b from-primary to-purple-500" />
              IMI Mark 2 Pro
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                Upcoming
              </span>
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts
                .filter((p) => p.upcoming)
                .map((product, i) => (
                  <ProductCardItem key={`pro-${i}`} product={product} index={i} />
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

/* ─── Single Product Card ─── */
const ProductCardItem = ({ product, index }: { product: ProductCard; index: number }) => {
  const isUpcoming = product.upcoming;

  const cardContent = (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`relative rounded-2xl overflow-hidden bg-card flex flex-col transition-all duration-300 ${
        isUpcoming
          ? "border-2 border-dashed border-purple-500/40"
          : product.premium
          ? "glow-border hover:shadow-xl hover:shadow-primary/5"
          : "border border-border hover:border-primary/40 hover:shadow-lg"
      } ${!isUpcoming ? "group cursor-pointer" : ""}`}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted relative">
        {isUpcoming ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-950/40 via-background to-primary/10">
            <Clock size={48} className="text-purple-400 mb-4" />
            <p className="text-lg font-semibold text-purple-300">Coming Soon</p>
            <p className="text-sm text-muted-foreground mt-1">Stay tuned for updates</p>
          </div>
        ) : (
          <img
            src={product.image}
            alt={`${product.name} - ${product.variant}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}

        {/* Badges */}
        {product.premium && !isUpcoming && (
          <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
            Premium
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${product.variantColor}`} />
          <span className="text-sm text-muted-foreground">{product.variant}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{product.tagline}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mt-4">
          {product.features.slice(0, 4).map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-secondary/60 px-2 py-1 rounded-full"
            >
              <f.icon size={12} className="text-primary" />
              {f.label}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="mt-auto pt-5 flex items-center justify-between">
          {isUpcoming ? (
            <span className="text-sm font-semibold text-purple-400">Price TBA</span>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">{product.price}</span>
              <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
            </div>
          )}
          {!isUpcoming && (
            <span className="text-xs font-semibold text-primary group-hover:underline">
              View Details →
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isUpcoming) return cardContent;

  // Map variant display name to URL variant ID
  const variantId = product.variant === "Pearl White" ? "white"
    : product.variant === "Ocean Blue" ? "blue"
    : "black";

  return (
    <Link to={`/product/${product.slug}?variant=${variantId}`}>
      {cardContent}
    </Link>
  );
};

export default Shop;
