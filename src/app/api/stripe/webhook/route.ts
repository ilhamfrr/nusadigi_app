import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { subscriptionService } from "@/lib/services/subscription.service";
import { SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = constructWebhookEvent(body, signature);
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const tenantId = session.metadata?.tenantId;
                if (!tenantId || !session.subscription) break;

                // Full subscription details will come via subscription.updated
                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const sub = event.data.object as Stripe.Subscription;
                const tenantId = sub.metadata?.tenantId;
                if (!tenantId) break;

                await subscriptionService.syncFromStripe(
                    sub.id,
                    tenantId,
                    sub.status.toUpperCase() as SubscriptionStatus,
                    sub.items.data[0]?.price.id ?? "",
                    sub.customer as string,
                    new Date((sub as any).current_period_start * 1000),
                    new Date((sub as any).current_period_end * 1000)
                );
                break;
            }

            case "customer.subscription.deleted": {
                const sub = event.data.object as Stripe.Subscription;
                const tenantId = sub.metadata?.tenantId;
                if (!tenantId) break;

                await subscriptionService.syncFromStripe(
                    sub.id,
                    tenantId,
                    SubscriptionStatus.CANCELED,
                    sub.items.data[0]?.price.id ?? "",
                    sub.customer as string,
                    new Date((sub as any).current_period_start * 1000),
                    new Date((sub as any).current_period_end * 1000)
                );
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error("Webhook processing error:", err);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
