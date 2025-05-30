"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
  const [generatingEvents, setGeneratingEvents] = useState(false);

  const generateExperimentEvents = async (experiment: Experiment) => {
    setGeneratingEvents(true);
    console.log("generating experiment events", experiment);

    let i = 0;
    while (i < 10) {
      i++;

      for (const metric of experiment.metrics) {
        let eventName: string | undefined = undefined;
        if (metric.event) {
          eventName = metric.event as string;
        } else {
          Object.keys(metric).forEach((k) => {
            if (k !== "kind" && k !== "metric_type") {
              if (Array.isArray((metric[k] as any).series)) {
                // capture legacy events
                eventName = (metric[k] as { series: { name: string }[] })
                  .series[0]?.name;
              } else {
                // capture events for new experiment engine
                eventName = (metric[k] as { name: string }).name;
              }
            }
          });
        }

        if (eventName) {
          fetch("/api/experiments/generate-events", {
            method: "POST",
            body: JSON.stringify({
              distinctId: `user-${i}-${Date.now()}`,
              event: eventName,
              featureFlagKey: experiment.feature_flag_key,
            }),
          });
        }
      }
    }
    toast.success("Events generated successfully");
    setGeneratingEvents(false);
  };

  return (
    <Card key={experiment.id}>
      <CardHeader>
        <CardTitle>{experiment.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mt-1">
          {experiment.description || "No hypothesis"}
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <p>Feature Flag: {experiment.feature_flag_key}</p>
          <p>
            Start Date: {new Date(experiment.start_date).toLocaleDateString()}
          </p>
        </div>
        <Button
          onClick={() => {
            generateExperimentEvents(experiment);
          }}
          disabled={generatingEvents}
          className="w-full mt-4"
        >
          {generatingEvents ? "Generating Events..." : "Generate Events"}
        </Button>
      </CardContent>
    </Card>
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
        <div className="flex flex-col gap-4">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      )}
    </>
  );
}
