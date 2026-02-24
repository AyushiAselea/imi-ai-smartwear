import { motion } from "framer-motion";

const features = [
  {
    id: "voice",
    headline: "Just Say Hey IMI",
    description: "Wake your AI instantly and control everything hands-free.",
    badge: "Voice Activation",
  },
  {
    id: "vision",
    headline: "See Smarter",
    description: "Ask what's in front of you and get instant visual intelligence.",
    badge: "Vision AI · Mark 2",
  },
  {
    id: "capture",
    headline: "Capture Life As You See It",
    description: "Record HD photos and videos directly from your glasses.",
    badge: "Smart Capture · Mark 2",
  },
  {
    id: "ai",
    headline: "Talk Naturally. Think Faster.",
    description: "Real-time AI chat integrated into your everyday life.",
    badge: "AI Conversations",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding">
      <div className="max-w-5xl mx-auto space-y-32">
        {features.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col ${i % 2 === 1 ? "items-end text-right" : "items-start text-left"}`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              {f.badge}
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 glow-text">
              {f.headline}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              {f.description}
            </p>
            <div className="mt-8 w-full max-w-lg h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
