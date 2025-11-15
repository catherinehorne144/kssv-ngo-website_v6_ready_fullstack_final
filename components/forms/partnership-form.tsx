"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface PartnershipFormData {
  organizationName: string
  contactPerson: string
  email: string
  phone: string
  partnershipType: string
  description: string
}

interface PartnershipFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PartnershipForm({ open, onOpenChange, onSuccess }: PartnershipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<PartnershipFormData>({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnershipType: "",
    description: "",
  })

  const resetForm = () => {
    setFormData({
      organizationName: "",
      contactPerson: "",
      email: "",
      phone: "",
      partnershipType: "",
      description: "",
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
      console.log("📤 Sending partnership data to API...", formData)
      
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log("📥 Partnership API Response:", result)

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to submit partnership inquiry')
      }

      console.log("✅ Partnership submission successful!")
      setIsSubmitted(true)
      setTimeout(() => {
        handleOpenChange(false)
        onSuccess?.()
      }, 2000)
    } catch (err) {
      console.error("❌ Partnership submission error:", err)
      setError(err instanceof Error ? err.message : 'Failed to submit inquiry')
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
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Inquiry Submitted!</h3>
            <p className="text-muted-foreground">We'll review your partnership proposal and be in touch soon.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-bold">Partnership Inquiry</DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                We welcome partnerships with organizations that share our commitment to supporting survivors and
                ending sexual violence. Tell us about your organization and partnership interests.
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
                <Label htmlFor="partner-org">Organization Name *</Label>
                <Input
                  id="partner-org"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="Your organization name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-contact">Contact Person *</Label>
                <Input
                  id="partner-contact"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Full name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner-email">Email *</Label>
                  <Input
                    id="partner-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@organization.org"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner-phone">Phone Number *</Label>
                  <Input
                    id="partner-phone"
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
                <Label htmlFor="partner-type">Partnership Type *</Label>
                <Select
                  value={formData.partnershipType}
                  onValueChange={(value) => setFormData({ ...formData, partnershipType: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="partner-type">
                    <SelectValue placeholder="Select partnership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funding">Funding/Grants</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="program">Program Collaboration</SelectItem>
                    <SelectItem value="advocacy">Advocacy Partnership</SelectItem>
                    <SelectItem value="research">Research Collaboration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-description">Partnership Proposal *</Label>
                <Textarea
                  id="partner-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your organization and the partnership you're proposing..."
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 font-accent font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
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