import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://poe2tools.top";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "POE2Tools — Path of Exile 2 Tools, Databases & Guides",
    template: "%s — POE2Tools",
  },
  description:
    "POE2Tools is a Path of Exile 2 toolkit with calculators, databases, and guides for Patch 0.5 and beyond.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "POE2Tools",
    title: "POE2Tools — Path of Exile 2 Tools, Databases & Guides",
    description:
      "Calculators, databases, and guides for Path of Exile 2. Stay up to date with Patch 0.5 content.",
  },
  twitter: {
    card: "summary_large_image",
    title: "POE2Tools — Path of Exile 2 Tools, Databases & Guides",
    description:
      "Calculators, databases, and guides for Path of Exile 2. Stay up to date with Patch 0.5 content.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
