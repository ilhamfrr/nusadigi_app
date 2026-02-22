import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Nusadigi - White Label SaaS Platform",
    template: "%s | Nusadigi",
  },
  description:
    "The leading SaaS multi-tenant white label platform for digital businesses. Launch your branded platform in minutes.",
  keywords: ["SaaS", "white label", "multi-tenant", "platform", "Nusadigi"],
  authors: [{ name: "Nusadigi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nusadigi.id",
    siteName: "Nusadigi",
    title: "Nusadigi - White Label SaaS Platform",
    description: "The leading SaaS multi-tenant white label platform.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nusadigi - White Label SaaS Platform",
    description: "The leading SaaS multi-tenant white label platform.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="nusadigi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
