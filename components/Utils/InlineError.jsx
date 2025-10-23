'use client';
import { AlertTriangle } from 'lucide-react';

export default function InlineError({ message }) {
  if (!message) return null;

  return (
    <div className="max-w-3xl mx-auto my-6 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3">
      <AlertTriangle className="flex-shrink-0 mt-[2px]" size={20} />
      <span className="text-sm">{message}</span>
    </div>
  );
}
