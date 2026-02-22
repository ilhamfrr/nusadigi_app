import { db } from "@/lib/db";
import { TenantStatus } from "@prisma/client";

export interface CreateTenantInput {
    name: string;
    slug: string;
    primaryColor?: string;
    logo?: string;
    companyName?: string;
    tagline?: string;
    supportEmail?: string;
}

export const tenantService = {
    async getAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [tenants, total] = await Promise.all([
            db.tenant.findMany({
                where: { deletedAt: null },
                include: {
                    subscription: { include: { plan: true } },
                    _count: { select: { tenantUsers: true } },
                },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            db.tenant.count({ where: { deletedAt: null } }),
        ]);
        return { tenants, total, pages: Math.ceil(total / limit) };
    },

    async getById(id: string) {
        return db.tenant.findUnique({
            where: { id, deletedAt: null },
            include: {
                subscription: { include: { plan: true } },
                tenantUsers: {
                    include: { user: true },
                },
            },
        });
    },

    async create(data: CreateTenantInput) {
        return db.tenant.create({
            data: {
                ...data,
                status: TenantStatus.PENDING,
            },
        });
    },

    async update(id: string, data: Partial<CreateTenantInput>) {
        return db.tenant.update({ where: { id }, data });
    },

    async updateBranding(
        id: string,
        branding: { logo?: string; primaryColor?: string; companyName?: string; tagline?: string }
    ) {
        return db.tenant.update({ where: { id }, data: branding });
    },

    async activate(id: string) {
        return db.tenant.update({
            where: { id },
            data: { status: TenantStatus.ACTIVE },
        });
    },

    async suspend(id: string) {
        return db.tenant.update({
            where: { id },
            data: { status: TenantStatus.SUSPENDED },
        });
    },

    async softDelete(id: string) {
        return db.tenant.update({
            where: { id },
            data: { deletedAt: new Date(), status: TenantStatus.DELETED },
        });
    },

    async getStats() {
        const [total, active, pending, suspended] = await Promise.all([
            db.tenant.count({ where: { deletedAt: null } }),
            db.tenant.count({ where: { status: "ACTIVE", deletedAt: null } }),
            db.tenant.count({ where: { status: "PENDING", deletedAt: null } }),
            db.tenant.count({ where: { status: "SUSPENDED", deletedAt: null } }),
        ]);
        return { total, active, pending, suspended };
    },
};
