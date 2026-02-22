"use client";

import { motion } from "framer-motion";
import { Globe, Palette, Shield, BarChart2, Users, Zap } from "lucide-react";

const features = [
    {
        icon: Globe,
        title: "Subdomain Tenants",
        description:
            "Every tenant gets their own subdomain (tenant.nusadigi.id) with isolated data and full branding control.",
        color: "text-blue-500 bg-blue-500/10",
    },
    {
        icon: Palette,
        title: "White Label Branding",
        description:
            "Custom logos, brand colors, and company names. Your clients see your brand, not ours.",
        color: "text-purple-500 bg-purple-500/10",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description:
            "Role-based access control, JWT sessions, encrypted data at rest, and SOC 2 compliant infrastructure.",
        color: "text-green-500 bg-green-500/10",
    },
    {
        icon: BarChart2,
        title: "Revenue Analytics",
        description:
            "Real-time MRR tracking, churn analysis, and tenant health metrics in one dashboard.",
        color: "text-yellow-500 bg-yellow-500/10",
    },
    {
        icon: Users,
        title: "Multi-Role Access",
        description:
            "Super Admin, Tenant Admin, and Staff roles with granular permission control at every level.",
        color: "text-red-500 bg-red-500/10",
    },
    {
        icon: Zap,
        title: "Stripe Integration",
        description:
            "Automated billing with Stripe: trials, upgrades, downgrades, invoices, and dunning management.",
        color: "text-orange-500 bg-orange-500/10",
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
    return (
        <section id="features" className="bg-slate-50 py-24 dark:bg-slate-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <span className="text-sm font-semibold uppercase tracking-widest text-red-600">
                        Platform Features
                    </span>
                    <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        Everything you need to scale
                    </h2>
                    <p className="mt-4 text-lg text-slate-500">
                        Build, launch, and grow your white-label SaaS business with
                        enterprise-grade infrastructure.
                    </p>
                </motion.div>

                {/* Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800"
                        >
                            <div className={`inline-flex rounded-xl p-3 ${feature.color}`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
