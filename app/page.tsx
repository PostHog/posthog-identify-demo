import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostHogActions } from "../components/PostHogActions";
import { PostHogExperimentActions } from "@/components/PostHogExperimentActions";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>PostHog Identify Test</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Test PostHog identify, group, and event capture functionality.
            </p>
            <PostHogActions />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              <h1>PostHog Experiment Test</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Test PostHog experiment functionality.
            </p>
            <PostHogExperimentActions />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
