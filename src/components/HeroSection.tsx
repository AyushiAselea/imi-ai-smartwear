import { motion } from "framer-motion";
import heroImg from "@/assets/hero-glasses.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary text-sm font-semibold tracking-widest uppercase mb-6"
        >
          Introducing IMI AI Smart Glasses
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 glow-text"
        >
          Meet the Future<br />of AI Wearables
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          IMI Smart Glasses bring voice, intelligence, and vision together — hands-free.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="/product/mark-1" className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Shop Mark 1
          </a>
          <a href="/product/mark-2" className="px-8 py-3.5 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
            Shop Mark 2
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 relative"
        >
          <img
            src={heroImg}
            alt="IMI AI Smart Glasses - premium AI-powered wearable glasses"
            className="w-full max-w-4xl mx-auto rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
