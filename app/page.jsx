'use client';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useMounted } from '../hooks/useMounted';
import PromptSection from '../components/Home/PromptSection';
import ChartSkeleton from '../components/Charts/ChartSkeleton';
import DashboardCard from '../components/Home/DashboardCard';
import ResponseGrid from '../components/Response/ResponseGrid';
import InlineError from '../components/Utils/InlineError';
import ExportButton from '../components/Utils/ExportButton';

const PremiumChart = dynamic(() => import('../components/Charts/PremiumChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />
});

export default function Page(){
  const mounted = useMounted();
  const results = useSelector(s=>s.experiment.results)||[];
  const summary = useMemo(()=>{
    if(!results.length) return null;
    const sorted=[...results].sort((a,b)=> (b.metrics?.coherence??0)-(a.metrics?.coherence??0));
    const best=sorted[0];
    return {
      bestCoherence: (best.metrics?.coherence??0).toFixed(2),
      bestTemp: (best.params?.temperature??0).toFixed(2),
      bestTopP: (best.params?.top_p??0).toFixed(2),
      bestInputC: (best.params?.coherence??0).toFixed(2),
      total: results.length
    };
  }, [results]);

  if(!mounted){
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <ChartSkeleton/>
        <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PromptSection/>

      {results.length > 0 && (
      <DashboardCard title="Experiment Visualization" actions={<ExportButton />}>
        <PremiumChart data={results}/>
      </DashboardCard>
      )}
      
      {summary ? (
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border dark:border-slate-700">
          <div className="font-semibold text-sm">Quick Insights</div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span>Best Coherence: <b>{summary.bestCoherence}</b></span>
            <span>Temp: <b>{summary.bestTemp}</b></span>
            <span>Top_p: <b>{summary.bestTopP}</b></span>
            <span>InputC: <b>{summary.bestInputC}</b></span>
            <span>Combos: <b>{summary.total}</b></span>
          </div>
        </div>
      ) : <InlineError message="" />}
      
      <DashboardCard title="Responses">
        <ResponseGrid/>
      </DashboardCard>
    </div>
  );
}
