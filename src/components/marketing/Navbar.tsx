"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                        Nusadigi<span className="text-red-600">.id</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600 dark:text-slate-300"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-700 hover:text-red-600 dark:text-slate-300"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/register"
                        className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-none shadow-lg shadow-red-600/25"
                    >
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Mobile menu */}
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-slate-100 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden"
                >
                    {navLinks.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-sm font-medium text-slate-700 hover:text-red-600"
                        >
                            {l.label}
                        </Link>
                    ))}
                    <div className="mt-4 flex flex-col gap-2">
                        <Link href="/login" className="btn btn-ghost btn-sm">
                            Sign in
                        </Link>
                        <Link
                            href="/register"
                            className="btn btn-sm bg-red-600 text-white border-none"
                        >
                            Get Started
                        </Link>
                    </div>
                </motion.div>
            )}
        </header>
    );
}
