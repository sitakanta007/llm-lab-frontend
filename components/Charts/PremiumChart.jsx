'use client';
import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, AreaChart, Area, ScatterChart, Scatter
} from 'recharts';
import { useMounted } from '../../hooks/useMounted';
import ChartSkeleton from './ChartSkeleton';

export default function PremiumChart({ data }){
  const [chartType, setChartType] = useState('line');
  const [metric, setMetric] = useState('coherence');
  const [compareTop, setCompareTop] = useState(false);
  const [topN, setTopN] = useState(10);
  const mounted = useMounted();

  const key = (d) => d?.metrics?.[metric] ?? 0;

  const prepared = useMemo(()=>{
    const arr = Array.isArray(data)? data : [];
    return arr.map(r => ({
      ...r,
      temperature: r?.params?.temperature,
      metric: key(r),
    })).sort((a,b)=> key(b)-key(a));
  }, [data, metric]);

  const view = compareTop ? prepared.slice(0, topN) : prepared;

  if(!mounted) return <ChartSkeleton/>;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <label className="text-sm">Chart</label>
          <select value={chartType} onChange={e=>setChartType(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="line">Line</option>
            <option value="scatter">Scatter</option>
            <option value="radar">Radar (Top N)</option>
            <option value="bar">Bar (Top N)</option>
            <option value="area">Area</option>
          </select>
          <label className="text-sm ml-3">Metric</label>
          <select value={metric} onChange={e=>setMetric(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="coherence">Coherence</option>
            <option value="lexical">Lexical</option>
            <option value="lengthFit">Length Fit</option>
            <option value="redundancy">Redundancy (lower is better)</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <input type="checkbox" checked={compareTop} onChange={e=>setCompareTop(e.target.checked)} />
          <span className="text-sm">Compare Top N</span>
          {compareTop && (
            <input type="number" min={1} max={100} value={topN} onChange={e=>setTopN(parseInt(e.target.value||'10'))}
              className="w-20 border rounded px-2 py-1 text-sm"/>
          )}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType==='line' && (
            <LineChart data={view}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="params.temperature" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={`metrics.${metric}`} stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          )}
          {chartType==='scatter' && (
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" dataKey="params.temperature" name="Temperature" />
              <YAxis type="number" dataKey={`metrics.${metric}`} name="Metric" domain={[0,1]} />
              <Tooltip />
              <Legend />
              <Scatter data={view} />
            </ScatterChart>
          )}
          {chartType==='radar' && (
            <RadarChart data={view.slice(0, Math.max(3, topN))}>
              <PolarGrid />
              <PolarAngleAxis dataKey="params.temperature" />
              <Radar name="Metric" dataKey={`metrics.${metric}`} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              <Tooltip />
            </RadarChart>
          )}
          {chartType==='bar' && (
            <BarChart data={view.slice(0, Math.max(3, topN))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="params.temperature" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Bar dataKey={`metrics.${metric}`} fill="#3b82f6" />
            </BarChart>
          )}
          {chartType==='area' && (
            <AreaChart data={view}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="params.temperature" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={`metrics.${metric}`} stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.6} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
