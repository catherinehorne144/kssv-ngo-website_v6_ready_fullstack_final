"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface VolunteerFormData {
  name: string
  email: string
  phone: string
  availability: string
  interests: string
  experience: string
}

interface VolunteerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function VolunteerForm({ open, onOpenChange, onSuccess }: VolunteerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: "",
    email: "",
    phone: "",
    availability: "",
    interests: "",
    experience: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      availability: "",
      interests: "",
      experience: "",
    })
    setIsSubmitting(false)
    setError(null)
    setIsSubmitted(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm()
    onOpenChange(open)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      console.log("📤 Sending volunteer data to API...", formData)
      
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log("📥 Volunteer API Response:", result)

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to submit application')
      }

      console.log("✅ Volunteer submission successful!")
      setIsSubmitted(true)
      setTimeout(() => {
        handleOpenChange(false)
        onSuccess?.()
      }, 2000)
    } catch (err) {
      console.error("❌ Volunteer submission error:", err)
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground">Thank you for your interest in volunteering with us!</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-bold">Volunteer Application</DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                We're grateful for your interest in volunteering. Please share your information and we'll be in touch
                about opportunities that match your skills and availability.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Submission Error</span>
                </div>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="volunteer-name">Full Name *</Label>
                <Input
                  id="volunteer-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volunteer-email">Email *</Label>
                  <Input
                    id="volunteer-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volunteer-phone">Phone Number *</Label>
                  <Input
                    id="volunteer-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volunteer-availability">Availability *</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData({ ...formData, availability: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="volunteer-availability">
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="occasional">Occasional Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volunteer-interests">Areas of Interest *</Label>
                <Textarea
                  id="volunteer-interests"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="e.g., Community outreach, event support, administrative tasks, counseling support..."
                  rows={3}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="volunteer-experience">Relevant Experience (optional)</Label>
                <Textarea
                  id="volunteer-experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Share any relevant experience or skills..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 font-accent font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}