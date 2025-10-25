'use client';
import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function InlineError({ message, onDismiss, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div
      className={`
        flex items-start sm:items-center justify-between gap-2 
        bg-red-50 dark:bg-red-900/30 
        border border-red-300 dark:border-red-700 
        text-red-700 dark:text-red-300 
        rounded-lg px-3 py-2 transition-all duration-300
        max-w-full
        ${message ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
        <span className="text-xs sm:text-sm break-words whitespace-normal leading-snug">
          {message}
        </span>
      </div>
      {message && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="ml-1 text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100 transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
