"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Thermometer, Gauge } from "lucide-react";

export default function ResultCard({ result }) {
  const [expanded, setExpanded] = useState(false);

  if (!result) return null;

  const { text, params, metrics } = result;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700"
    >
      {/* Parameters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge label="Temperature" value={params.temperature} />
        <Badge label="Top P" value={params.top_p} />
        <Badge label="Coherence" value={params.coherence} />
      </div>

      {/* Generated Text */}
      <div className="relative">
        <p
          className={`text-gray-800 dark:text-gray-200 leading-relaxed ${
            expanded ? "" : "line-clamp-3"
          } transition-all`}
        >
          {text}
        </p>

        {text.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" /> Show more
              </>
            )}
          </button>
        )}
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300">
          <Metric label="Coherence Score" value={metrics.coherence} />
          <Metric label="Length" value={metrics.length} />
        </div>
      )}
    </div>
  );
}

function Badge({ label, value }) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
      <span>{label}:</span>
      <span className="font-semibold">{Number(value).toFixed(2)}</span>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex items-center gap-1">
      <Gauge className="w-4 h-4 text-blue-500" />
      <span className="font-semibold">{label}:</span>
      <span>{typeof value === "number" ? Number(value).toFixed(3) : value}</span>
    </div>
  );
}
