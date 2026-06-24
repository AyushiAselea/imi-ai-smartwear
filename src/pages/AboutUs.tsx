import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mark1Back from "@/assets/mark_1/mark1_back_black2.png";
import mark2Black from "@/assets/mark2/mark2_black_black1.png";
import mark2White from "@/assets/mark2/mark2_white_black.png";
import deviceShowcase1 from "@/assets/ChatGPT Image Feb 27, 2026, 05_31_56 PM.png";
import deviceShowcase2 from "@/assets/Sleek IMI smart sunglasses in focus.png";
import founderImg from "@/assets/Screenshot 2026-06-24 153046.png";
import companyLogo from "@/assets/logo_Pink_g2ot7w.png";

const heroSlides = [
  {
    img: mark1Back,
    title: "Engineered for everyday",
    desc: "IMI Mark 1 — lightweight, all-day comfort, built to feel like nothing at all.",
  },
  {
    img: mark2Black,
    title: "AI that sees what you see",
    desc: "IMI Mark 2 — onboard vision AI, voice control, and a camera that's always ready.",
  },
  {
    img: mark2White,
    title: "Designed in India, for India",
    desc: "Every detail tuned for Indian voices, languages, and everyday life.",
  },
];

const commitments = [
  {
    icon: ShieldCheck,
    title: "Safety & expression",
    desc: "Protecting your voice and helping you connect and share safely.",
    img: deviceShowcase1,
  },
  {
    icon: Lock,
    title: "Data and privacy",
    desc: "Giving you control over your privacy and protecting your information.",
    img: deviceShowcase2,
  },
  {
    icon: Sparkles,
    title: "Responsible innovation",
    desc: "Building for the future of wearable AI with privacy and safety in mind.",
    img: mark2Black,
  },
];

const ScrollHero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const idx = Math.min(heroSlides.length - 1, Math.floor(v * heroSlides.length));
      setActiveIndex(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${heroSlides.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={heroSlides[activeIndex].img}
              alt={heroSlides[activeIndex].title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
                {heroSlides[activeIndex].title}
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                {heroSlides[activeIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 mt-10">
            {heroSlides.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-10 bg-white" : "w-5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        <ScrollHero />

        {/* About IMI */}
        <section className="max-w-3xl mx-auto px-6 text-center pt-28 pb-24">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">About IMI Wearables</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            India's leading AI smart glasses brand — combining cutting-edge artificial intelligence with stylish eyewear to make everyday life smarter, hands-free, and future-ready. From our first prototype to Mark 1 and Mark 2, we've stayed focused on one goal: making AI wearable technology accessible and genuinely useful for India.
          </p>
        </section>

        {/* Explore our devices */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">
            Explore our devices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[deviceShowcase1, deviceShowcase2].map((img, i) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden glass aspect-[4/5]"
              >
                <img src={img} alt="IMI smart glasses" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Commitments */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Stay informed about our commitments</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're committed to helping keep our users safe and making a positive impact through responsible AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {commitments.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3]">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <c.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{c.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/privacy-policy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Learn more
            </a>
          </div>
        </section>

        {/* Leadership / Founder */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="grid sm:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden glass aspect-[4/5] order-2 sm:order-1">
              <img src={founderImg} alt="IMI Wearables founder" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 sm:order-2">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Meet our founder</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                IMI Wearables is led by a team obsessed with making AI wearable technology accessible, stylish, and genuinely useful — guiding our products as smart eyewear and AI evolve together.
              </p>
              <a
                href="/#hey-imi-enquiry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/50 text-foreground font-semibold text-sm hover:bg-primary/10 transition-colors"
              >
                Get in touch <ArrowRight size={16} />
              </a>
              <div className="flex items-center gap-2 mt-8 opacity-60">
                <img src={companyLogo} alt="" className="h-12 w-auto" />
                <span className="text-xs text-muted-foreground">Registered Business Name: Aselea Network</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-3xl mx-auto px-6 pb-28">
          <div className="glass rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Get in touch</h2>
            <p className="text-muted-foreground mb-6">Have questions about us or our products? We'd love to hear from you.</p>
            <div className="space-y-1.5 text-sm">
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href="mailto:tanay@imiglasses.com" className="text-primary hover:underline">tanay@imiglasses.com</a>
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                <a href="tel:+919024194918" className="text-primary hover:underline">+91 9024194918</a>
              </p>
              <p className="text-muted-foreground">
                Aselea Network, Third Floor, Shop No 230/CS/15-16, RHB, Pratap Nagar, Sanganer, Jaipur, Rajasthan - 302033, India
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
