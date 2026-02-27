import { motion } from "framer-motion";
import imgLens from "@/assets/Sleek IMI smart sunglasses close-up.png";
import imgControls from "@/assets/Matte black smart glasses with IMI logo.png";
import imgAudio from "@/assets/Sleek IMI smart sunglasses in focus.png";
import imgVariety from "@/assets/IMI smart sunglasses in focus.png";

const techCards = [
  { label: "Lens technologies", image: imgLens },
  { label: "Dynamic controls", image: imgControls },
  { label: "Open-ear audio", image: imgAudio },
  { label: "Variety and style", image: imgVariety },
];

const ExploreTechSection = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Explore the tech
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            All AI glasses feature innovations that you can see, feel and hear.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {techCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer"
            >
              <img
                src={card.image}
                alt={card.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Subtle gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10" />

              {/* Label top-left */}
              <div className="absolute top-5 left-5 right-5">
                <span className="text-white text-lg md:text-xl font-semibold drop-shadow-lg leading-snug">
                  {card.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreTechSection;
