"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name,
                email: form.email,
                password: form.password,
            }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error || "Registration failed.");
            return;
        }

        // Auto sign in
        await signIn("credentials", {
            email: form.email,
            password: form.password,
            callbackUrl: "/dashboard",
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Nusadigi<span className="text-red-500">.id</span>
                        </span>
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold text-white">
                        Create your account
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Start your 14-day free trial today
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-900/30 border border-red-800 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
                            {
                                label: "Email",
                                name: "email",
                                type: "email",
                                placeholder: "you@company.com",
                            },
                            {
                                label: "Password",
                                name: "password",
                                type: "password",
                                placeholder: "Min 8 characters",
                            },
                            {
                                label: "Confirm Password",
                                name: "confirmPassword",
                                type: "password",
                                placeholder: "Repeat password",
                            },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    required
                                    value={form[field.name as keyof typeof form]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="input w-full border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-full bg-red-600 text-white hover:bg-red-700 border-none shadow-lg shadow-red-600/30 disabled:opacity-60 mt-2"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-slate-500">
                        By registering, you agree to our{" "}
                        <Link href="/terms" className="text-red-400 hover:underline">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-red-400 hover:underline">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-red-400 hover:text-red-300">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
