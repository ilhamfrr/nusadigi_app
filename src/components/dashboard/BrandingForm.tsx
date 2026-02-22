"use client";

import { useState, useRef } from "react";
import { Upload, Save, Palette } from "lucide-react";

interface BrandingFormProps {
    tenant: {
        id: string;
        name: string;
        logo?: string | null;
        primaryColor: string;
        companyName?: string | null;
        tagline?: string | null;
    };
}

const PRESET_COLORS = [
    "#DC2626", "#2563EB", "#16A34A", "#D97706",
    "#7C3AED", "#DB2777", "#0891B2", "#059669",
];

export default function BrandingForm({ tenant }: BrandingFormProps) {
    const [color, setColor] = useState(tenant.primaryColor);
    const [preview, setPreview] = useState(tenant.logo ?? "");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        const fd = new FormData(e.currentTarget);

        const res = await fetch(`/api/tenants/${tenant.id}/branding`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                primaryColor: color,
                companyName: fd.get("companyName"),
                tagline: fd.get("tagline"),
            }),
        });

        setSaving(false);
        if (res.ok) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    }

    return (
        <form onSubmit={handleSave} className="space-y-8">
            {success && (
                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                    Branding saved successfully!
                </div>
            )}

            {/* Logo */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">Logo</h3>
                <p className="mt-1 text-sm text-slate-500">Upload your brand logo (PNG, SVG recommended)</p>
                <div className="mt-4 flex items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900 overflow-hidden">
                        {preview ? (
                            <img src={preview} alt="Logo" className="h-full w-full object-contain p-2" />
                        ) : (
                            <Upload className="h-6 w-6 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="btn btn-sm border border-slate-300"
                        >
                            <Upload className="h-3.5 w-3.5" />
                            Upload Logo
                        </button>
                        <p className="mt-1 text-xs text-slate-400">Max 2MB, PNG/SVG/webp</p>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                </div>
            </div>

            {/* Colors */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Brand Color
                </h3>
                <p className="mt-1 text-sm text-slate-500">Choose your primary brand color</p>
                <div className="mt-4 flex flex-wrap gap-3">
                    {PRESET_COLORS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className="h-10 w-10 rounded-xl border-2 transition-transform hover:scale-110"
                            style={{
                                backgroundColor: c,
                                borderColor: color === c ? "#000" : "transparent",
                            }}
                        />
                    ))}
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-10 w-10 cursor-pointer rounded-xl border border-slate-300 bg-transparent p-0.5"
                        />
                        <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{color}</span>
                    </div>
                </div>

                {/* Live preview */}
                <div className="mt-4 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Preview</p>
                    <button
                        type="button"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                        style={{ backgroundColor: color }}
                    >
                        Sample Button
                    </button>
                </div>
            </div>

            {/* Company info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">Company Info</h3>
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Company Name
                        </label>
                        <input
                            name="companyName"
                            defaultValue={tenant.companyName ?? ""}
                            className="input w-full border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                            placeholder="Acme Corp"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Tagline
                        </label>
                        <input
                            name="tagline"
                            defaultValue={tenant.tagline ?? ""}
                            className="input w-full border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                            placeholder="Building the future"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="btn bg-red-600 text-white hover:bg-red-700 border-none shadow-lg shadow-red-600/20"
                >
                    {saving ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        <><Save className="h-4 w-4" /> Save Branding</>
                    )}
                </button>
            </div>
        </form>
    );
}
