"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Partner } from "@/lib/types/database"
import { format } from "date-fns"
import { PartnershipForm } from "@/components/forms/partnership-form"

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isPartnershipFormOpen, setIsPartnershipFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    organization_name: "",
    contact_person: "",
    email: "",
    phone: "",
    partnership_type: "",
    description: "",
    status: "pending",
    logo_url: "",
    website: ""
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setPartners(data)
    }
    setIsLoading(false)
  }

  const handleCreate = () => {
    setFormData({
      organization_name: "",
      contact_person: "",
      email: "",
      phone: "",
      partnership_type: "",
      description: "",
      status: "pending",
      logo_url: "",
      website: ""
    })
    setIsCreating(true)
  }

  const handleEdit = (partner: Partner) => {
    setFormData({
      organization_name: partner.organization_name,
      contact_person: partner.contact_person,
      email: partner.email,
      phone: partner.phone || "",
      partnership_type: partner.partnership_type || "",
      description: partner.description || "",
      status: partner.status || "pending",
      logo_url: partner.logo_url || "",
      website: partner.website || ""
    })
    setSelectedPartner(partner)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (isCreating) {
      const { error } = await supabase.from("partners").insert([formData])

      if (!error) {
        fetchPartners()
        setIsCreating(false)
      } else {
        console.error("Error creating partner:", error)
      }
    } else if (isEditing && selectedPartner) {
      const { error } = await supabase
        .from("partners")
        .update(formData)
        .eq("id", selectedPartner.id)

      if (!error) {
        fetchPartners()
        setIsEditing(false)
        setSelectedPartner(null)
      } else {
        console.error("Error updating partner:", error)
      }
    }
  }

  const handleDelete = async (partner: Partner) => {
    if (confirm(`Are you sure you want to delete ${partner.organization_name}?`)) {
      const { error } = await supabase.from("partners").delete().eq("id", partner.id)

      if (!error) {
        fetchPartners()
      }
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await supabase
      .from("partners")
      .update({ status })
      .eq("id", id)

    if (!error) {
      fetchPartners()
      setSelectedPartner(null)
    }
  }

  const sendEmailToPartner = async (partner: Partner) => {
    const mailtoLink = `mailto:${partner.email}?subject=Partnership Update&body=Dear ${partner.contact_person},%0D%0A%0D%0AThank you for your partnership with KSSV...`
    window.open(mailtoLink, '_blank')
  }

  // Stats for DataTable
  const stats = [
    { label: "Total Partners", value: partners.length, color: "blue" },
    { label: "Pending", value: partners.filter(p => p.status === "pending").length, color: "yellow" },
    { label: "Active", value: partners.filter(p => p.status === "active").length, color: "green" },
    { label: "Inactive", value: partners.filter(p => p.status === "inactive").length, color: "red" },
  ]

  // Filters for DataTable
  const filters = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "pending", label: "Pending" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ]
    },
    {
      key: "partnership_type", 
      label: "Type",
      type: "select" as const,
      options: [
        { value: "corporate", label: "Corporate" },
        { value: "community", label: "Community" },
        { value: "strategic", label: "Strategic" },
        { value: "financial", label: "Financial" }
      ]
    }
  ]

  const columns = [
    { key: "organization_name", label: "Organization" },
    { key: "contact_person", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "partnership_type", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : value === "pending" ? "secondary" : "outline"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Added",
      render: (value: string) => format(new Date(value), "MMM d, yyyy"),
    },
  ]

  return (
    <>
      <AdminHeader title="Partners" description="Manage partnership organizations" />

      <div className="p-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading partners...</p>
        ) : (
          <DataTable
            data={partners}
            columns={columns}
            onView={setSelectedPartner}
            onApprove={(row) => handleStatusUpdate(row.id, "active")}
            onReject={(row) => handleStatusUpdate(row.id, "inactive")}
            onDelete={handleDelete}
            onEmail={sendEmailToPartner}
            searchPlaceholder="Search partners..."
            
            // DataTable features
            enableSearch={true}
            enableFilters={true}
            enableExport={true}
            enableStats={true}
            filters={filters}
            stats={stats}
            exportFilename="partners"
            onCreate={() => setIsPartnershipFormOpen(true)}
            createButtonLabel="Add Partner"
          />
        )}
      </div>

      <PartnershipForm 
        open={isPartnershipFormOpen}
        onOpenChange={setIsPartnershipFormOpen}
        onSuccess={fetchPartners}
      />

      {/* View Dialog */}
      <Dialog open={!!selectedPartner && !isEditing} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{selectedPartner?.organization_name}</DialogTitle>
            <DialogDescription>Partnership details</DialogDescription>
          </DialogHeader>

          {selectedPartner && (
            <div className="space-y-6">
              {selectedPartner.logo_url && (
                <img
                  src={selectedPartner.logo_url || "/placeholder.svg"}
                  alt={selectedPartner.organization_name}
                  className="w-32 h-32 object-contain"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                  <p className="text-base text-foreground">{selectedPartner.contact_person}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedPartner.status === "active"
                        ? "default"
                        : selectedPartner.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {selectedPartner.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base text-foreground">{selectedPartner.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base text-foreground">{selectedPartner.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <p className="text-base text-foreground">{selectedPartner.website || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Partnership Type</p>
                  <p className="text-base text-foreground">{selectedPartner.partnership_type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Added</p>
                  <p className="text-base text-foreground">
                    {format(new Date(selectedPartner.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              {selectedPartner.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-base text-foreground">{selectedPartner.description}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleStatusUpdate(selectedPartner.id, "active")} 
                  className="flex-1" 
                  variant="default"
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate(selectedPartner.id, "inactive")} 
                  className="flex-1" 
                  variant="destructive"
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => sendEmailToPartner(selectedPartner)}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button onClick={() => handleEdit(selectedPartner)} variant="outline" className="flex-1">
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={() => {
        setIsCreating(false)
        setIsEditing(false)
        setSelectedPartner(null)
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {isCreating ? "Add New Partner" : "Edit Partner"}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? "Add a new partnership organization" : "Update partner information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name *</Label>
              <Input
                id="org-name"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                placeholder="Organization name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-person">Contact Person *</Label>
              <Input
                id="contact-person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Full name"
                required
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-phone">Phone Number</Label>
                <Input
                  id="partner-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 700 000 000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner-website">Website</Label>
              <Input
                id="partner-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://organization.org"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner-description">Description</Label>
              <Textarea
                id="partner-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the organization and partnership..."
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {isCreating ? "Add Partner" : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setIsEditing(false)
                  setSelectedPartner(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}