import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <section id="cta" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 glow-text">
          Upgrade to AI Lifestyle
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join thousands stepping into the future of smart wearables. Made in India, made for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#products" className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Shop Mark 1
          </a>
          <a href="#products" className="px-8 py-3.5 rounded-full border border-primary/50 text-foreground font-semibold text-sm hover:bg-primary/10 transition-colors">
            Shop Mark 2
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
