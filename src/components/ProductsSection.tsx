import { motion } from "framer-motion";
import { Mic, Brain, Phone, Music, Eye, Camera, Wifi, Database } from "lucide-react";
import mark1Img from "@/assets/mark1-glasses.jpg";
import mark2Img from "@/assets/mark2-glasses.png";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/lib/api";

// Static fallback products (used when backend has no products)
const staticProducts = [
  {
    name: "IMI Mark 1",
    tagline: "Smart Everyday AI Glasses",
    description: "Affordable AI glasses built for everyday smart lifestyle.",
    image: mark1Img,
    features: [
      { icon: Mic, label: 'Voice Activation ("Hey IMI")' },
      { icon: Brain, label: "Real-Time AI Chat" },
      { icon: Phone, label: "Smart Calling" },
      { icon: Music, label: "Instant Music" },
      { icon: Database, label: "AI Memory" },
    ],
    cta: "Buy Mark 1",
    link: "/product/mark-1",
  },
  {
    name: "IMI Mark 2",
    tagline: "Advanced Vision AI Smart Glasses",
    description: "Next-generation AI glasses with camera and visual intelligence.",
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

              <img
                src={product.image}
                alt={`${product.name} - ${product.tagline}`}
                className="w-full aspect-square object-cover rounded-xl mb-8"
              />

              <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
              <p className="text-primary text-sm font-medium mb-3">{product.tagline}</p>
              <p className="text-muted-foreground text-sm mb-6">{product.description}</p>

              {product.features.length > 0 && (
                <div className="grid grid-cols-1 gap-3 mb-8 flex-1">
                  {product.features.map((f: any) => (
                    <div key={f.label} className="flex items-center gap-3 text-sm">
                      <f.icon size={16} className="text-primary shrink-0" />
                      <span className="text-foreground/80">{f.label}</span>
                    </div>
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
