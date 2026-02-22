"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    BarChart2,
    Settings,
    Palette,
    Zap,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    roles: string[];
}

const navItems: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "TENANT_ADMIN", "TENANT_STAFF"] },
    { href: "/dashboard/admin", label: "Tenants", icon: Building2, roles: ["SUPER_ADMIN"] },
    { href: "/dashboard/admin/subscriptions", label: "Subscriptions", icon: CreditCard, roles: ["SUPER_ADMIN"] },
    { href: "/dashboard/admin/revenue", label: "Revenue", icon: BarChart2, roles: ["SUPER_ADMIN"] },
    { href: "/dashboard/tenant/users", label: "Users", icon: Users, roles: ["TENANT_ADMIN"] },
    { href: "/dashboard/tenant/branding", label: "Branding", icon: Palette, roles: ["TENANT_ADMIN"] },
    { href: "/dashboard/tenant/subscription", label: "Subscription", icon: CreditCard, roles: ["TENANT_ADMIN"] },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["SUPER_ADMIN", "TENANT_ADMIN"] },
];

interface Props {
    role: string;
}

export default function DashboardSidebar({ role }: Props) {
    const pathname = usePathname();

    const filteredItems = navItems.filter((item) => item.roles.includes(role));

    return (
        <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex md:flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5 dark:border-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                    <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                    Nusadigi<span className="text-red-600">.id</span>
                </span>
            </div>

            {/* Role badge */}
            <div className="px-4 pt-4">
                <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {role.replace("_", " ")}
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {filteredItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 flex-shrink-0" />
                                    {item.label}
                                    {isActive && (
                                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-red-400" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom */}
            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs text-slate-400">Nusadigi v1.0.0</p>
            </div>
        </aside>
    );
}
