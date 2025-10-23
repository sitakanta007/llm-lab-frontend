'use client';

import { useState, useEffect } from 'react';

export default function ParamInput({
  value,
  onCommit,
  step = 0.01,
  min = 0,
  max = 1
}) {
  const [localValue, setLocalValue] = useState(value ?? '');

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);

    // Commit as soon as value changes
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onCommit(num);
    } else if (val === '') {
      onCommit('');
    }
  };

  const commitValue = () => {
    const num = parseFloat(localValue);
    if (!isNaN(num)) {
      onCommit(num);
    } else if (localValue === '') {
      onCommit('');
    } else {
      setLocalValue(value ?? '');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitValue();
  };

  return (
    <input
      type="number"
      step={step}
      min={min}
      max={max}
      value={localValue}
      onChange={handleChange}
      onBlur={commitValue}
      onKeyDown={handleKeyDown}
      className="border rounded-lg px-2 py-1 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800"
    />
  );
}
