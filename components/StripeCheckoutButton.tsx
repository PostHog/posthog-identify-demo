"use client"

import { useState } from "react"
import { usePostHog } from "posthog-js/react"
import { Button } from "@/components/ui/button"

export function StripeCheckoutButton() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // Get PostHog IDs
      const distinctId = posthog?.get_distinct_id?.() || undefined
      const sessionId = posthog?.get_session_id?.() || undefined
      // Try to get group info if available (assume groupType 'company')
      let groupId: string | undefined = undefined
      if (posthog && posthog.getGroups) {
        const groups = posthog.getGroups()
        if (groups && groups.company) {
          groupId = groups.company
        }
      }

      // Call backend to create checkout session
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distinct_id: distinctId,
          session_id: sessionId,
          group_id: groupId,
          // product info can be hardcoded for now
        })
      })
      if (!res.ok) throw new Error("Failed to create checkout session")
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (err) {
      alert("Error: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} className="w-full" disabled={loading}>
      {loading ? "Redirecting..." : "Pay with Stripe"}
    </Button>
  )
} 