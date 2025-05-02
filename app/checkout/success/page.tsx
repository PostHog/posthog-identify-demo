import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white flex flex-col items-center">
        <CheckCircle2 className="text-green-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2 text-center">Payment Successful!</h1>
        <p className="mb-6 text-center text-muted-foreground">Thank you for your purchase. Your payment has been processed successfully.</p>
        <Button asChild>
          <Link href="/checkout">Back to Checkout</Link>
        </Button>
      </div>
    </div>
  )
} 