"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Reseller",
        type: "RESELLER",
        price: 49,
        description: "Perfect for resellers and agencies starting out.",
        features: [
            "Up to 5 tenants",
            "Basic white labeling",
            "Email support",
            "Standard analytics",
            "Stripe billing",
        ],
        highlighted: false,
        cta: "Start Free Trial",
    },
    {
        name: "White Label Pro",
        type: "WHITE_LABEL",
        price: 149,
        description: "Everything you need for a full-featured white label business.",
        features: [
            "Unlimited tenants",
            "Full white label branding",
            "Custom domain support",
            "Advanced analytics",
            "Priority support",
            "Custom color themes",
            "API access",
        ],
        highlighted: true,
        cta: "Start Free Trial",
        badge: "Most Popular",
    },
    {
        name: "Enterprise",
        type: "ENTERPRISE",
        price: 0,
        description: "Custom solutions for large organizations and enterprises.",
        features: [
            "Everything in White Label Pro",
            "Custom SLA",
            "Dedicated support",
            "Custom integrations",
            "On-premise option",
            "Volume discounts",
        ],
        highlighted: false,
        cta: "Contact Sales",
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="bg-white py-24 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <span className="text-sm font-semibold uppercase tracking-widest text-red-600">
                        Pricing
                    </span>
                    <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        Simple, transparent pricing
                    </h2>
                    <p className="mt-4 text-lg text-slate-500">
                        Start with a 14-day free trial. No credit card required.
                    </p>
                </motion.div>

                {/* Plans grid */}
                <div className="mt-16 grid gap-8 lg:grid-cols-3">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            whileHover={{ y: -6 }}
                            className={`relative rounded-2xl p-8 ${plan.highlighted
                                    ? "bg-gradient-to-b from-red-600 to-red-700 text-white shadow-2xl shadow-red-600/30"
                                    : "border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                                }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-slate-900">
                                    {plan.badge}
                                </span>
                            )}

                            <div className="flex items-center gap-2">
                                <Zap
                                    className={`h-5 w-5 ${plan.highlighted ? "text-red-200" : "text-red-600"}`}
                                />
                                <h3
                                    className={`text-lg font-bold ${plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"
                                        }`}
                                >
                                    {plan.name}
                                </h3>
                            </div>

                            <div className="mt-4">
                                {plan.price > 0 ? (
                                    <div className="flex items-end gap-1">
                                        <span
                                            className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"
                                                }`}
                                        >
                                            ${plan.price}
                                        </span>
                                        <span
                                            className={`mb-1 text-sm ${plan.highlighted ? "text-red-200" : "text-slate-400"
                                                }`}
                                        >
                                            /month
                                        </span>
                                    </div>
                                ) : (
                                    <span
                                        className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"
                                            }`}
                                    >
                                        Custom
                                    </span>
                                )}
                                <p
                                    className={`mt-2 text-sm ${plan.highlighted ? "text-red-100" : "text-slate-500"
                                        }`}
                                >
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="mt-8 space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div
                                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${plan.highlighted ? "bg-red-500" : "bg-red-100 dark:bg-red-900/30"
                                                }`}
                                        >
                                            <Check
                                                className={`h-3 w-3 ${plan.highlighted ? "text-white" : "text-red-600"
                                                    }`}
                                            />
                                        </div>
                                        <span
                                            className={`text-sm ${plan.highlighted ? "text-red-100" : "text-slate-600 dark:text-slate-400"
                                                }`}
                                        >
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.type === "ENTERPRISE" ? "/contact" : "/register"}
                                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${plan.highlighted
                                        ? "bg-white text-red-600 hover:bg-red-50 shadow-lg"
                                        : "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20"
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
