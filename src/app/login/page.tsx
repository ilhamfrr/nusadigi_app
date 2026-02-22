"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Invalid email or password.");
            return;
        }

        router.push("/dashboard");
    }

    async function handleGoogle() {
        await signIn("google", { callbackUrl: "/dashboard" });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Nusadigi<span className="text-red-500">.id</span>
                        </span>
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold text-white">Welcome back</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-900/30 border border-red-800 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-300">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                                placeholder="you@company.com"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input w-full border-white/10 bg-white/5 pr-10 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-full bg-red-600 text-white hover:bg-red-700 border-none shadow-lg shadow-red-600/30 disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs text-slate-500">or continue with</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <button
                        onClick={handleGoogle}
                        className="btn w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-medium text-red-400 hover:text-red-300">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
