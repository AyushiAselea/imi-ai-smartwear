import { motion } from "framer-motion";

const HERO_VIDEO_URL =
  "https://res.cloudinary.com/dvvifezwm/video/upload/v1772192316/WhatsApp_Video_2026-02-27_at_4.51.19_PM_e2zf3b.mp4";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay — always dark so text stays white in both modes */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

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
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 text-white drop-shadow-lg"
        >
          Meet the Future<br />of AI Wearables
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10"
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
          <a href="/product/mark-2" className="px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm">
            Shop Mark 2
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
