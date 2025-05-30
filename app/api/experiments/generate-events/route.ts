import { getPostHogServer } from "@/app/posthog-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const distinctId = body.distinctId;
  const event = body.event;
  const featureFlagKey = body.featureFlagKey;
  console.log("featureFlagKey", featureFlagKey);
  console.log("distinctId", distinctId);
  console.log("event", event);

  try {
    const posthog = getPostHogServer();
    await posthog.getFeatureFlag(featureFlagKey, distinctId);
    posthog.capture({
      distinctId: distinctId,
      event: event,
      sendFeatureFlags: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error generating events:", error);
    return NextResponse.json(
      { error: "Failed to generate events" },
      { status: 500 }
    );
  }
}
