// app/error.jsx
'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    posthog.captureException(error)
  }, [error])

  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>We've logged this error and will look into it.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}