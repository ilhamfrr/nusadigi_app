import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Users, Palette, CreditCard, Settings } from "lucide-react";
import Link from "next/link";

async function getTenantData(userId: string) {
    const tenantUser = await db.tenantUser.findFirst({
        where: { userId },
        include: {
            tenant: {
                include: {
                    subscription: { include: { plan: true } },
                    _count: { select: { tenantUsers: true } },
                },
            },
        },
    });
    return tenantUser?.tenant ?? null;
}

export default async function TenantDashboardPage() {
    const session = await auth();
    if (session?.user?.role === "SUPER_ADMIN") redirect("/dashboard/admin");
    if (!session?.user) redirect("/login");

    const tenant = await getTenantData(session.user.id);

    const quickLinks = [
        { href: "/dashboard/tenant/users", label: "Manage Users", icon: Users, desc: "Add, remove, and manage team members" },
        { href: "/dashboard/tenant/branding", label: "Branding", icon: Palette, desc: "Update logo and brand colors" },
        { href: "/dashboard/tenant/subscription", label: "Subscription", icon: CreditCard, desc: "View and manage your plan" },
        { href: "/dashboard/settings", label: "Settings", icon: Settings, desc: "General account settings" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {tenant?.name ?? "Your"} Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {tenant?.slug}.nusadigi.id
                    </p>
                </div>
                {tenant?.subscription?.plan && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {tenant.subscription.plan.name}
                    </span>
                )}
            </div>

            {/* Stats row */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm text-slate-500">Team Members</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {tenant?._count.tenantUsers ?? 0}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm text-slate-500">Plan</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {tenant?.subscription?.plan?.name ?? "Free"}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {tenant?.status ?? "—"}
                    </p>
                </div>
            </div>

            {/* Quick links */}
            <div>
                <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                    Quick Actions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-red-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-800"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 group-hover:bg-red-100 dark:bg-red-900/20">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                                {item.label}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
