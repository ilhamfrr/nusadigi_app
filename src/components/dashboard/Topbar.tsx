"use client";

import { signOut } from "next-auth/react";
import { LogOut, Bell, ChevronDown } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface Props {
    user: {
        name?: string | null;
        email: string;
        image?: string | null;
        role: string;
    };
}

export default function DashboardTopbar({ user }: Props) {
    return (
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
            {/* Page breadcrumb title - client renders */}
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-slate-500">Dashboard</h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative btn btn-ghost btn-sm btn-circle">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>

                {/* User menu */}
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name ?? ""}
                                className="h-7 w-7 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                                {getInitials(user.name ?? user.email)}
                            </div>
                        )}
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {user.name ?? user.email}
                            </p>
                            <p className="text-xs text-slate-500">{user.role.replace("_", " ")}</p>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content z-50 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
                    >
                        <li>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
