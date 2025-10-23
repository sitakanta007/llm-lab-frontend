'use client';

import { X, ArrowUp } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function CompareModal({ isOpen, onClose, selectedResults }) {
  const containerRef = useRef(null); // non-scrolling modal container
  const scrollRef = useRef(null);    // scrolling area
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Always attach hooks in same order
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (isOpen && e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 200);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [isOpen]);

  const handleScrollTop = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allMetricKeys = getAllMetricKeys(selectedResults || []);

  if (!isOpen || !selectedResults?.length) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 p-6 flex items-center justify-center">
      {/* Non-scrolling container */}
      <div
        ref={containerRef}
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl"
      >
        {/* Header (not inside scroll area) */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-2xl">
          <h2 className="text-lg font-semibold">
            Compare {selectedResults.length} Responses
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        {/* Scrollable content area */}
        <div
          ref={scrollRef}
          className="px-6 py-4 max-h-[70vh] overflow-auto"
        >
          <div className="space-y-4">
            {selectedResults.map((result) => (
              <div
                key={result.id}
                className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              >
                {/* Params */}
                <div className="space-y-1 text-xs">
                  <div><strong>Temp:</strong> {formatMetric(result.params?.temperature)}</div>
                  <div><strong>Top P:</strong> {formatMetric(result.params?.top_p)}</div>
                  <div><strong>Coherence:</strong> {formatMetric(result.params?.coherence)}</div>
                </div>

                {/* Metrics */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  {allMetricKeys.map((metricKey) => (
                    <div key={`${result.id}-${metricKey}`}>
                      <strong>{metricKey}:</strong> {formatMetric(result.metrics?.[metricKey])}
                    </div>
                  ))}
                </div>

                {/* Generated text (optional nice to have) */}
                {result.text && (
                  <p className="mt-3 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {result.text}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Sticky-at-bottom helper (gradient & padding) */}
          <div className="sticky bottom-0 h-6 bg-gradient-to-t from-white/90 dark:from-slate-800/90 to-transparent mt-4" />
        </div>

        {/* Scroll-to-top button anchored to the container (does NOT scroll) */}
        <button
          onClick={handleScrollTop}
          className={`absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ${
            showScrollTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}

/* Helpers */
function getAllMetricKeys(results) {
  const keys = new Set();
  results.forEach((res) => {
    if (res?.metrics) {
      Object.keys(res.metrics).forEach((k) => keys.add(k));
    }
  });
  return Array.from(keys);
}

function formatMetric(value) {
  return typeof value === 'number' ? value.toFixed(3) : 'N/A';
}
