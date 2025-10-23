'use client';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { useState } from 'react';
import CompareModal from './CompareModal';
import { clearSelection, setSelection } from '../../store/experimentSlice';

export default function CompareFloatingBar() {
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const selected = useSelector((s) => s.experiment.selectedIds);
  const results = useSelector((s) => s.experiment.results);
  const dispatch = useDispatch();

  if (selected.length === 0) return null;

  const allSelected = selected.length === results.length;
  const allIds = results.map((r) => r.id);
  const canCompare = selected.length >= 2;

  const handleSelectAll = () => {
    if (allSelected) dispatch(setSelection([]));
    else dispatch(setSelection(allIds));
  };

  // Map selected IDs to full result objects
  const selectedObjects = results.filter((r) => selected.includes(r.id));

  return (
    <>
      <div className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-3 shadow-lg">
        <span>{selected.length} selected</span>

        <button
          onClick={handleSelectAll}
          className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded"
        >
          {allSelected ? 'Clear All' : 'Select All'}
        </button>

        <button
          disabled={!canCompare}
          onClick={() => canCompare && setIsCompareOpen(true)}
          className={`px-3 py-1 rounded transition ${
            canCompare
              ? 'bg-white text-blue-600 hover:bg-slate-100'
              : 'bg-slate-400 text-white cursor-not-allowed opacity-75'
          }`}
        >
          Compare
        </button>

        <button
          onClick={() => dispatch(clearSelection())}
          className="hover:text-slate-200"
        >
          <X size={16} />
        </button>
      </div>

      {isCompareOpen && (
        <CompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          selectedResults={selectedObjects}  // pass full objects with metrics
        />
      )}
    </>
  );
}
