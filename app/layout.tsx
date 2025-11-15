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

// ✅ Load fonts once (no dynamic changes)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

// ✅ Precomputed body class (avoids hydration mismatch)
const bodyClassName = `font-sans ${playfair.variable} ${inter.variable} ${outfit.variable} antialiased`

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://kssv-ngo.vercel.app"),
  title: {
    default: "Karungu Survivors of Sexual Violence | Break the Silence, End the Violence",
    template: "%s | KSSV",
  },
  description:
    "Empowering survivors through justice, healing, and economic resilience. Supporting survivors of sexual violence in Karungu with legal aid, psychosocial support, and economic empowerment.",
  keywords: [
    "KSSV",
    "Karungu",
    "survivors",
    "sexual violence",
    "GBV",
    "gender-based violence",
    "legal aid",
    "empowerment",
    "Kenya",
    "NGO",
    "psychosocial support",
    "economic empowerment",
    "survivor support",
    "women's rights",
    "justice",
  ],
  authors: [{ name: "Karungu Survivors of Sexual Violence", url: "https://kssv-ngo.vercel.app" }],
  creator: "Karungu Survivors of Sexual Violence",
  publisher: "KSSV",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Karungu Survivors of Sexual Violence",
    description:
      "Break the Silence, End the Violence. Empowering survivors through justice, healing, and economic resilience.",
    url: "https://kssv-ngo.vercel.app",
    siteName: "KSSV",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KSSV - Karungu Survivors of Sexual Violence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karungu Survivors of Sexual Violence",
    description:
      "Break the Silence, End the Violence. Empowering survivors through justice, healing, and economic resilience.",
    images: ["/og-image.png"],
    creator: "@karungusurvivors",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta property="og:see_also" content="https://facebook.com/karungusurvivors" />
        <meta property="og:see_also" content="https://twitter.com/karungusurvivors" />
        <meta property="og:see_also" content="https://instagram.com/karungusurvivors" />
        <meta property="og:see_also" content="https://linkedin.com/company/karungusurvivors" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0FA3A3" />
      </head>

      {/* ✅ suppressHydrationWarning added on body */}
      <body className={bodyClassName} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <PWAInstall />
        </ThemeProvider>

        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
