import { db } from "@/lib/db";
import { hashPassword } from "@/lib/utils/password";
import { UserRole } from "@prisma/client";

export const userService = {
    async getById(id: string) {
        return db.user.findUnique({
            where: { id, deletedAt: null },
        });
    },

    async getByTenantId(tenantId: string) {
        return db.tenantUser.findMany({
            where: { tenantId },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
    },

    async create(data: {
        name: string;
        email: string;
        password: string;
        role?: UserRole;
        tenantId?: string;
    }) {
        const hashed = await hashPassword(data.password);

        const user = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashed,
                role: data.role ?? UserRole.TENANT_STAFF,
            },
        });

        if (data.tenantId) {
            await db.tenantUser.create({
                data: {
                    userId: user.id,
                    tenantId: data.tenantId,
                    role: data.role ?? UserRole.TENANT_STAFF,
                },
            });
        }

        return user;
    },

    async updateRole(userId: string, tenantId: string, role: UserRole) {
        return db.tenantUser.update({
            where: {
                userId_tenantId: { userId, tenantId },
            },
            data: { role },
        });
    },

    async removeFromTenant(userId: string, tenantId: string) {
        return db.tenantUser.delete({
            where: {
                userId_tenantId: { userId, tenantId },
            },
        });
    },

    async softDelete(id: string) {
        return db.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
};
