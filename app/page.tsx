import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Programs } from "@/components/programs"
import { Impact } from "@/components/impact"
import Projects from "@/components/projects"
import Testimonials from "@/components/testimonials"
import { GetInvolved } from "@/components/get-involved"
import { Donate } from "@/components/donate"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { SkipToContent } from "@/components/skip-to-content"

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NonprofitOrganization",
      "@id": "https://karungussv.vercel.app/#organization",
      name: "Karungu Survivors of Sexual Violence",
      alternateName: "KSSV",
      url: "https://karungussv.vercel.app",
      logo: "https://karungussv.vercel.app/og-image.png",
      description:
        "Empowering survivors through justice, healing, and economic resilience in Karungu, Migori County, Kenya.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Karungu",
        addressRegion: "Migori County",
        addressCountry: "KE",
      },
      sameAs: [
        "https://www.facebook.com/share/19dKj3hVN6/",
        "https://www.instagram.com/ssvcbo",
        "https://www.linkedin.com/in/karungu-ssv-cbo-71143437b",
        "https://x.com/cbo_ssv",
      ],
    },

    {
      "@type": "WebSite",
      "@id": "https://karungussv.vercel.app/#website",
      url: "https://karungussv.vercel.app",
      name: "Karungu Survivors of Sexual Violence",
      publisher: { "@id": "https://karungussv.vercel.app/#organization" },
    },

    {
      "@type": "WebPage",
      "@id": "https://karungussv.vercel.app/#home",
      url: "https://karungussv.vercel.app/",
      name: "Home – Karungu Survivors of Sexual Violence",
      isPartOf: { "@id": "https://karungussv.vercel.app/#website" },
    },

    {
      "@type": "WebPage",
      "@id": "https://karungussv.vercel.app/#about",
      url: "https://karungussv.vercel.app/#about",
      name: "About Us – Karungu Survivors of Sexual Violence",
    },
    {
      "@type": "WebPage",
      "@id": "https://karungussv.vercel.app/#programs",
      url: "https://karungussv.vercel.app/#programs",
      name: "Programs – Karungu Survivors of Sexual Violence",
    },
    {
      "@type": "WebPage",
      "@id": "https://karungussv.vercel.app/#projects",
      url: "https://karungussv.vercel.app/#projects",
      name: "Projects – Karungu Survivors of Sexual Violence",
    },
    {
      "@type": "WebPage",
      "@id": "https://karungussv.vercel.app/#contact",
      url: "https://karungussv.vercel.app/#contact",
      name: "Contact – Karungu Survivors of Sexual Violence",
    },
    {
      "@type": "WebPage",
      "@id": "https://karungussv.vercel.app/#donate",
      url: "https://karungussv.vercel.app/#donate",
      name: "Donate – Karungu Survivors of Sexual Violence",
    },
  ],
}

export default function Home() {
  return (
    <>
      <SkipToContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main id="main-content" className="relative">
        <Navigation />
        <Hero />
        <section id="about"><About /></section>
        <section id="programs"><Programs /></section>
        <Impact />
        <section id="projects"><Projects /></section>
        <Testimonials />
        <GetInvolved />
        <section id="donate"><Donate /></section>
        <section id="contact"><Contact /></section>
        <Footer />
      </main>
    </>
  )
}
