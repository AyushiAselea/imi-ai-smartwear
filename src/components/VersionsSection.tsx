import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import logoWhite from "@/assets/new Final IMI LOGO.png";
import logoBlack from "@/assets/WhatsApp Image 2025-09-08 at 6.23.45 PM.png";
import img1 from "@/assets/ChatGPT Image Feb 27, 2026, 02_08_45 PM.png";
import img2 from "@/assets/ChatGPT Image Feb 27, 2026, 02_17_28 PM.png";
import img3 from "@/assets/ChatGPT Image Feb 27, 2026, 02_45_34 PM.png";
import img4 from "@/assets/Smart glasses and friendly conversation.png";

const cards = [
  {
    label: "Get recommendations",
    image: img1,
    quote: '"Hey IMI, what should I wear today?"',
  },
  {
    label: "Translate text",
    image: img2,
    quote: '"Translate this sign to English."',
  },
  {
    label: "Ask anything",
    image: img3,
    quote: '"What are some good exercises to improve my cycling speed?"',
  },
  {
    label: "Stay connected",
    image: img4,
    quote: '"Remember my meeting at 5 PM."',
  },
];

const VersionsSection = () => {
  const { theme } = useTheme();
  const logo = theme === "dark" ? logoWhite : logoBlack;

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* IMI Logo + Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <img
            src={logo}
            alt="IMI"
            className="h-8 w-auto mx-auto mb-6"
          />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Ask your glasses anything
            <br />
            with{" "}
            <span className="text-primary">Hey IMI</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Chat with IMI AI to get suggestions, answers, reminders and more.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              className="flex flex-col"
            >
              {/* Card image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer">
                <img
                  src={card.image}
                  alt={card.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/10" />

                {/* Label top-left */}
                <div className="absolute top-5 left-5 right-5">
                  <span className="text-white text-base md:text-lg font-semibold drop-shadow-lg leading-snug">
                    {card.label}
                  </span>
                </div>
              </div>

              {/* Quote below card */}
              <p className="mt-3 text-center text-sm text-muted-foreground italic px-1">
                {card.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VersionsSection;
