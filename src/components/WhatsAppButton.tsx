import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/917378528453"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
      <span className="relative flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3 shadow-2xl hover:shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition-all hover:scale-105">
        <motion.span
          animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5 }}
          className="flex"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </motion.span>
        <span className="hidden sm:inline text-base font-bold">Chat on WhatsApp</span>
      </span>
    </motion.a>
  );
}
