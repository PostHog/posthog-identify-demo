# Stripe + PostHog Revenue Event Integration Plan

## Overview
This plan outlines the steps to implement a Stripe payment demo with PostHog revenue event tracking, using ShadCN UI components and following the Option 1 method from the PostHog Revenue Analytics docs.

---

## Implementation Plan

### 1. Environment Setup
- **Stripe Secret Key**: Add your Stripe secret key to `.env.local` as `STRIPE_SECRET_KEY`.
- **Stripe Webhook Secret**: After setting up the webhook endpoint, add the webhook secret as `STRIPE_WEBHOOK_SECRET`.

### 2. Frontend: New Checkout Page and Component
- **Page**: Create a new page, e.g., `pages/checkout.tsx` (or `/app/checkout/page.tsx` if using the app directory).
- **Component**: Create a `StripeCheckoutButton` component using ShadCN UI.
- **Logic**:
  - Use the PostHog JS SDK to fetch `distinct_id`, `$session_id`, and group ID (if available) from the current session.
  - On button click, call an API route to create a Stripe Checkout session, passing the PostHog IDs as metadata.

### 3. Backend: Create Checkout Session API
- **API Route**: Create `/api/create-checkout-session`.
- **Logic**:
  - Accept product info and PostHog IDs from the frontend.
  - Use the Stripe Node SDK to create a Checkout session, passing the PostHog IDs as metadata.
  - Return the session URL to the frontend for redirect.

### 4. Frontend: Redirect to Stripe Checkout
- On successful API response, redirect the user to the Stripe Checkout session URL.

### 5. Backend: Stripe Webhook Endpoint
- **API Route**: Create `/api/stripe-webhook`.
- **Logic**:
  - Listen for `checkout.session.completed` events.
  - Extract PostHog IDs and payment details from the session metadata.
  - Fire a PostHog event (`Purchase Succeeded`) with:
    - `distinct_id`
    - `$session_id`
    - `group_id` (if available)
    - `value` (amount in minor units)
    - `currency` (ISO 4217)
    - Any other relevant properties

### 6. Frontend: Confirmation Page
- Optionally, create a `/checkout/success` page to show after payment.

### 7. Testing & Validation
- Test the full flow: open checkout page, pay, confirm event in PostHog.
- Ensure the event appears in PostHog with all required properties for revenue analytics.

---

## File/Component Structure

```
/pages
  /checkout.tsx                # New checkout page
  /api
    /create-checkout-session.ts # API route to create Stripe session
    /stripe-webhook.ts          # API route for Stripe webhooks
/components
  /StripeCheckoutButton.tsx     # Button to trigger checkout
.env.local                      # Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
```

---

## Data Flow

1. **User visits `/checkout`** → sees a ShadCN-styled checkout button.
2. **User clicks button** → frontend collects PostHog IDs, calls `/api/create-checkout-session`.
3. **Backend creates Stripe session** → includes PostHog IDs as metadata, returns session URL.
4. **Frontend redirects to Stripe Checkout**.
5. **User completes payment** → Stripe sends webhook to `/api/stripe-webhook`.
6. **Webhook handler fires PostHog event** with all required revenue properties.
7. **(Optional)** User is redirected to a success page.

---

## Next Steps

1. Add the following to `.env.local`:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (after you create the webhook endpoint in Stripe dashboard)
2. Scaffold the new page, component, and API routes as described above, using ShadCN UI for styling.

---

**Update this plan as progress is made or requirements change.** 