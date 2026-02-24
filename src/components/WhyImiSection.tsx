import { motion } from "framer-motion";
import { Cpu, IndianRupee, Users, Sparkles, Rocket } from "lucide-react";

const points = [
  { icon: Cpu, title: "AI-Powered Wearable Technology", desc: "Cutting-edge AI built into sleek eyewear." },
  { icon: IndianRupee, title: "Affordable for India", desc: "Premium smart glasses at a fraction of the global price." },
  { icon: Users, title: "Designed for Indian Users", desc: "Voice and language support tailored for you." },
  { icon: Sparkles, title: "Stylish & Lightweight", desc: "Wear all day without compromise." },
  { icon: Rocket, title: "Future-Ready Innovation", desc: "Regular OTA updates keep you ahead." },
];

const WhyImiSection = () => {
  return (
    <section id="why" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Why Choose IMI?</h2>
          <p className="text-muted-foreground text-lg">The smartest investment you'll wear.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:glow-border transition-shadow duration-500"
            >
              <p.icon size={28} className="text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyImiSection;
