"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from 'lucide-react';
import InlineError from "@utils/InlineError";
import ScrollToTopButton from "@utils/ScrollToTopButton";
import ResultCard from "@components/ResultCard";
import { ExperimentApi } from "@api/experimentApi";

export default function ExperimentDetailPage() {
  const { id } = useParams();
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchExperiment = async () => {
      try {
        setLoading(true);
        const res = await ExperimentApi.getExperimentById(id);
        const data = res.data;
        setExperiment(data.experiment || null);
      } catch (err) {
        console.error("Error loading experiment:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiment();
  }, [id]);

  if (loading) return <Loader2 className="animate-spin text-blue-600" size={32} />;

  if (error) return <InlineError message={error} />;

  if (!experiment) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-2">Experiment Not Found</h1>
        <p className="text-gray-500">The requested experiment does not exist.</p>
      </div>
    );
  }

  return (
    <>
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        Experiment Details
      </h1>
      <p className="text-xl text-gray-400 mb-4">{experiment.prompt}</p>
      <p className="text-sm text-gray-400 mb-6">
        Created at: {new Date(experiment.createdAt).toLocaleString()}
      </p>
      <p className="text-sm text-gray-400 mb-6">
        {experiment?.results?.length ?? 0} Parameter Combination{(experiment?.results?.length ?? 0) !== 1 ? "s" : ""}
      </p>

      {/* Results Section */}
      {experiment.results && experiment.results.length > 0 ? (
        <div className="space-y-4">
          {experiment.results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-4 text-center text-gray-500">
          No results found for this experiment.
        </div>
      )}
    </div>
    <ScrollToTopButton />
    </>
  );
}
