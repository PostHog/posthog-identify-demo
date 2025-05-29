'use client'

import { Button } from "@/components/ui/button"

export function ErrorTestButton() {
  return (
    <Button onClick={() => {
      throw new Error("Test error");
    }}>
      Test Error
    </Button>
  )
} 