import { motion } from "framer-motion";
import featureVoice from "@/assets/feature-voice.jpg";
import featureVision from "@/assets/feature-vision.jpeg";
import featureCapture from "@/assets/feature-capture.jpeg";
import featureAi from "@/assets/feature-ai.jpeg";

const features = [
  {
    id: "voice",
    headline: "Just Say Hey IMI",
    description: "Wake your AI instantly and control everything hands-free.",
    badge: "Voice Activation",
    image: featureVoice,
  },
  {
    id: "vision",
    headline: "See Smarter",
    description: "Ask what's in front of you and get instant visual intelligence.",
    badge: "Vision AI · Mark 2",
    image: featureVision,
  },
  {
    id: "capture",
    headline: "Capture Life As You See It",
    description: "Record HD photos and videos directly from your glasses.",
    badge: "Smart Capture · Mark 2",
    image: featureCapture,
  },
  {
    id: "ai",
    headline: "Talk Naturally. Think Faster.",
    description: "Real-time AI chat integrated into your everyday life.",
    badge: "AI Conversations",
    image: featureAi,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding">
      <div className="max-w-6xl mx-auto space-y-32">
        {features.map((f, i) => {
          const isReversed = i % 2 === 1;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-16`}
            >
              {/* Text */}
              <div className={`flex-1 ${isReversed ? "text-right" : "text-left"}`}>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">
                  {f.badge}
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 glow-text">
                  {f.headline}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                  {f.description}
                </p>
                <div className={`mt-8 w-full max-w-lg h-px bg-gradient-to-r ${isReversed ? "from-transparent via-primary/10 to-primary/40 ml-auto" : "from-primary/40 via-primary/10 to-transparent"}`} />
              </div>

              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative rounded-2xl overflow-hidden glow-border">
                  <img
                    src={f.image}
                    alt={f.headline}
                    className="w-full aspect-[3/2] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
