"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { Volunteer } from "@/lib/types/database"
import { format } from "date-fns"
import { Download, Mail, Search } from "lucide-react"
import { VolunteerForm } from "@/components/forms/volunteer-form"

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([])
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [isVolunteerFormOpen, setIsVolunteerFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  
  const [filters, setFilters] = useState({
    status: "all",
    availability: "all",
    search: ""
  })

  const supabase = createClient()

  useEffect(() => {
    fetchVolunteers()
  }, [])

  useEffect(() => {
    filterVolunteers()
  }, [volunteers, filters])

  const fetchVolunteers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setVolunteers(data)
    }
    setIsLoading(false)
  }

  const filterVolunteers = () => {
    let filtered = volunteers

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(volunteer => volunteer.status === filters.status)
    }

    if (filters.availability && filters.availability !== "all") {
      filtered = filtered.filter(volunteer => volunteer.availability === filters.availability)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(volunteer =>
        volunteer.name.toLowerCase().includes(searchLower) ||
        volunteer.email.toLowerCase().includes(searchLower) ||
        volunteer.interests?.toLowerCase().includes(searchLower) ||
        volunteer.experience?.toLowerCase().includes(searchLower)
      )
    }

    setFilteredVolunteers(filtered)
  }

  const handleStatusUpdate = async (id: string, status: "pending" | "approved" | "rejected") => {
    const { error } = await supabase.from("volunteers").update({ status }).eq("id", id)

    if (!error) {
      fetchVolunteers()
      setSelectedVolunteer(null)
    }
  }

  const handleDelete = async (volunteer: Volunteer) => {
    if (confirm(`Are you sure you want to delete ${volunteer.name}'s application?`)) {
      const { error } = await supabase.from("volunteers").delete().eq("id", volunteer.id)

      if (!error) {
        fetchVolunteers()
      }
    }
  }

  const handleBulkApprove = () => {
    if (selectedRows.length === 0) return
    if (confirm(`Approve ${selectedRows.length} selected volunteers?`)) {
      selectedRows.forEach(id => handleStatusUpdate(id, "approved"))
      setSelectedRows([])
    }
  }

  const handleBulkReject = () => {
    if (selectedRows.length === 0) return
    if (confirm(`Reject ${selectedRows.length} selected volunteers?`)) {
      selectedRows.forEach(id => handleStatusUpdate(id, "rejected"))
      setSelectedRows([])
    }
  }

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return
    if (confirm(`Delete ${selectedRows.length} selected volunteers?`)) {
      selectedRows.forEach(id => {
        supabase.from("volunteers").delete().eq("id", id)
      })
      fetchVolunteers()
      setSelectedRows([])
    }
  }

  const exportToCSV = () => {
    const dataToExport = filteredVolunteers.length > 0 ? filteredVolunteers : volunteers
    
    const headers = ["Name", "Email", "Phone", "Interests", "Availability", "Experience", "Status", "Applied Date"]
    const csvData = dataToExport.map(volunteer => [
      `"${volunteer.name}"`,
      `"${volunteer.email}"`,
      `"${volunteer.phone || "N/A"}"`,
      `"${volunteer.interests || "N/A"}"`,
      `"${volunteer.availability || "N/A"}"`,
      `"${volunteer.experience || "N/A"}"`,
      `"${volunteer.status}"`,
      `"${format(new Date(volunteer.created_at), "yyyy-MM-dd")}"`
    ])
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `volunteers-${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const sendEmailToVolunteer = async (volunteer: Volunteer) => {
    const mailtoLink = `mailto:${volunteer.email}?subject=KSSV Volunteer Application Update&body=Dear ${volunteer.name},%0D%0A%0D%0AThank you for your interest in volunteering with KSSV...`
    window.open(mailtoLink, '_blank')
  }

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter(v => v.status === "pending").length,
    approved: volunteers.filter(v => v.status === "approved").length,
    rejected: volunteers.filter(v => v.status === "rejected").length,
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "interests", label: "Interests" },
    { key: "availability", label: "Availability" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "approved" ? "default" : value === "rejected" ? "destructive" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Applied",
      render: (value: string) => format(new Date(value), "MMM d, yyyy"),
    },
  ]

  return (
    <>
      <AdminHeader title="Volunteers" description="Manage volunteer applications and approvals" />

      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search volunteers..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full lg:w-64"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.availability} onValueChange={(value) => setFilters({ ...filters, availability: value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Availability</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={() => setIsVolunteerFormOpen(true)} className="flex items-center gap-2">
                  Add Volunteer
                </Button>
                <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    {selectedRows.length} volunteer{selectedRows.length > 1 ? 's' : ''} selected
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleBulkApprove}>
                      Approve Selected
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleBulkReject}>
                      Reject Selected
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading volunteers...</p>
        ) : (
          <DataTable
            data={filteredVolunteers.length > 0 ? filteredVolunteers : volunteers}
            columns={columns}
            onView={setSelectedVolunteer}
            onApprove={(row) => handleStatusUpdate(row.id, "approved")}
            onReject={(row) => handleStatusUpdate(row.id, "rejected")}
            onDelete={handleDelete}
            onEmail={sendEmailToVolunteer}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            enableSearch={false} // Disable search in DataTable since we have it above
            enableFilters={false} // Disable filters in DataTable since we have them above
            enableExport={false} // Disable export in DataTable since we have it above
          />
        )}
      </div>

      <VolunteerForm 
        open={isVolunteerFormOpen}
        onOpenChange={setIsVolunteerFormOpen}
        onSuccess={fetchVolunteers}
      />

      {/* Volunteer Details Dialog */}
      <Dialog open={!!selectedVolunteer} onOpenChange={() => setSelectedVolunteer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Volunteer Application Details</DialogTitle>
            <DialogDescription>Review the complete volunteer application</DialogDescription>
          </DialogHeader>

          {selectedVolunteer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base text-foreground">{selectedVolunteer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedVolunteer.status === "approved"
                        ? "default"
                        : selectedVolunteer.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedVolunteer.status || "pending"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base text-foreground">{selectedVolunteer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base text-foreground">{selectedVolunteer.phone || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Interests</p>
                  <p className="text-base text-foreground">{selectedVolunteer.interests || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Availability</p>
                  <p className="text-base text-foreground">{selectedVolunteer.availability || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="text-base text-foreground whitespace-pre-wrap">{selectedVolunteer.experience || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applied</p>
                  <p className="text-base text-foreground">
                    {format(new Date(selectedVolunteer.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleStatusUpdate(selectedVolunteer.id, "approved")} 
                  className="flex-1" 
                  variant="default"
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate(selectedVolunteer.id, "rejected")} 
                  className="flex-1" 
                  variant="destructive"
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => sendEmailToVolunteer(selectedVolunteer)}
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