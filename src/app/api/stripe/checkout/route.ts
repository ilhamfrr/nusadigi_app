import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { subscriptionService } from "@/lib/services/subscription.service";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
    priceId: z.string(),
    tenantId: z.string(),
});

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { priceId, tenantId } = parsed.data;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    try {
        const customerId = await subscriptionService.createOrGetStripeCustomer(
            session.user.id!,
            session.user.email!
        );

        const checkoutSession = await createCheckoutSession({
            customerId,
            priceId,
            tenantId,
            successUrl: `${baseUrl}/dashboard/tenant/subscription?success=true`,
            cancelUrl: `${baseUrl}/dashboard/tenant/subscription?canceled=true`,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (err: any) {
        console.error("Checkout error:", err);
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }
}
