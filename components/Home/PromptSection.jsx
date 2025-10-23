'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Info } from 'lucide-react';
import axios from 'axios';
import { setResults, setPrompt, setLastRunAt } from '../../store/experimentSlice';
import InlineError from '../Utils/InlineError';
import ParamInput from '../Utils/ParamInput';
import ToolTip from '../Utils/ToolTip';

/* Helper to build ranges */
function buildRange(min, max, step) {
  const out = [];
  const m = Number(min), M = Number(max), s = Number(step);
  if ([m, M, s].some(x => Number.isNaN(x)) || s <= 0 || M < m) return out;
  let x = Number(m.toFixed(4));
  const end = Number(M.toFixed(4));
  while (x <= end + 1e-9) {
    out.push(Number(x.toFixed(4)));
    x += s;
  }
  return out;
}

export default function PromptSection() {
  const dispatch = useDispatch();
  const [prompt, setLocalPrompt] = useState('Explain quantum computing to a 10-year-old with examples.');

  // local states for ranges
  const [tMin, setTMin] = useState(0.5), [tMax, setTMax] = useState(0.5), [tStep, setTStep] = useState(0.1);
  const [pMin, setPMin] = useState(0.5), [pMax, setPMax] = useState(0.5), [pStep, setPStep] = useState(0.1);
  const [cMin, setCMin] = useState(0.5), [cMax, setCMax] = useState(0.5), [cStep, setCStep] = useState(0.1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const api = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function onRun() {
    // Flush any uncommitted ParamInput value
    if (typeof document !== 'undefined') {
      document.activeElement?.blur();
    }

    setErrorMessage('');
    if (!prompt || prompt.trim().length < 10) {
      const msg = 'Prompt must be at least 10 characters';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    const temps = buildRange(tMin, tMax, tStep);
    const tops = buildRange(pMin, pMax, pStep);
    const cohs = buildRange(cMin, cMax, cStep);
    const combos = [];
    for (const t of temps) for (const p of tops) for (const c of cohs)
      combos.push({ temperature: t, top_p: p, coherence: c });

    console.log({ tMin, tMax, tStep, pMin, pMax, pStep, cMin, cMax, cStep, combosLength: combos.length });
    
    if (combos.length === 0) {
      const msg = 'Invalid ranges or step.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }
    if (combos.length > 400) {
      const msg = `Too many combinations (${combos.length}). Reduce ranges or increase step.`;
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);
      dispatch(setPrompt(prompt));
      const res = await axios.post(`${api}/generate`, { prompt, combinations: combos }, { timeout: 60000 });
      if (!res.data || !Array.isArray(res.data.results)) throw new Error('Bad response');
      dispatch(setResults(res.data.results));
      dispatch(setLastRunAt(Date.now()));
      const sorted = [...res.data.results].sort((a, b) => (b.metrics?.coherence ?? 0) - (a.metrics?.coherence ?? 0));
      const best = sorted[0];
      toast.success(
        `Done: ${res.data.results.length} combos. Best coherence ${(best?.metrics?.coherence ?? 0).toFixed(2)} @ t=${best?.params?.temperature}, p=${best?.params?.top_p}`
      );
    } catch (err) {
      if (err.response) {
        if (err.response.status === 429) toast.error('Rate limit reached. Try later.');
        else toast.error(err.response.data?.error || 'Server error.');
      } else {
        const msg = 'Network error: cannot reach backend.';
        setErrorMessage(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  /* Left-aligned labels and tooltips along with inputs */
  function Field({ label, min, max, step, setMin, setMax, setStep, tooltip }) {
    return (
      <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 flex flex-col gap-2 shadow-sm w-full">
        
        {/* Label + Info icon row */}
        <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
          <span>{label}</span>
          
          {/* icon and tooltip wrapper */}
          <div className="relative group">
            <Info
              size={14}
              className="text-slate-400 cursor-pointer hover:text-blue-500"
            />
            <ToolTip text={tooltip} />
          </div>
        </div>

        {/* Min / Max / Step fields */}
        <div className="flex items-start gap-3 text-[11px] text-slate-500 w-full">
          <div className="flex-1 flex flex-col">
            <span className="mb-0.5">Min</span>
            <ParamInput value={min} onCommit={setMin} fullWidth />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="mb-0.5">Max</span>
            <ParamInput value={max} onCommit={setMax} fullWidth />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="mb-0.5">Step</span>
            <ParamInput value={step} onCommit={setStep} min={0.01} max={1} step={0.01} fullWidth />
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow space-y-5 relative">
      <InlineError message={errorMessage} />

      {/* Parameter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field
          label="Temperature"
          min={tMin} max={tMax} step={tStep}
          setMin={setTMin} setMax={setTMax} setStep={setTStep}
          tooltip="Controls randomness. Lower = more focused, higher = more creative."
        />
        <Field
          label="Top_p"
          min={pMin} max={pMax} step={pStep}
          setMin={setPMin} setMax={setPMax} setStep={setPStep}
          tooltip="Nucleus sampling. Limits probability mass considered for next token."
        />
        <Field
          label="Coherence"
          min={cMin} max={cMax} step={cStep}
          setMin={setCMin} setMax={setCMax} setStep={setCStep}
          tooltip="Custom parameter to influence structural flow in the response."
        />
      </div>

      {/* Prompt Section */}
      <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 flex flex-col gap-2 shadow-sm">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Prompt
        </label>
        <textarea
          rows={3}
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          className="w-full border border-white dark:border-slate-800 rounded-md px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => {
              setLocalPrompt('');
              setTMin(0.4); setTMax(0.6); setTStep(0.05);
              setPMin(0.1); setPMax(0.3); setPStep(0.05);
              setCMin(0.5); setCMax(0.8); setCStep(0.1);
            }}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            Clear
          </button>
          <button
            onClick={onRun}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
          >
            {loading && <img src="/loader.svg" alt="loading" className="w-5 h-5 animate-spin" />}
            {loading ? 'Running...' : 'Run Experiment'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col items-center gap-3">
            <img src="/loader.svg" alt="loading" className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium">Processing experiment…</span>
          </div>
        </div>
      )}
    </div>
  );
}
