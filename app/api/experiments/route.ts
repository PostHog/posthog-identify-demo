import { NextResponse } from 'next/server'

const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_KEY
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com'
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID

export async function GET() {
  if (!POSTHOG_API_KEY || !PROJECT_ID) {
    return NextResponse.json(
      { error: 'Missing required environment variables' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `${POSTHOG_HOST}/api/projects/${PROJECT_ID}/experiments/`,
      {
        headers: {
          Authorization: `Bearer ${POSTHOG_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`PostHog API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching experiments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiments' },
      { status: 500 }
    )
  }
}
