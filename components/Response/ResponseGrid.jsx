'use client';
import { useSelector } from 'react-redux';
import ResponseCard from './ResponseCard';

export default function ResponseGrid(){
  const results = useSelector(s => s.experiment.results) || [];
  if(!results.length) return <div className="text-sm text-slate-500">Run an experiment to see results.</div>;
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {results.map((r,i)=> <ResponseCard key={i} r={r} />)}
    </div>
  );
}
