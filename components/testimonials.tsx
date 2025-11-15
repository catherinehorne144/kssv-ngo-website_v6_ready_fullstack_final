"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Quote, ChevronLeft, ChevronRight, MessageSquarePlus, Star, X } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  message: string
  image_url?: string
  rating?: number
  company_organization?: string
  location?: string
  approved: boolean
  featured?: boolean
  created_at?: string
}

export default function Testimonials() {
  const supabase = createClient()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    message: "",
    rating: "",
    company_organization: "",
    location: "",
  })

  // Fetch approved testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("approved", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching testimonials:", error)
      } else {
        setTestimonials(data || [])
      }
      setIsLoading(false)
    }

    fetchTestimonials()
  }, [supabase])

  // Carousel navigation
  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }
  }

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }

  useEffect(() => {
    if (testimonials.length === 0) return
    const interval = setInterval(nextTestimonial, 8000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Submit new testimonial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from("testimonials").insert([
        {
          name: formData.name || "Anonymous",
          role: formData.role,
          email: formData.email || null,
          message: formData.message,
          rating: formData.rating ? Number(formData.rating) : null,
          company_organization: formData.company_organization || null,
          location: formData.location || null,
          approved: false,
        },
      ])

      if (error) throw error

      alert("✅ Thank you for sharing your story! It's been submitted for review.")
      setFormData({
        name: "",
        role: "",
        email: "",
        message: "",
        rating: "",
        company_organization: "",
        location: "",
      })
      setIsFormOpen(false)
    } catch (err) {
      console.error("Error submitting testimonial:", err)
      alert("⚠️ There was an error submitting your story. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="testimonials" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary font-accent text-sm font-semibold uppercase">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Stories of Hope & Resilience
            </h2>
            <p className="text-lg text-muted-foreground">
              {testimonials.length === 0 
                ? "Be the first to share your story." 
                : "Hear from those whose lives have been touched by our work."}
            </p>
          </div>

          {testimonials.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 lg:p-12 relative">
                <Quote className="w-16 h-16 text-primary/20 absolute top-8 left-8" />

                <div className="relative z-10 min-h-[200px] flex flex-col justify-center">
                  <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 text-center font-serif italic">
                    "{testimonials[currentIndex]?.message}"
                  </blockquote>

                  <div className="text-center">
                    <p className="font-accent font-semibold text-lg text-foreground">
                      {testimonials[currentIndex]?.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentIndex]?.role}
                      {testimonials[currentIndex]?.company_organization && ` • ${testimonials[currentIndex].company_organization}`}
                      {testimonials[currentIndex]?.location && ` • ${testimonials[currentIndex].location}`}
                    </p>

                    {testimonials[currentIndex]?.rating && (
                      <div className="flex justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < (testimonials[currentIndex]?.rating || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                {testimonials.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button variant="outline" size="icon" onClick={prevTestimonial}>
                      <ChevronLeft size={20} />
                    </Button>
                    <div className="flex gap-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <Button variant="outline" size="icon" onClick={nextTestimonial}>
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </Card>

              <div className="text-center mt-8">
                <Button
                  onClick={() => setIsFormOpen(true)}
                  variant="outline"
                  size="lg"
                  className="font-accent font-semibold"
                >
                  <MessageSquarePlus className="mr-2" size={20} />
                  Share Your Story
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  Your story can inspire others. All submissions are reviewed before publishing.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">No testimonials yet. Be the first to share your story!</p>
              <Button
                onClick={() => setIsFormOpen(true)}
                variant="outline"
                size="lg"
                className="font-accent font-semibold"
              >
                <MessageSquarePlus className="mr-2" size={20} />
                Share Your Story
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Modal for form submission */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-2xl font-bold">Share Your Story</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsFormOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              <p className="text-muted-foreground mb-6">
                Submissions are reviewed before publishing. You may remain anonymous if you wish.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (or "Anonymous")</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name or Anonymous"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Beneficiary, Volunteer, Partner"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_organization">Organization (optional)</Label>
                  <Input
                    id="company_organization"
                    value={formData.company_organization}
                    onChange={(e) => setFormData({ ...formData, company_organization: e.target.value })}
                    placeholder="Company or Organization"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1–5, optional)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="e.g., 5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Story</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share your experience..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 font-accent font-semibold">
                    Submit Story
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}