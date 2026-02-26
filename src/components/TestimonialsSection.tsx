import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "This feels like having Jarvis in real life. The voice activation is buttery smooth.",
    name: "Arjun S.",
    role: "Tech Founder",
    rating: 5,
  },
  {
    quote: "Best smart glasses under Rs 5,000. Incredible value for what you get. Can't stop using it.",
    name: "Priya M.",
    role: "Content Creator",
    rating: 5,
  },
  {
    quote: "Mark 2 is insane value for money. Vision AI blew my mind it told me exactly what was in front of me!",
    name: "Rahul K.",
    role: "Engineering Student",
    rating: 5,
  },
  {
    quote: "I use the voice notes feature daily. It's like having a second brain on my face.",
    name: "Sneha R.",
    role: "Product Manager",
    rating: 5,
  },
  {
    quote: "Called my mom hands-free while cooking. She was amazed at the audio quality!",
    name: "Vikram T.",
    role: "Home Chef & Vlogger",
    rating: 5,
  },
  {
    quote: "Wore it to a meeting and took notes with voice commands. My team thought it was magic.",
    name: "Ananya D.",
    role: "Startup CEO",
    rating: 5,
  },
];

const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3);

const colors = [
  "bg-blue-600", "bg-rose-500", "bg-emerald-600", "bg-violet-600", "bg-amber-600", "bg-cyan-600"
];

const TestimonialCard = ({ t, index }: { t: typeof testimonials[0]; index: number }) => (
  <div className="flex-shrink-0 w-[320px] sm:w-[360px] rounded-2xl bg-white border border-gray-200 p-6 mx-3 hover:shadow-lg transition-shadow duration-300 shadow-sm">
    <div className="flex gap-1 mb-3">
      {[...Array(t.rating)].map((_, j) => (
        <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
    <p className="text-gray-700 text-sm leading-relaxed mb-5">
      &quot;{t.quote}&quot;
    </p>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white font-bold text-sm`}>
        {t.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{t.name}</p>
        <p className="text-xs text-gray-500">{t.role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden bg-white dark:bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            What People Say
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Loved by early adopters across India
          </p>
        </motion.div>
      </div>

      <div className="relative mb-6">
        <div className="flex animate-marquee-left">
          {[...row1, ...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} t={t} index={i % testimonials.length} />
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex animate-marquee-right">
          {[...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} t={t} index={(i + 3) % testimonials.length} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
