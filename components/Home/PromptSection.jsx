'use client';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setResults, setPrompt, setLastRunAt } from '@store/experimentSlice';
import InlineError from '@utils/InlineError';
import SliderField from '@utils/SliderField';
import { buildRangeMap, getComboCount, buildCombos } from '@components/Utils/ParamCombos';
import { PARAMS_CONFIG, SITE_CONFIG } from '@config/paramsConfig';
import { ExperimentApi } from '@api/experimentApi';

function makeDefaultParams() {
  const obj = {};
  for (const key of Object.keys(PARAMS_CONFIG)) {
    obj[key] = {
      range: [...PARAMS_CONFIG[key].defaultRange],
      step: PARAMS_CONFIG[key].defaultStep,
    };
  }
  return obj;
}

export default function PromptSection() {
  const dispatch = useDispatch();
  const [prompt, setLocalPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockMode, setMockMode] = useState(true); 
  const [params, setParams] = useState(() => makeDefaultParams());
  const api = process.env.NEXT_PUBLIC_API_BASE_URL;

  const updateParam = (key, field, value) => {
    setParams(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: Array.isArray(value) ? [...value] : value,
      },
    }));
  };

  const { rangeMap, comboCount } = useMemo(() => {
    const map = buildRangeMap(params);
    const count = getComboCount(map);
    return { rangeMap: map, comboCount: count };
  }, [params]);

  const promptTokenEstimate = Math.ceil(prompt.length / 4);
  const totalTokenEstimate = promptTokenEstimate * comboCount;

  const runExperiment = useCallback(async () => {
    setErrorMessage('');
    if (!prompt || prompt.trim().length < 10) {
      setErrorMessage('Prompt must be at least 10 characters');
      return;
    }

    if (comboCount === 0) {
      setErrorMessage('Invalid ranges or step.');
      return;
    }
    if (comboCount > SITE_CONFIG.comboLimit) {
      setErrorMessage(`Max ${SITE_CONFIG.comboLimit} combinations allowed. Reduce ranges or increase step.`);
      return;
    }
    const combos = buildCombos(rangeMap);

    try {
      setLoading(true);
      dispatch(setPrompt(prompt));
  
      const res = await ExperimentApi.runExperiment(prompt, combos, mockMode);
      if (!Array.isArray(res.data?.results)) throw new Error('Bad response');

      dispatch(setResults(res.data.results));
      dispatch(setLastRunAt(Date.now()));

      const best = [...res.data.results].sort(
        (a, b) => (b.metrics?.coherence ?? 0) - (a.metrics?.coherence ?? 0)
      )[0];

      toast.success(`Done: ${combos.length} combos. Best coherence ${(best?.metrics?.coherence ?? 0).toFixed(2)}.`);
    } catch (err) {
      if (err?.response?.status === 429) setErrorMessage('Rate limit reached. Try later.');
      else if (err?.response?.data?.error) setErrorMessage(err.response.data.error);
      else setErrorMessage('Network/Server error.');
    } finally {
      setLoading(false);
    }
  }, [prompt, comboCount, rangeMap, dispatch, api, mockMode]);

  const resetParams = () => setParams(makeDefaultParams());

  return (
    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow space-y-5 relative">
      {/* Parameter sliders */}
      <div
        className={`grid gap-3`}
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
      >
        {Object.entries(PARAMS_CONFIG).map(([key, config]) => (
          <SliderField
            key={key}
            label={config.label}
            tooltip={config.tooltip}
            value={params[key].range}
            stepValue={params[key].step}
            min={config.sliderMin}
            max={config.sliderMax}
            step={config.sliderStep}
            onRangeChange={(val) => updateParam(key, 'range', val)}
            onStepChange={(val) => updateParam(key, 'step', val)}
            onCommitRange={(val) => updateParam(key, 'range', val)}
            onCommitStep={(val) => updateParam(key, 'step', val)}
          />
        ))}
      </div>

      {/* Prompt Section */}
      <div className="p-5 rounded-lg border bg-slate-50 dark:bg-slate-900 flex flex-col gap-3 shadow-sm">
        {/* Top row: prompt label + token counter */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Prompt
          </label>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 whitespace-nowrap">
            {prompt.length} chars / ~{promptTokenEstimate} tokens
          </div>
        </div>

        <textarea
          rows={4}
          placeholder="Enter your prompt... (Minimum 10 characters)"
          value={prompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        {/* Bottom row: chips, error (center), buttons (right) */}
        <div className="flex flex-wrap justify-between items-center gap-3 mt-2">
          {/* Left: Chips + Mock checkbox */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <div className="bg-blue-50 dark:bg-blue-600/20 border border-blue-500 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium shadow-sm whitespace-nowrap">
                {comboCount} combos
              </div>
              <div className="bg-slate-100 dark:bg-slate-600/20 border border-slate-500 text-slate-800 dark:text-slate-300 px-3 py-1 rounded-full text-sm shadow-sm whitespace-nowrap">
                {Object.keys(params).length} params
              </div>
              <div className="bg-green-50 dark:bg-green-600/20 border border-green-600 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm shadow-sm whitespace-nowrap">
                ~{totalTokenEstimate} tokens
              </div>
            </div>

            {/* Mock Data checkbox */}
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
              <input
                type="checkbox"
                checked={mockMode}
                onChange={(e) => setMockMode(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
              Mock Data
            </label>
          </div>

          {/* Middle: Error */}
          <div className="flex-1 flex justify-center">
            <InlineError message={errorMessage} onDismiss={() => setErrorMessage('')} />
          </div>

          {/* Right: Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { setLocalPrompt(''); resetParams(); }}
              className="px-4 py-2 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              Clear
            </button>
            <button
              onClick={runExperiment}
              disabled={loading}
              className="px-4 py-2 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
            >
              {loading && <img src="/loader.svg" alt="loading" className="w-5 h-5 animate-spin" />}
              {loading ? 'Running...' : SITE_CONFIG.promptSubmitLabel }
            </button>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col items-center gap-3">
            <img src="/loader.svg" alt="loading" className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium">Processing experiment…</span>
            { /* show below msg only for real API calls where combo count > 13 */}
            {!mockMode && comboCount > 13 && (
              <span className="text-sm font-medium">Real API limit is - max 13 result items (or combinations) per request.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
