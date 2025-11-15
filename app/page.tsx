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
  "@type": "NGO",
  name: "Karungu Survivors of Sexual Violence",
  alternateName: "KSSV",
  url: "https://kssv-ngo.vercel.app",
  logo: "https://kssv-ngo.vercel.app/icon-512.png",
  description:
    "Empowering survivors through justice, healing, and economic resilience. Supporting survivors of sexual violence in Karungu with legal aid, psychosocial support, and economic empowerment.",
  foundingDate: "2021",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karungu",
    addressRegion: "Migori County",
    addressCountry: "KE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+254-XXX-XXXXXX",
    contactType: "Customer Service",
    email: "info@kssv.org",
    availableLanguage: ["English", "Swahili"],
  },
  sameAs: [
    "https://facebook.com/karungusurvivors",
    "https://twitter.com/karungusurvivors",
    "https://instagram.com/karungusurvivors",
    "https://linkedin.com/company/karungusurvivors",
  ],
  areaServed: {
    "@type": "Place",
    name: "Karungu, Migori County, Kenya",
  },
  knowsAbout: [
    "Gender-Based Violence",
    "Legal Aid",
    "Psychosocial Support",
    "Economic Empowerment",
    "Survivor Support",
    "Women's Rights",
  ],
}

export default function Home() {
  return (
    <>
      <SkipToContent />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main id="main-content" className="relative">
        <Navigation />
        <Hero />
        <About />
        <Programs />
        <Impact />
        <Projects />
        <Testimonials />
        <GetInvolved />
        <Donate />
        <Contact />
        <Footer />
      </main>
    </>
  )
}