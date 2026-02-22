import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { tenantService } from "@/lib/services/tenant.service";
import { subscriptionService } from "@/lib/services/subscription.service";
import { db } from "@/lib/db";
import { Building2, Users, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

async function getAdminStats() {
    const [tenantStats, userCount] = await Promise.all([
        tenantService.getStats(),
        db.user.count({ where: { deletedAt: null } }),
    ]);
    return { tenantStats, userCount };
}

export default async function AdminDashboardPage() {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") redirect("/dashboard");

    const { tenantStats, userCount } = await getAdminStats();

    const stats = [
        { label: "Total Tenants", value: tenantStats.total, icon: Building2, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
        { label: "Active Tenants", value: tenantStats.active, icon: TrendingUp, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
        { label: "Total Users", value: userCount, icon: Users, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
        { label: "Pending Tenants", value: tenantStats.pending, icon: DollarSign, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Super Admin Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Platform overview and management
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
                    >
                        <div className={`inline-flex rounded-xl p-2.5 ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                            {stat.value}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent tenants table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                    Recent Tenants
                </h2>
                <TenantsTable />
            </div>
        </div>
    );
}

type TenantRow = Awaited<ReturnType<typeof tenantService.getAll>>["tenants"][number];

async function TenantsTable() {
    const { tenants } = await tenantService.getAll(1, 10);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                        {["Tenant", "Subdomain", "Status", "Plan", "Users"].map((h) => (
                            <th
                                key={h}
                                className="pb-3 pl-0 text-left text-xs font-medium text-slate-500 uppercase tracking-wide"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {tenants.map((tenant: TenantRow) => (
                        <tr key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="py-3 font-medium text-slate-900 dark:text-white">
                                {tenant.name}
                            </td>
                            <td className="py-3 text-slate-500">{tenant.slug}.nusadigi.id</td>
                            <td className="py-3">
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tenant.status === "ACTIVE"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : tenant.status === "PENDING"
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                >
                                    {tenant.status}
                                </span>
                            </td>
                            <td className="py-3 text-slate-500">
                                {tenant.subscription?.plan?.name ?? "—"}
                            </td>
                            <td className="py-3 text-slate-500">{tenant._count.tenantUsers}</td>
                        </tr>
                    ))}
                    {tenants.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400">
                                No tenants yet
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
