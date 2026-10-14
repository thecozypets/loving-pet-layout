import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function InstagramButton() {
  return (
    <motion.a
      href="https://www.instagram.com/thecozypets/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow on Instagram"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-24 right-6 z-50 flex items-center gap-2 group"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 animate-ping opacity-30" />
      <span className="relative flex items-center gap-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white px-5 py-3 shadow-2xl hover:shadow-[0_10px_30px_-5px_rgba(236,72,153,0.6)] transition-all hover:scale-105">
        <motion.span
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
          className="flex"
        >
          <Camera className="w-6 h-6" />
        </motion.span>
        <span className="hidden sm:inline text-base font-bold">Follow on Instagram</span>
      </span>
    </motion.a>
  );
}
