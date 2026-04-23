import { motion } from "framer-motion";
import mobiKwikBanner from "@/assets/MobiKwik.png";

const MobiKwikSection = () => {
  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            IMI x MobiKwik
          </h2>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Unlock exclusive UPI and wallet cashback offers on IMI purchases.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="overflow-hidden rounded-2xl border border-border shadow-sm"
        >
          <img
            src={mobiKwikBanner}
            alt="MobiKwik cashback offer for IMI"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MobiKwikSection;