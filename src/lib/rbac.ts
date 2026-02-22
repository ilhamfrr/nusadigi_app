import { UserRole } from "@prisma/client";

// Permission definitions
export type Permission =
    | "manage:tenants"
    | "manage:all_users"
    | "manage:plans"
    | "view:all_analytics"
    | "view:revenue"
    | "manage:subscriptions"
    | "manage:users"
    | "manage:branding"
    | "view:analytics"
    | "manage:settings"
    | "view:dashboard";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    SUPER_ADMIN: [
        "manage:tenants",
        "manage:all_users",
        "manage:plans",
        "view:all_analytics",
        "view:revenue",
        "manage:subscriptions",
        "manage:users",
        "manage:branding",
        "view:analytics",
        "manage:settings",
        "view:dashboard",
    ],
    TENANT_ADMIN: [
        "manage:users",
        "manage:branding",
        "view:analytics",
        "manage:settings",
        "manage:subscriptions",
        "view:dashboard",
    ],
    TENANT_STAFF: ["view:dashboard"],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole | string, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role as UserRole] ?? [];
    return permissions.includes(permission);
}

/**
 * Check if a role has ALL of the given permissions
 */
export function hasAllPermissions(
    role: UserRole | string,
    permissions: Permission[]
): boolean {
    return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the given permissions
 */
export function hasAnyPermission(
    role: UserRole | string,
    permissions: Permission[]
): boolean {
    return permissions.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: UserRole | string): Permission[] {
    return ROLE_PERMISSIONS[role as UserRole] ?? [];
}

/**
 * Dashboard redirect based on role
 */
export function getDashboardPath(role: UserRole | string): string {
    switch (role) {
        case "SUPER_ADMIN":
            return "/dashboard/admin";
        case "TENANT_ADMIN":
            return "/dashboard/tenant";
        default:
            return "/dashboard/overview";
    }
}
