'use client';
import * as Slider from '@radix-ui/react-slider';
import { memo } from 'react';
import { PARAMS_CONFIG } from '@config/paramsConfig';

/**
 * Controlled dual-handle slider.
 * Expects `value` as [min, max] and emits both live (`onValueChange`) and on-release (`onCommit`).
 */
export const RangeSlider = memo(function RangeSlider({
  min = 0,
  max = 1,
  step = 0.01,
  value = [0.4, 0.6],
  onValueChange,    // (arr: number[]) => void
  onCommit,         // (arr: number[]) => void
}) {
  const a = Array.isArray(value) ? value : [min, max]; // safety

  return (
    <div className="w-full select-none">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{(a[0] ?? min).toFixed(2)}</span>
        <span>{(a[1] ?? max).toFixed(2)}</span>
      </div>
      <Slider.Root
        className="relative flex items-center w-full h-5 select-none touch-none"
        min={min}
        max={max}
        step={step}
        value={a}
        onValueChange={(val) => onValueChange?.(val)}
        onValueCommit={(val) => onCommit?.(val)}
      >
        <Slider.Track className="bg-slate-200 relative grow rounded-full h-[4px]">
          <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-white shadow border border-slate-300 rounded-full hover:shadow-lg focus:outline-none"
          aria-label="Min value"
        />
        <Slider.Thumb
          className="block w-4 h-4 bg-white shadow border border-slate-300 rounded-full hover:shadow-lg focus:outline-none"
          aria-label="Max value"
        />
      </Slider.Root>
    </div>
  );
});

/**
 * Controlled single-handle slider.
 * Expects `value` as a number; Radix wants an array, so we adapt both ways.
 */
export const StepSlider = memo(function StepSlider({
  min = 0.01,
  max = 1,
  step = 0.01,
  value = 0.05,
  onValueChange,    // (n: number) => void
  onCommit,         // (n: number) => void
}) {
  const v = typeof value === 'number' ? value : min;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Step</span>
        <span>{Number(v).toFixed(2)}</span>
      </div>
      <Slider.Root
        className="relative flex items-center w-full h-5 select-none touch-none"
        min={min}
        max={max}
        step={step}
        value={[v]}
        onValueChange={(arr) => onValueChange?.(arr[0])}
        onValueCommit={(arr) => onCommit?.(arr[0])}
      >
        <Slider.Track className="bg-slate-200 relative grow rounded-full h-[4px]">
          <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-white shadow border border-slate-300 rounded-full hover:shadow-lg focus:outline-none"
          aria-label="Step value"
        />
      </Slider.Root>
    </div>
  );
});
