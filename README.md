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

## Project Structure

- `app/components/PostHogActions.tsx`: UI and logic for interacting with PostHog.
- `components/PostHogProvider.tsx`: PostHog initialization and provider setup.
- `app/page.tsx`: Main page that renders the PostHog actions UI.

## Notes

- This project is intended for demonstration and testing purposes.
- Make sure to use your own PostHog project API key.
- For more information, see the [PostHog React docs](https://posthog.com/docs/libraries/react) and [Next.js integration guide](https://posthog.com/docs/libraries/next-js).
