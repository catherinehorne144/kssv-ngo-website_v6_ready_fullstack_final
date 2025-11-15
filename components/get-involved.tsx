"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Handshake, AlertCircle } from "lucide-react"
import { useScrollReveal } from "@/lib/scroll-reveal"
import { MembershipForm } from "@/components/forms/membership-form"
import { VolunteerForm } from "@/components/forms/volunteer-form"
import { PartnershipForm } from "@/components/forms/partnership-form"

export function GetInvolved() {
  useScrollReveal()
  const [isMembershipFormOpen, setIsMembershipFormOpen] = useState(false)
  const [isVolunteerFormOpen, setIsVolunteerFormOpen] = useState(false)
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ways = [
    {
      icon: Heart,
      title: "Volunteer",
      description: "Share your time and skills to support survivors and strengthen our programs",
      action: () => setIsVolunteerFormOpen(true),
      buttonText: "Apply to Volunteer",
    },
    {
      icon: Users,
      title: "Become a Member",
      description: "Join our community of advocates committed to ending sexual violence",
      action: () => setIsMembershipFormOpen(true),
      buttonText: "Join as Member",
    },
    {
      icon: Handshake,
      title: "Partner With Us",
      description: "Collaborate with us to expand our reach and amplify our impact",
      action: () => setIsPartnerFormOpen(true),
      buttonText: "Explore Partnership",
    },
  ]

  return (
    <>
      <section id="get-involved" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 reveal">
            <span className="text-primary font-accent text-sm font-semibold tracking-wider uppercase">
              Get Involved
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              Join Us in Creating Change
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              There are many ways to support our mission. Whether you volunteer your time, become a member, or partner
              with us, your involvement makes a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {ways.map((way, index) => (
              <Card
                key={way.title}
                className="p-8 text-center hover:shadow-xl transition-all reveal"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <way.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">{way.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{way.description}</p>
                <Button onClick={way.action} className="w-full font-accent font-semibold">
                  {way.buttonText}
                </Button>
              </Card>
            ))}
          </div>

          <div className="reveal">
            <Card className="p-8 lg:p-12 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 text-center">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">Every Action Counts</h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
                Whether you have an hour a week or want to make a long-term commitment, there's a place for you in our
                community. Together, we can break the silence and end the violence.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {error && (
        <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Submission Error</span>
          </div>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 h-8 text-destructive-foreground hover:bg-destructive/80"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      <MembershipForm 
        open={isMembershipFormOpen} 
        onOpenChange={setIsMembershipFormOpen}
      />

      <VolunteerForm 
        open={isVolunteerFormOpen} 
        onOpenChange={setIsVolunteerFormOpen}
      />

      <PartnershipForm 
        open={isPartnerFormOpen} 
        onOpenChange={setIsPartnerFormOpen}
      />
    </>
  )
}