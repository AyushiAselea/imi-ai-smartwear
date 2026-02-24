import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  { feature: "Voice Activation", mark1: true, mark2: true },
  { feature: "AI Chat", mark1: true, mark2: true },
  { feature: "Smart Calling", mark1: true, mark2: true },
  { feature: "Music Control", mark1: true, mark2: true },
  { feature: "Vision AI", mark1: false, mark2: true },
  { feature: "Camera Capture", mark1: false, mark2: true },
  { feature: "Smart Connectivity", mark1: "Basic", mark2: "Advanced" },
  { feature: "AI Memory", mark1: true, mark2: "Enhanced" },
];

const Cell = ({ value }: { value: boolean | string }) => {
  if (value === true) return <Check size={18} className="text-primary mx-auto" />;
  if (value === false) return <X size={18} className="text-muted-foreground/40 mx-auto" />;
  return <span className="text-sm text-foreground/80">{value}</span>;
};

const ComparisonSection = () => {
  return (
    <section id="compare" className="section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Compare Models</h2>
          <p className="text-muted-foreground text-lg">Find the right IMI for you.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl overflow-hidden"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-4 px-6 text-muted-foreground font-medium">Feature</th>
                <th className="py-4 px-4 text-center font-semibold text-foreground">Mark 1</th>
                <th className="py-4 px-4 text-center font-semibold text-primary">Mark 2</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.feature} className={`border-b border-border/30 ${i === rows.length - 1 ? "border-b-0" : ""}`}>
                  <td className="py-4 px-6 text-foreground/80">{r.feature}</td>
                  <td className="py-4 px-4 text-center"><Cell value={r.mark1} /></td>
                  <td className="py-4 px-4 text-center bg-primary/5"><Cell value={r.mark2} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
