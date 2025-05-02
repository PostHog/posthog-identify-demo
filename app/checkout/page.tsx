import { StripeCheckoutButton } from "@/components/StripeCheckoutButton"

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Stripe Checkout</h1>
        <StripeCheckoutButton />
      </div>
    </div>
  )
} 