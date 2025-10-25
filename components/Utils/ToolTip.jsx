'use client';
import React from 'react';

export default function ToolTip({ text }) {
  return (
    <div
      className="
        absolute hidden group-hover:block
        top-full right-0 mt-2
        w-64 
        bg-gray-800 text-white text-xs
        px-3 py-2 rounded-md shadow-lg
        whitespace-normal break-words leading-snug text-left
        z-20
      "
    >
      {text}
    </div>
  );
}
