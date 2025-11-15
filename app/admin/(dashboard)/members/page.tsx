"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Member } from "@/lib/types/database"
import { format } from "date-fns"
import { MembershipForm } from "@/components/forms/membership-form"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isMembershipFormOpen, setIsMembershipFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setMembers(data)
    }
    setIsLoading(false)
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await supabase.from("members").update({ status }).eq("id", id)

    if (!error) {
      fetchMembers()
      setSelectedMember(null)
    }
  }

  const handleDelete = async (member: Member) => {
    if (confirm(`Are you sure you want to delete ${member.name}'s membership?`)) {
      const { error } = await supabase.from("members").delete().eq("id", member.id)

      if (!error) {
        fetchMembers()
      }
    }
  }

  const sendEmailToMember = async (member: Member) => {
    const mailtoLink = `mailto:${member.email}?subject=Membership Update&body=Dear ${member.name},%0D%0A%0D%0AThank you for being a member of KSSV...`
    window.open(mailtoLink, '_blank')
  }

  // Stats for DataTable
  const stats = [
    { label: "Total Members", value: members.length, color: "blue" },
    { label: "Active", value: members.filter(m => m.status === "active").length, color: "green" },
    { label: "Inactive", value: members.filter(m => m.status === "inactive").length, color: "red" },
    { label: "Pending", value: members.filter(m => m.status === "pending").length, color: "yellow" },
  ]

  // Filters for DataTable
  const filters = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" }
      ]
    },
    {
      key: "location", 
      label: "Location",
      type: "select" as const,
      options: [
        { value: "local", label: "Local" },
        { value: "national", label: "National" },
        { value: "international", label: "International" }
      ]
    }
  ]

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : value === "inactive" ? "secondary" : "outline"}>{value}</Badge>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (value: string) => format(new Date(value), "MMM d, yyyy"),
    },
  ]

  return (
    <>
      <AdminHeader title="Members" description="Manage organization members and memberships" />

      <div className="p-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading members...</p>
        ) : (
          <DataTable
            data={members}
            columns={columns}
            onView={setSelectedMember}
            onApprove={(row) => handleStatusUpdate(row.id, "active")}
            onReject={(row) => handleStatusUpdate(row.id, "inactive")}
            onDelete={handleDelete}
            onEmail={sendEmailToMember}
            searchPlaceholder="Search members..."
            
            // DataTable features
            enableSearch={true}
            enableFilters={true}
            enableExport={true}
            enableStats={true}
            filters={filters}
            stats={stats}
            exportFilename="members"
            onCreate={() => setIsMembershipFormOpen(true)}
            createButtonLabel="Add Member"
          />
        )}
      </div>

      <MembershipForm 
        open={isMembershipFormOpen}
        onOpenChange={setIsMembershipFormOpen}
        onSuccess={fetchMembers}
      />

      {/* View Member Details Dialog - KEEP ALL THIS CONTENT */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Member Details</DialogTitle>
            <DialogDescription>View complete membership information</DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base text-foreground">{selectedMember.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedMember.status === "active"
                        ? "default"
                        : selectedMember.status === "inactive"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {selectedMember.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base text-foreground">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base text-foreground">{selectedMember.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base text-foreground">{selectedMember.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-base text-foreground">
                    {format(new Date(selectedMember.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              {selectedMember.skills && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Skills & Expertise</p>
                  <p className="text-base text-foreground">{selectedMember.skills}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Motivation</p>
                <p className="text-base text-foreground">{selectedMember.motivation}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleStatusUpdate(selectedMember.id, "active")} 
                  className="flex-1" 
                  variant="default"
                >
                  Activate
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate(selectedMember.id, "inactive")} 
                  className="flex-1" 
                  variant="destructive"
                >
                  Deactivate
                </Button>
                <Button 
                  onClick={() => sendEmailToMember(selectedMember)}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}