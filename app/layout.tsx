import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { PWAInstall } from "@/components/pwa-install"
import { GoogleAnalytics } from "@/components/google-analytics"
import "./globals.css"

/* ================= FONTS ================= */
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" })

const bodyClassName = `font-sans ${playfair.variable} ${inter.variable} ${outfit.variable} antialiased`

/* ================= SEO METADATA ================= */
const BASE_URL = "https://karungussv.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Karungu Survivors of Sexual Violence | Break the Silence, End the Violence",
    template: "%s | KSSV",
  },
  description:
    "Karungu Survivors of Sexual Violence (KSSV) is a community-based organization in Kenya empowering survivors through legal aid, psychosocial support, advocacy, and economic resilience.",
  keywords: [
    "Karungu", "KSSV", "survivors of sexual violence", "gender-based violence Kenya", "GBV support",
    "GBV awareness Kenya", "sexual violence prevention", "women empowerment Kenya", "women rights Kenya",
    "community-based organization Kenya", "legal aid for survivors", "psychosocial support Kenya",
    "economic empowerment survivors", "youth programs GBV", "mental health support Kenya", "healing after trauma",
    "sexual assault survivors", "violence prevention programs", "survivor dignity", "empowerment programs Kenya",
    "volunteer GBV support", "donation support survivors", "karungu community projects", "advocacy for GBV survivors",
    "GBV legal assistance", "rape crisis support Kenya", "support groups survivors", "community awareness campaigns",
    "women leadership Kenya", "gender equality Kenya", "psychological counseling GBV", "GBV recovery programs",
    "trauma-informed care Kenya", "human rights Kenya", "children affected by GBV", "family support GBV",
    "sexual harassment Kenya", "safe spaces for survivors", "rehabilitation for survivors", "counseling for trauma",
    "GBV education programs", "sexual violence myths", "GBV facts Kenya", "victim support Kenya",
    "healing and justice", "community dialogue GBV", "partnerships for GBV", "empowering survivors",
    "survivor success stories", "GBV news updates", "awareness campaigns Kenya", "break the silence GBV",
    "end sexual violence Kenya", "gender equity Kenya", "CBO Kenya", "social support survivors"
  ],
  authors: [{ name: "Karungu Survivors of Sexual Violence", url: BASE_URL }],
  creator: "Karungu Survivors of Sexual Violence",
  publisher: "KSSV",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Karungu Survivors of Sexual Violence",
    description: "Break the Silence, End the Violence. Supporting survivors of sexual and gender-based violence in Karungu, Kenya.",
    url: BASE_URL,
    siteName: "KSSV",
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: "Karungu Survivors of Sexual Violence (KSSV)" }],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karungu Survivors of Sexual Violence",
    description: "Empowering survivors through justice, healing, and economic resilience in Karungu, Kenya.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@cbo_ssv",
  },
  robots: { index: true, follow: true },
  verification: { google: "GpnZ03Fx_Qldh1iby8Yb9y_h0HviskvuZK3aln2qu4M" },
}

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google site verification */}
        <meta name="google-site-verification" content="GpnZ03Fx_Qldh1iby8Yb9y_h0HviskvuZK3aln2qu4M" />

        {/* Social identity reinforcement - FIXED WORKING LINKS */}
        <meta property="og:see_also" content="https://www.facebook.com/ssvcbo" />
        <meta property="og:see_also" content="https://x.com/cbo_ssv?t=6jHOXKYINRjBxeeMYKablA&s=09" />
        <meta property="og:see_also" content="https://www.instagram.com/ssvcbo?igsh=YzljYTk1ODg3Zg==" />
        <meta property="og:see_also" content="https://www.linkedin.com/in/karungu-ssv-cbo-71143437b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0FA3A3" />
      </head>

      <body className={bodyClassName} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Suspense fallback={<div>Loading…</div>}>{children}</Suspense>
          <PWAInstall />
        </ThemeProvider>

        {/* ✅ SERVICE WORKER REGISTRATION */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", () => {
                  navigator.serviceWorker.register("/sw.js");
                });
              }
            `,
          }}
        />

        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
