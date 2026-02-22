"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

const stats = [
    { value: "500+", label: "Active Tenants" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "24/7", label: "Support" },
];

export default function Hero() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-28 pb-20">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

            {/* Red glow */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-red-600/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-1.5 text-sm font-medium text-red-400">
                        <Zap className="h-3.5 w-3.5" />
                        White Label SaaS Platform — Built for Scale
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
                >
                    Launch Your{" "}
                    <span className="gradient-text">White Label</span>
                    <br />
                    Platform in Minutes
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mx-auto mt-6 max-w-2xl text-lg text-slate-400"
                >
                    Nusadigi lets you deploy fully branded SaaS tenants with custom logos,
                    colors, and isolated data — all managed from one powerful platform.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    <Link
                        href="/register"
                        className="group flex items-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-500 hover:shadow-red-500/40 hover:scale-105"
                    >
                        Start for Free
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="#pricing"
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
                    >
                        View Pricing
                    </Link>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500"
                >
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>No credit card required · Free 14-day trial · Cancel anytime</span>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.75 }}
                    className="mt-20 grid grid-cols-3 gap-8 border-t border-white/5 pt-12"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-4xl font-extrabold text-white">{stat.value}</p>
                            <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Mock dashboard preview */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.9 }}
                    className="relative mt-20 rounded-2xl border border-white/10 bg-slate-800/50 p-2 shadow-2xl shadow-black/50 backdrop-blur"
                >
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
                        <div className="h-3 w-3 rounded-full bg-red-500/70" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                        <div className="h-3 w-3 rounded-full bg-green-500/70" />
                        <span className="ml-2 text-xs text-slate-500">Nusadigi Dashboard</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 p-4">
                        {/* Sidebar mock */}
                        <div className="col-span-1 space-y-2 rounded-xl bg-slate-900/50 p-3">
                            {["Overview", "Tenants", "Revenue", "Settings"].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-lg bg-slate-800/50 px-3 py-2 text-left text-xs text-slate-400"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        {/* Content mock */}
                        <div className="col-span-3 space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Tenants", value: "128" },
                                    { label: "Revenue", value: "$24.8K" },
                                    { label: "Active", value: "98%" },
                                ].map((card) => (
                                    <div
                                        key={card.label}
                                        className="rounded-xl bg-slate-800/60 p-3 text-left"
                                    >
                                        <p className="text-xs text-slate-400">{card.label}</p>
                                        <p className="text-xl font-bold text-white">{card.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="h-28 rounded-xl bg-gradient-to-r from-red-600/20 to-red-500/5 border border-red-600/10 flex items-center justify-center">
                                <span className="text-xs text-slate-500">Revenue Chart</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
