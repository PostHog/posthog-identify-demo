import { NextRequest } from "next/server"
import Stripe from "stripe"
import { PostHog } from "posthog-node"

// Stripe and PostHog setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: "https://us.i.posthog.com"
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  let event: Stripe.Event
  try {
    // Stripe requires the raw body to verify the signature
    const rawBody = await req.arrayBuffer()
    const sig = req.headers.get("stripe-signature") || ""
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed.", err)
    return new Response("Webhook Error: Invalid signature", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata || {}
    const amount = session.amount_total || 0
    const currency = session.currency || "usd"
    const distinct_id = metadata.posthog_distinct_id || ""
    const session_id = metadata.posthog_session_id || ""
    const group_id = metadata.posthog_group_id || ""

    // Fire revenue event to PostHog
    try {
      posthog.capture({
        distinctId: distinct_id,
        event: "Purchase Succeeded",
        groups: {
          company: group_id
        },
        properties: {
          value: amount, // Stripe always uses minor units
          currency,
          $session_id: session_id,
          source: "stripe-webhook"
        }
      })
      posthog.flush()
    } catch (err) {
      console.error("Failed to send event to PostHog:", err)
    }
  }

  return new Response("ok", { status: 200 })
} 