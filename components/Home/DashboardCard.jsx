'use client';
import { motion } from 'framer-motion';

export default function DashboardCard({ title, actions, children }){
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.35}}
      className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow space-y-3">
      <div className="flex items-center justify-between">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {actions}
      </div>
      {children}
    </motion.div>
  )
}
