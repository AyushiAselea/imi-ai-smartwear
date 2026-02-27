import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Glasses,
  Camera,
  Volume2,
  BatteryCharging,
  Fingerprint,
  Wifi,
  Eye,
  Mic,
} from "lucide-react";
import mark1Img from "@/assets/imi_mark1.png";
import mark2Img from "@/assets/imi_mark2.png";

interface SpecRow {
  icon: React.ElementType;
  label: string;
  mark1: string;
  mark2: string;
}

const specs: SpecRow[] = [
  {
    icon: Glasses,
    label: "Frame styles",
    mark1: "1 frame style\n2 colours",
    mark2: "1 frame style\n3 colours",
  },
  {
    icon: Eye,
    label: "Lens type",
    mark1: "Standard lenses",
    mark2: "UV Protected lenses",
  },
  {
    icon: Camera,
    label: "Camera",
    mark1: "—",
    mark2: "HD Photo & Video\n1080p at 30fps",
  },
  {
    icon: Volume2,
    label: "Audio",
    mark1: "Open-ear speakers\nHD sound",
    mark2: "Open-ear speakers\nHD sound",
  },
  {
    icon: BatteryCharging,
    label: "Battery",
    mark1: "Up to 6 hours\n+24 hrs with case",
    mark2: "Up to 8 hours\n+36 hrs with case",
  },
  {
    icon: Mic,
    label: "Voice AI",
    mark1: "Hey IMI\nGemini Live AI",
    mark2: "Hey IMI\nGemini Live AI",
  },
  {
    icon: Wifi,
    label: "Connectivity",
    mark1: "Bluetooth 5.3\nWi-Fi",
    mark2: "Bluetooth 5.3\nWi-Fi",
  },
  {
    icon: Fingerprint,
    label: "Controls",
    mark1: "Touchpad\nVoice control",
    mark2: "Touchpad & Capture button\nVoice control",
  },
];

const products = [
  {
    name: "IMI Mark 1",
    image: mark1Img,
    link: "/product/mark-1",
    premium: false,
  },
  {
    name: "IMI Mark 2",
    image: mark2Img,
    link: "/product/mark-2",
    premium: true,
  },
];

const ProductShowcaseSection = () => {
  return (
    <section id="products" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Two Versions. One Intelligent Future.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose the IMI that fits your lifestyle.
          </p>
        </motion.div>

        {/* Product cards row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-2 gap-6 md:gap-12 mb-6"
        >
          {products.map((p) => (
            <div key={p.name} className="flex flex-col items-center text-center">
              {/* Product image – clean white/transparent bg */}
              <div className="w-full flex items-center justify-center mb-6">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-48 md:w-64 h-auto object-contain"
                />
              </div>
              {/* Name */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                {p.name}
              </h3>
              {/* CTA */}
              <Link
                to={p.link}
                className={`inline-block px-8 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 ${
                  p.premium
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground text-background"
                }`}
              >
                Learn more
              </Link>
            </div>
          ))}
        </motion.div>

        {/* Separator */}
        <div className="grid grid-cols-2 gap-6 md:gap-12 mb-10">
          <div className="h-px bg-border" />
          <div className="h-px bg-border" />
        </div>

        {/* Specs rows */}
        <div className="space-y-10">
          {specs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="grid grid-cols-2 gap-6 md:gap-12"
            >
              {/* Mark 1 spec */}
              <div className="flex flex-col items-center text-center">
                <spec.icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-foreground mb-2"
                />
                <p className="text-sm md:text-base font-semibold text-foreground whitespace-pre-line leading-snug">
                  {spec.mark1.split("\n")[0]}
                </p>
                {spec.mark1.split("\n").slice(1).map((line, j) => (
                  <p
                    key={j}
                    className="text-xs md:text-sm text-muted-foreground leading-snug"
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Mark 2 spec */}
              <div className="flex flex-col items-center text-center">
                <spec.icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-foreground mb-2"
                />
                <p className="text-sm md:text-base font-semibold text-foreground whitespace-pre-line leading-snug">
                  {spec.mark2.split("\n")[0]}
                </p>
                {spec.mark2.split("\n").slice(1).map((line, j) => (
                  <p
                    key={j}
                    className="text-xs md:text-sm text-muted-foreground leading-snug"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
