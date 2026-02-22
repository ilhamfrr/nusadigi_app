import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia",
    typescript: true,
});

/**
 * Create a Stripe Checkout session for a subscription
 */
export async function createCheckoutSession({
    customerId,
    priceId,
    tenantId,
    successUrl,
    cancelUrl,
    trialDays = 14,
}: {
    customerId: string;
    priceId: string;
    tenantId: string;
    successUrl: string;
    cancelUrl: string;
    trialDays?: number;
}) {
    return stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: {
            trial_period_days: trialDays,
            metadata: { tenantId },
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { tenantId },
        allow_promotion_codes: true,
    });
}

/**
 * Create a Stripe Customer Portal session
 */
export async function createPortalSession({
    customerId,
    returnUrl,
}: {
    customerId: string;
    returnUrl: string;
}) {
    return stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });
}

/**
 * Verify Stripe webhook signature
 */
export function constructWebhookEvent(
    payload: string,
    signature: string
): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
