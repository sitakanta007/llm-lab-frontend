'use client';
import { motion } from 'framer-motion';

export default function ChartSkeleton(){
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}
      className="h-80 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full px-8 flex flex-col items-center justify-center h-full">
        <img src="/loader.svg" alt="loading" className="w-8 h-8 animate-spin" />
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    </motion.div>
  );
}
