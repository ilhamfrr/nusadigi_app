import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/utils/password";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // --- Super Admin ---
    const adminPassword = await hashPassword("admin123!");
    const admin = await prisma.user.upsert({
        where: { email: "admin@nusadigi.id" },
        update: {},
        create: {
            name: "Super Admin",
            email: "admin@nusadigi.id",
            password: adminPassword,
            role: "SUPER_ADMIN",
        },
    });
    console.log("✅ Super admin created:", admin.email);

    // --- Plans ---
    const plans = await Promise.all([
        prisma.plan.upsert({
            where: { stripePriceId: "price_reseller_monthly" },
            update: {},
            create: {
                name: "Reseller",
                type: "RESELLER",
                description: "Perfect for resellers and agencies starting out.",
                price: 4900, // $49.00 in cents
                interval: "month",
                stripePriceId: "price_reseller_monthly",
                features: {
                    maxTenants: 5,
                    customBranding: false,
                    customDomain: false,
                    apiAccess: false,
                    prioritySupport: false,
                },
            },
        }),
        prisma.plan.upsert({
            where: { stripePriceId: "price_whitelabel_monthly" },
            update: {},
            create: {
                name: "White Label Pro",
                type: "WHITE_LABEL",
                description: "Full-featured white label SaaS platform.",
                price: 14900, // $149.00 in cents
                interval: "month",
                stripePriceId: "price_whitelabel_monthly",
                features: {
                    maxTenants: -1, // unlimited
                    customBranding: true,
                    customDomain: true,
                    apiAccess: true,
                    prioritySupport: true,
                },
            },
        }),
        prisma.plan.upsert({
            where: { stripePriceId: "price_enterprise_monthly" },
            update: {},
            create: {
                name: "Enterprise",
                type: "ENTERPRISE",
                description: "Custom solutions for large organizations.",
                price: 0,
                interval: "month",
                stripePriceId: "price_enterprise_monthly",
                features: {
                    maxTenants: -1,
                    customBranding: true,
                    customDomain: true,
                    apiAccess: true,
                    prioritySupport: true,
                    customSLA: true,
                    onPremise: true,
                },
            },
        }),
    ]);
    console.log("✅ Plans seeded:", plans.map((p) => p.name).join(", "));

    // --- Demo Tenant ---
    const demoTenant = await prisma.tenant.upsert({
        where: { slug: "demo" },
        update: {},
        create: {
            name: "Demo Company",
            slug: "demo",
            primaryColor: "#DC2626",
            companyName: "Demo Corp",
            tagline: "The future is now",
            supportEmail: "support@democorp.com",
            status: "ACTIVE",
        },
    });

    // --- Tenant Admin user ---
    const tenantAdminPassword = await hashPassword("tenant123!");
    const tenantAdmin = await prisma.user.upsert({
        where: { email: "admin@demo.com" },
        update: {},
        create: {
            name: "Demo Admin",
            email: "admin@demo.com",
            password: tenantAdminPassword,
            role: "TENANT_ADMIN",
        },
    });

    await prisma.tenantUser.upsert({
        where: { userId_tenantId: { userId: tenantAdmin.id, tenantId: demoTenant.id } },
        update: {},
        create: {
            userId: tenantAdmin.id,
            tenantId: demoTenant.id,
            role: "TENANT_ADMIN",
        },
    });

    // --- Subscribe demo tenant to White Label Pro ---
    const whitelabelPlan = plans[1];
    await prisma.subscription.upsert({
        where: { tenantId: demoTenant.id },
        update: {},
        create: {
            tenantId: demoTenant.id,
            planId: whitelabelPlan.id,
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });

    console.log("✅ Demo tenant & admin created");
    console.log("\n📋 Seed complete! Login credentials:");
    console.log("  Super Admin: admin@nusadigi.id / admin123!");
    console.log("  Tenant Admin: admin@demo.com / tenant123!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
