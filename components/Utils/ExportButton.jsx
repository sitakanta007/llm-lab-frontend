'use client';
import { useSelector } from 'react-redux';
import { Download, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ExportButton() {
  const results = useSelector(s => s.experiment.results);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasResults = results && results.length > 0;

  const exportJSON = () => {
    if (!hasResults) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-results-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const exportCSV = () => {
    if (!hasResults) return;
    const headers = ['temperature', 'top_p', 'input_coherence', 'coherence', 'lexical', 'lengthFit', 'redundancy', 'text'];
    const rows = results.map(r => [
      r.params?.temperature ?? '',
      r.params?.top_p ?? '',
      r.params?.coherence ?? '',
      r.metrics?.coherence ?? '',
      r.metrics?.lexical ?? '',
      r.metrics?.lengthFit ?? '',
      r.metrics?.redundancy ?? '',
      JSON.stringify(r.text || '').replace(/\n/g, '\\n').replace(/"/g, '""')
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-results-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const copyToClipboard = async () => {
    if (!hasResults) return;
    const text = JSON.stringify(results, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      toast.error('Failed to copy');
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => hasResults && setOpen(!open)}
        disabled={!hasResults}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        <Download size={16} />
        Export
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 w-44">
          <button
            onClick={exportJSON}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Export as JSON
          </button>
          <button
            onClick={exportCSV}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Export as CSV
          </button>
          <button
            onClick={copyToClipboard}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
          >
            Copy to Clipboard
            {copied && <Check size={16} className="text-green-500" />}
          </button>
        </div>
      )}
    </div>
  );
}
