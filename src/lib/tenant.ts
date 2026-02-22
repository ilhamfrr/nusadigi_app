import { db } from "@/lib/db";
import { TenantStatus } from "@prisma/client";
import { cache } from "react";

/**
 * Resolve tenant by subdomain/slug — cached per request
 */
export const getTenantBySlug = cache(async (slug: string) => {
    if (!slug) return null;

    const tenant = await db.tenant.findUnique({
        where: {
            slug,
            status: TenantStatus.ACTIVE,
            deletedAt: null,
        },
        include: {
            subscription: {
                include: { plan: true },
            },
        },
    });

    return tenant;
});

/**
 * Resolve tenant by custom domain
 */
export const getTenantByDomain = cache(async (domain: string) => {
    if (!domain) return null;

    return db.tenant.findUnique({
        where: { domain, status: TenantStatus.ACTIVE, deletedAt: null },
        include: {
            subscription: {
                include: { plan: true },
            },
        },
    });
});

/**
 * Get tenant from request headers (set by middleware)
 */
export function getTenantSubdomainFromHeaders(
    headers: Headers
): string | null {
    return headers.get("x-tenant-subdomain");
}
