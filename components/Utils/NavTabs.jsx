'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function NavTabs() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(null);

  const tabs = [
    { name: 'Home', path: '/' },
    { name: 'Experiments', path: '/experiments' },
  ];

  return (
    <nav className="flex gap-8 relative">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        const isHovered = hovered === tab.path;

        return (
          <div
            key={tab.path}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHovered(tab.path)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link
              href={tab.path}
              className={`font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              {tab.name}
            </Link>

            {/* Active underline */}
            {isActive && (
              <motion.div
                layoutId="underline"
                className="h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full mt-1"
                initial={{ width: 0, opacity: 0, scaleX: 0 }}
                animate={{ width: '100%', opacity: 1, scaleX: 1 }}
                exit={{ width: 0, opacity: 0, scaleX: 0 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: 'center' }}
              />
            )}

            {/* Hover underline (only if not active) */}
            {!isActive && (
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full mt-1 opacity-50"
                    initial={{ width: 0, opacity: 0, scaleX: 0 }}
                    animate={{ width: '100%', opacity: 0.5, scaleX: 1 }}
                    exit={{ width: 0, opacity: 0, scaleX: 0 }}
                    transition={{
                      duration: 0.25,
                      ease: 'easeInOut',
                    }}
                    style={{ transformOrigin: 'center' }}
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </nav>
  );
}
