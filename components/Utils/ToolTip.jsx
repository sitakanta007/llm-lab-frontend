'use client';
import { motion } from 'framer-motion';

export default function ToolTip({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      whileHover={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute right-full mr-2 top-1/2 -translate-y-1/2
                 whitespace-nowrap px-2 py-1 rounded bg-slate-800 text-white text-xs
                 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-10"
    >
      {text}
    </motion.div>
  );
}
