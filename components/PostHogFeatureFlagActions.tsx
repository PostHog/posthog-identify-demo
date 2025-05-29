"use client"

import { useState, useEffect } from "react"
import { usePostHog } from "posthog-js/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PostHogFeatureFlagActions() {
  const posthog = usePostHog()
  const [featureFlags, setFeatureFlags] = useState<Record<string, {variant: string | boolean, payload: any}>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to feature flag changes
    const unsubscribe = posthog.onFeatureFlags((flags, variants) => {
        console.log("flags", flags)
        console.log("variants", variants)
        const flagsWithVariantAndPayload: Record<string, any> = {}
        flags.forEach((flag) => {
            const variant = posthog.getFeatureFlag(flag)
            const payload = posthog.getFeatureFlagPayload(flag)
            flagsWithVariantAndPayload[flag] = {
                variant,
                payload
            }
        })
        setFeatureFlags(flagsWithVariantAndPayload)
        console.log("flagsWithVariantAndPayload", flagsWithVariantAndPayload)
      setLoading(false)
    })

    // Cleanup subscription
    return () => {
      unsubscribe()
    }
  }, [posthog])

  return (
    <>
        {loading ? (
          <p>Loading feature flags...</p>
        ) : Object.keys(featureFlags).length === 0 ? (
          <p>No feature flags found</p>
        ) : (
            <div className="flex flex-col gap-4">
            {Object.keys(featureFlags).map((flag) => (
                <Card key={flag}>
                <CardHeader>
                  <CardTitle>{flag}</CardTitle>
                </CardHeader>
                <CardContent>
                {featureFlags[flag] !== null && (
                  <div className="text-sm text-muted-foreground flex flex-col gap-2">
                    <span><span className="font-medium">Variant:</span> {typeof(featureFlags[flag].variant) === 'boolean' ? featureFlags[flag].variant.toString() : featureFlags[flag].variant}</span>
                    <span><span className="font-medium">Payload:</span> {featureFlags[flag].payload ? JSON.stringify(featureFlags[flag].payload, null, 2) : "No payload"}</span>
                  </div>
                )}
                </CardContent>
              </Card>
            ))}
            </div>
        )}
    </>
  )
}