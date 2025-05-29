import { getPostHogServer } from "@/app/posthog-server"

export async function GET() {
    try {
        throw new Error('Backend API error')
    } catch (error) {
        console.log('HERE')
        const posthog = getPostHogServer()
        posthog.captureException('Backend API error', undefined, {
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
    return new Response('Error captured', { status: 500 })
}