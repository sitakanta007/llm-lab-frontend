'use client';
import { memo } from 'react';
import { Info } from 'lucide-react';
import ToolTip from '../Utils/ToolTip';
import { RangeSlider, StepSlider } from '../Utils/ParamInput';

const SliderField = memo(function SliderField({
  label,
  tooltip,
  value,
  stepValue,
  onRangeChange,
  onStepChange,
  onCommitRange,
  onCommitStep,
}) {
  return (
    <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900 shadow-sm w-full flex flex-col gap-4">
      {/* Top label + tooltip icon */}
      <div className="flex items-center justify-between w-full">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <div className="relative group">
          <Info size={16} className="text-slate-400 cursor-pointer hover:text-blue-500" />
          <ToolTip text={tooltip} />
        </div>
      </div>

      {/* Range slider */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-slate-500 min-w-[60px]">
          Range
        </label>
        <div className="flex-1">
          <RangeSlider
            min={0}
            max={1}
            step={0.01}
            value={value}
            onValueChange={onRangeChange}
            onCommit={onCommitRange}
          />
        </div>
      </div>

      {/* Step slider */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-slate-500 min-w-[60px]">
          Step
        </label>
        <div className="flex-1">
          <StepSlider
            min={0.01}
            max={1}
            step={0.01}
            value={stepValue}
            onValueChange={onStepChange}
            onCommit={onCommitStep}
          />
        </div>
      </div>
    </div>
  );
});

export default SliderField;
