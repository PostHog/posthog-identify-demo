"use client";

import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isArray } from "util";

interface Experiment {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  feature_flag_key: string;
  archived: boolean;
  deleted: boolean;
  metrics: {
    [key: string]:
      | {
          series?: {
            name: string;
          }[];
        }
      | string;
  }[];
  parameters: {
    feature_flag_variants: {
      key: string;
    }[];
  };
}

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const posthog = usePostHog();
  const [generatingEvents, setGeneratingEvents] = useState(false);

  const generateExperimentEvents = async (experiment: Experiment) => {
    setGeneratingEvents(true);
    console.log("generating experiment events", experiment);
    let i = 0;
    while (i < 10) {
      i++;
      posthog.reset();
      posthog.identify(`user-${i}-${Date.now()}`);
      posthog.featureFlags.overrideFeatureFlags({
        flags: {
          [experiment.feature_flag_key]:
            experiment.parameters.feature_flag_variants[
              Math.floor(
                Math.random() *
                  experiment.parameters.feature_flag_variants.length
              )
            ].key,
        },
      });

      // wait for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      posthog.getFeatureFlag(experiment.feature_flag_key);

      for (const metric of experiment.metrics) {
        if (metric.event) {
          posthog.capture(metric.event as string, {
            timestamp: new Date().toISOString(),
            source: "identify-test",
          });
        } else {
          Object.keys(metric).forEach((k) => {
            if (k !== "kind" && k !== "metric_type") {
              if (Array.isArray((metric[k] as any).series)) {
                // capture legacy events
                posthog.capture(
                  (metric[k] as { series: { name: string }[] }).series[0]?.name,
                  {
                    timestamp: new Date().toISOString(),
                    source: "identify-test",
                  }
                );
              } else {
                // capture events for new experiment engine
                posthog.capture((metric[k] as { name: string }).name, {
                  timestamp: new Date().toISOString(),
                  source: "identify-test",
                });
              }
            }
          });
        }
      }
    }
    setGeneratingEvents(false);
  };

  return (
    <div
      key={experiment.id}
      className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold">{experiment.name}</h3>
      {experiment.description && (
        <p className="text-gray-600 mt-1">{experiment.description}</p>
      )}
      <div className="mt-2 text-sm text-gray-500">
        <p>Feature Flag: {experiment.feature_flag_key}</p>
        <p>
          Start Date: {new Date(experiment.start_date).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-2">
        <Button
          onClick={() => {
            generateExperimentEvents(experiment);
          }}
          disabled={generatingEvents}
        >
          {generatingEvents ? "Generating Events..." : "Generate Events"}
        </Button>
      </div>
    </div>
  );
}

export function PostHogExperimentActions() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await fetch("/api/experiments");
        if (!response.ok) {
          throw new Error("Failed to fetch experiments");
        }
        const data = await response.json();
        setExperiments(
          data.results.filter(
            (experiment: Experiment) =>
              !experiment.archived &&
              !experiment.deleted &&
              !experiment.end_date
          ) || []
        );
        console.log(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to fetch experiments");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading experiments...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : experiments.length === 0 ? (
        <p>No active experiments found</p>
      ) : (
        <div className="space-y-4">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      )}
    </>
  );
}
