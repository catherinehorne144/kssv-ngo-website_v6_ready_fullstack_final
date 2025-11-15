"use client"

import { Card } from "@/components/ui/card"
import { Heart, Users, Shield, Eye } from "lucide-react"
import { useScrollReveal } from "@/lib/scroll-reveal"

export function About() {
  useScrollReveal()

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every survivor with empathy, dignity, and respect",
      color: "accent-coral",
    },
    {
      icon: Users,
      title: "Teamwork",
      description: "We collaborate with partners and communities for greater impact",
      color: "accent-sky",
    },
    {
      icon: Shield,
      title: "Accountability",
      description: "We maintain transparency and responsibility in all our actions",
      color: "accent-purple",
    },
    {
      icon: Eye,
      title: "Privacy",
      description: "We protect survivor confidentiality and ensure safe spaces",
      color: "secondary",
    },
  ]

  const stats = [
    { number: "500+", label: "Survivors Supported", sublabel: "Since 2021" },
    { number: "15", label: "Legal Convictions", sublabel: "Supported via legal aid" },
    { number: "20+", label: "VSLA Members", sublabel: "Economic empowerment" },
    { number: "100%", label: "Commitment", sublabel: "To survivor dignity" },
  ]

  return (
    <section
      id="about"
      className="py-20 lg:py-32 bg-gradient-to-br from-accent-sunny/10 via-background to-accent-sky/10"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <span className="text-primary font-accent text-sm font-semibold tracking-wider uppercase">About Us</span>
          <h2
            id="about-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance"
          >
            Dedicated to Healing, Justice & Empowerment
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Karungu Survivors of Sexual Violence (KSSV) is a community-based organization committed to breaking the
            silence around sexual violence and empowering survivors through comprehensive support services.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card
            className="p-8 reveal bg-gradient-to-br from-primary/10 to-accent-sky/10 border-primary/30 shadow-lg"
            role="article"
            aria-labelledby="mission-heading"
          >
            <h3 id="mission-heading" className="font-serif text-2xl font-bold text-foreground mb-4">
              Our Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              To provide holistic support to survivors of sexual violence through legal aid, psychosocial counseling,
              and economic empowerment programs that restore dignity and foster resilience.
            </p>
          </Card>

          <Card
            className="p-8 reveal bg-gradient-to-br from-secondary/10 to-accent-sunny/10 border-secondary/30 shadow-lg"
            role="article"
            aria-labelledby="vision-heading"
          >
            <h3 id="vision-heading" className="font-serif text-2xl font-bold text-foreground mb-4">
              Our Vision
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              A community where sexual violence is eliminated, survivors are empowered, and justice prevails for all.
            </p>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16 reveal">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Our Core Values
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="p-6 text-center hover:shadow-xl transition-all reveal border-2"
                role="listitem"
                style={{
                  animationDelay: `${index * 100}ms`,
                  borderColor: `var(--${value.color})`,
                  background: `linear-gradient(135deg, var(--${value.color})/5, var(--${value.color})/10)`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `var(--${value.color})/20` }}
                  aria-hidden="true"
                >
                  <value.icon className="w-8 h-8" style={{ color: `var(--${value.color})` }} />
                </div>
                <h4 className="font-serif text-lg font-bold text-foreground mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="reveal">
          <div
            className="bg-gradient-to-br from-accent-coral via-accent-purple to-primary rounded-2xl p-8 lg:p-12 shadow-2xl"
            role="region"
            aria-label="Impact statistics"
          >
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-center text-white mb-12">
              Our Impact at a Glance
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center reveal" style={{ animationDelay: `${index * 100}ms` }}>
                  <div
                    className="font-serif text-4xl md:text-5xl font-bold text-white mb-2"
                    aria-label={`${stat.number} ${stat.label}`}
                  >
                    {stat.number}
                  </div>
                  <div className="font-accent text-lg font-semibold text-white/95 mb-1">{stat.label}</div>
                  <div className="text-sm text-white/80">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
