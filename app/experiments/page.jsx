"use client";

import { useEffect, useState } from "react";
import { Loader2 } from 'lucide-react'; 
import Link from "next/link";
import InlineError from "@utils/InlineError";
import ScrollToTopButton from "@utils/ScrollToTopButton";
import { ExperimentApi } from "@api/experimentApi";

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10); // TODO : make this pagination limit configurable in site-config js 
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const res = await ExperimentApi.getExperiments(limit, offset);
      const data = res.data;
      setExperiments(Array.isArray(data.experiments) ? data.experiments : data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error loading experiments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, [offset]);

  if (loading) return <Loader2 className="animate-spin text-blue-600" size={32} />;
  if (error) return <InlineError message={error} />;

  return (
    <>
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saved Experiments</h1>

      {experiments.length === 0 ? (
        <p className="text-gray-500">No experiments saved yet.</p>
      ) : (
        <div className="space-y-4">
          {experiments.map((exp) => (
            <Link
              key={exp.id}
              href={`/experiments/${exp.id}`}
              className="block p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-lg font-semibold">{exp.prompt}</h2>
              <p className="text-sm text-gray-500">
                {(exp.results?.length ?? 0)} parameter combination{(exp.results?.length ?? 0) !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Created at {new Date(exp.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls - TODO : pagination can be made into a component and can be used in other places */}
      {total > limit && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className={`px-4 py-2 rounded ${
              offset === 0
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
          >
            Previous
          </button>

          <p className="text-sm text-gray-500">
            Showing {offset + 1}–{Math.min(offset + limit, total)} of {total}
          </p>

          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className={`px-4 py-2 rounded ${
              offset + limit >= total
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
    <ScrollToTopButton />
    </>
  );
}
