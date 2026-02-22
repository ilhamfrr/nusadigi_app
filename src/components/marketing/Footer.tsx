import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                                <Zap className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">
                                Nusadigi<span className="text-red-600">.id</span>
                            </span>
                        </Link>
                        <p className="mt-3 text-sm text-slate-500">
                            The leading white label SaaS platform for digital businesses.
                        </p>
                    </div>

                    {/* Links */}
                    {[
                        {
                            title: "Product",
                            links: ["Features", "Pricing", "Changelog", "Roadmap"],
                        },
                        {
                            title: "Company",
                            links: ["About", "Blog", "Careers", "Contact"],
                        },
                        {
                            title: "Legal",
                            links: ["Privacy", "Terms", "Cookies", "Security"],
                        },
                    ].map((col) => (
                        <div key={col.title}>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {col.title}
                            </h4>
                            <ul className="mt-4 space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link
                                            href="#"
                                            className="text-sm text-slate-500 hover:text-red-600 transition-colors"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-slate-500">
                        © 2026 Nusadigi.id. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-500">
                        Built with ❤️ for the digital economy
                    </p>
                </div>
            </div>
        </footer>
    );
}
