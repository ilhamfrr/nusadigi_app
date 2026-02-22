import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import BrandingForm from "@/components/dashboard/BrandingForm";

async function getTenantForUser(userId: string) {
    const tenantUser = await db.tenantUser.findFirst({
        where: { userId, role: { in: ["TENANT_ADMIN"] } },
        include: { tenant: true },
    });
    return tenantUser?.tenant ?? null;
}

export default async function BrandingPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (session.user.role === "TENANT_STAFF") redirect("/dashboard");

    const tenant = await getTenantForUser(session.user.id);
    if (!tenant && session.user.role !== "SUPER_ADMIN") redirect("/dashboard");

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Branding Settings
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Customize how your platform looks to users
                </p>
            </div>
            {tenant && <BrandingForm tenant={tenant} />}
        </div>
    );
}
