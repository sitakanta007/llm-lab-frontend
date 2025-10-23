'use client';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSelect } from '../../store/experimentSlice';

export default function ResponseCard({ r }){
  const dispatch = useDispatch();
  const selectedIds = useSelector(s => s.experiment.selectedIds);
  const isSelected = selectedIds.includes(r.id);

  return (
    <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
      className={`p-4 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-sm flex flex-col relative gap-2 border ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => dispatch(toggleSelect(r.id))}
        className="absolute top-3 right-3 w-4 h-4 accent-blue-600 cursor-pointer"
      />
      <div className="text-xs text-slate-500 mt-1">
        t:{r.params?.temperature} | p:{r.params?.top_p} | inputC:{r.params?.coherence}
      </div>
      <div className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100 overflow-y-auto" style={{ maxHeight: '200px' }}>
        {r.text}
      </div>
      <div className="mt-3 text-xs grid grid-cols-2 gap-2">
        <div>Coherence: {(r.metrics?.coherence??0).toFixed(2)}</div>
        <div>Redundancy: {(r.metrics?.redundancy??0).toFixed(2)}</div>
        <div>Lexical: {(r.metrics?.lexical??0).toFixed(2)}</div>
        <div>LengthFit: {(r.metrics?.lengthFit??0).toFixed(2)}</div>
      </div>
    </motion.div>
  );
}
