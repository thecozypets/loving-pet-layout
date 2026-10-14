import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

const paws = [
  { top: "10%", left: "6%", size: 28, delay: 0, color: "text-primary/30" },
  { top: "30%", left: "88%", size: 36, delay: 0.5, color: "text-accent/40" },
  { top: "65%", left: "4%", size: 24, delay: 1, color: "text-leaf/40" },
  { top: "80%", left: "82%", size: 32, delay: 1.5, color: "text-berry/30" },
  { top: "50%", left: "50%", size: 20, delay: 2, color: "text-sky/30" },
];

export function FloatingPaws() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {paws.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute ${p.color}`}
          style={{ top: p.top, left: p.left }}
          animate={{ y: [0, -20, 0], rotate: [-10, 15, -10] }}
          transition={{ duration: 5, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        >
          <PawPrint style={{ width: p.size, height: p.size }} />
        </motion.div>
      ))}
    </div>
  );
}
