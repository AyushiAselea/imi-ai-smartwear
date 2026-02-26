import { motion } from "framer-motion";
import {
  Cpu, IndianRupee, Users, Sparkles, Rocket, Mic, Camera, Shield,
  Headphones, Globe, Zap, Battery, Wifi, BrainCircuit
} from "lucide-react";

const points = [
  { icon: Cpu, title: "AI-Powered Wearable Technology", desc: "Cutting-edge AI built into sleek eyewear — ask questions, get translations, and navigate hands-free." },
  { icon: IndianRupee, title: "Affordable for India", desc: "Premium smart glasses starting at ₹2,999 — a fraction of the global price without compromising quality." },
  { icon: Users, title: "Designed for Indian Users", desc: "Hindi, Tamil, Telugu & 25+ language support with voice AI tailored for Indian accents and context." },
  { icon: Sparkles, title: "Stylish & Lightweight", desc: "Weighing just 42.5g, designed to look like regular glasses — wear all day without compromise." },
  { icon: Rocket, title: "Future-Ready Innovation", desc: "Regular OTA updates add new AI features over time — your glasses keep getting smarter." },
  { icon: Mic, title: "Hands-Free Voice Control", desc: "Make calls, send WhatsApp messages, play music, and control your smart home — all with just your voice." },
  { icon: Camera, title: "Smart HD Camera (Mark 2)", desc: "Sony 8MP sensor for photos, video recording, and real-time AI scene recognition — capture life instantly." },
  { icon: Shield, title: "Privacy-First Design", desc: "On-device processing, LED recording indicator, and no always-on surveillance — your data stays yours." },
  { icon: Headphones, title: "Immersive Open-Ear Audio", desc: "Dual HD speakers with ENC noise cancellation — crystal-clear calls and music without blocking ambient sound." },
  { icon: Globe, title: "Real-Time AI Translation", desc: "Break language barriers instantly — translate conversations live in 25+ languages through your glasses." },
  { icon: Zap, title: "Instant AI Assistance", desc: "Get real-time answers, weather, news, navigation, and meeting notes — your personal AI always ready." },
  { icon: Battery, title: "All-Day Battery Life", desc: "Optimized power management with Type-C fast charging — up to 8 hours of use on a single charge." },
  { icon: Wifi, title: "Seamless Connectivity", desc: "Bluetooth 5.0 + Dual-Band WiFi ensure fast, stable connections to your phone and cloud services." },
  { icon: BrainCircuit, title: "Personal AI Memory", desc: "Learns your preferences and habits over time — smarter responses, saved meeting notes, and personalized reminders." },
];

const WhyImiSection = () => {
  return (
    <section id="why" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Why Choose IMI?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">India's most advanced AI smart glasses — packed with features that make every day smarter.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-6 hover:glow-border transition-shadow duration-500 flex flex-col"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <p.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-semibold text-base mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyImiSection;
