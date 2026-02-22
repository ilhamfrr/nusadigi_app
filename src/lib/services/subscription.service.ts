import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { SubscriptionStatus } from "@prisma/client";

export const subscriptionService = {
    async getByTenantId(tenantId: string) {
        return db.subscription.findUnique({
            where: { tenantId },
            include: { plan: true, stripeSubscription: true },
        });
    },

    async getPlans() {
        return db.plan.findMany({
            where: { isActive: true },
            orderBy: { price: "asc" },
        });
    },

    async createOrGetStripeCustomer(userId: string, email: string): Promise<string> {
        const existing = await db.stripeCustomer.findUnique({ where: { userId } });
        if (existing) return existing.customerId;

        const customer = await stripe.customers.create({ email, metadata: { userId } });

        await db.stripeCustomer.create({
            data: { userId, customerId: customer.id, email },
        });

        return customer.id;
    },

    async syncFromStripe(
        stripeSubId: string,
        tenantId: string,
        status: SubscriptionStatus,
        priceId: string,
        customerId: string,
        periodStart: Date,
        periodEnd: Date
    ) {
        // Find plan by stripe price id
        const plan = await db.plan.findFirst({ where: { stripePriceId: priceId } });

        // Upsert subscription record
        const subscription = await db.subscription.upsert({
            where: { tenantId },
            create: {
                tenantId,
                planId: plan?.id ?? "",
                status,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
            },
            update: {
                planId: plan?.id ?? undefined,
                status,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
            },
        });

        // Upsert stripe subscription record
        await db.stripeSubscription.upsert({
            where: { subscriptionId: stripeSubId },
            create: {
                subscriptionId: stripeSubId,
                tenantId,
                subscriptionDbId: subscription.id,
                status,
                priceId,
                customerId,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
            },
            update: {
                status,
                priceId,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
            },
        });

        return subscription;
    },

    async cancel(tenantId: string) {
        const stripeSub = await db.stripeSubscription.findFirst({
            where: { tenantId },
        });

        if (stripeSub) {
            await stripe.subscriptions.update(stripeSub.subscriptionId, {
                cancel_at_period_end: true,
            });
        }

        return db.subscription.update({
            where: { tenantId },
            data: { cancelAtPeriodEnd: true },
        });
    },
};
