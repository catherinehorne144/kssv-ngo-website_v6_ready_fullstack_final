"use client"
// ADD AT TOP with other imports
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { createServerClientInstance } from "@/lib/supabase/server"
import { format } from "date-fns"

interface Testimonial {
  id: string
  name: string
  role: string
  email: string
  message: string
  image_url: string
  approved: boolean
  company_organization: string
  location: string
  rating: number
  category: string
  featured: boolean
  created_at: string
  updated_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setTestimonials(data)
    }
    setIsLoading(false)
  }

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("testimonials").update({ approved: true }).eq("id", id)

    if (!error) {
      fetchTestimonials()
      setSelectedTestimonial(null)
    }
  }

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id)

    if (!error) {
      fetchTestimonials()
      setSelectedTestimonial(null)
    }
  }

  const handleDelete = async (testimonial: Testimonial) => {
    if (confirm(`Are you sure you want to delete this testimonial from ${testimonial.name}?`)) {
      const { error } = await supabase.from("testimonials").delete().eq("id", testimonial.id)

      if (!error) {
        fetchTestimonials()
      }
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    {
      key: "message",
      label: "Message",
      render: (value: string) => (value.length > 60 ? `${value.substring(0, 60)}...` : value),
    },
    {
      key: "approved",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>{value ? "Approved" : "Pending"}</Badge>
      ),
    },
    {
      key: "created_at",
      label: "Submitted",
      render: (value: string) => format(new Date(value), "MMM d, yyyy"),
    },
  ]

  return (
    <>
      <AdminHeader title="Testimonials" description="Manage testimonials and success stories" />

      <div className="p-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading testimonials...</p>
        ) : (
          <DataTable
            data={testimonials}
            columns={columns}
            onView={setSelectedTestimonial}
            onApprove={(row) => handleApprove(row.id)}
            onReject={(row) => handleReject(row.id)}
            onDelete={handleDelete}
            searchPlaceholder="Search testimonials..."
          />
        )}
      </div>

      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Testimonial Details</DialogTitle>
            <DialogDescription>Review and manage testimonial submission</DialogDescription>
          </DialogHeader>

          {selectedTestimonial && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base text-foreground">{selectedTestimonial.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-base text-foreground">{selectedTestimonial.role || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedTestimonial.approved ? "default" : "secondary"}>
                    {selectedTestimonial.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-base text-foreground">
                    {format(new Date(selectedTestimonial.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Testimonial</p>
                <p className="text-base text-foreground whitespace-pre-wrap">{selectedTestimonial.message}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleApprove(selectedTestimonial.id)}
                  className="flex-1"
                  disabled={selectedTestimonial.approved}
                >
                  Approve
                </Button>
                <Button onClick={() => handleReject(selectedTestimonial.id)} variant="destructive" className="flex-1">
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}