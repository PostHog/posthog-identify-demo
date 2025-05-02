# PostHog Identify Example

This project demonstrates how to integrate [PostHog](https://posthog.com) analytics into a Next.js application, with a focus on identifying users, groups, and sending custom events from the UI. It provides a simple interface to test and explore PostHog's core features in a modern React environment.

## Features

- **Identify a Person:** Input a name and identify a user in PostHog.
- **Identify a Group:** Input a group name and identify a group (e.g., company) in PostHog.
- **Send Custom Events:** Input a custom event name and fire it to PostHog.
- **Reset Session:** Reset the current PostHog session for testing.
- **Toasts and Validation:** All actions provide user feedback and input validation.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Set up your environment variables in `.env.local`:

   ```env
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to use the demo UI.

## Stripe Webhook & CLI Testing

To test Stripe payment events and webhook integration locally:

1. **Add Stripe and PostHog keys to `.env.local`:**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...   # See step 4 below
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

2. **Install the Stripe CLI:**
   [Install instructions](https://stripe.com/docs/stripe-cli#install)

3. **Start your Next.js app:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Start Stripe CLI webhook forwarding:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
   - Copy the webhook signing secret (`whsec_...`) from the output and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

5. **Test a payment event:**
   - Go through the `/checkout` flow in your app, or trigger a test event:
     ```bash
     stripe trigger checkout.session.completed
     ```

6. **Verify:**
   - Check your terminal logs for webhook receipt and PostHog event firing.
   - Check your PostHog dashboard for the `Purchase Succeeded` event.

For more, see the [Stripe CLI docs](https://stripe.com/docs/stripe-cli#listen) and [PostHog Revenue Analytics](https://posthog.com/docs/web-analytics/revenue-analytics).

## Project Structure

- `app/components/PostHogActions.tsx`: UI and logic for interacting with PostHog.
- `components/PostHogProvider.tsx`: PostHog initialization and provider setup.
- `app/page.tsx`: Main page that renders the PostHog actions UI.

## Notes

- This project is intended for demonstration and testing purposes.
- Make sure to use your own PostHog project API key.
- For more information, see the [PostHog React docs](https://posthog.com/docs/libraries/react) and [Next.js integration guide](https://posthog.com/docs/libraries/next-js).
