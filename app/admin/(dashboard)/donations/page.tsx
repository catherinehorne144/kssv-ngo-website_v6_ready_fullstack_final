"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import type { Donation } from "@/lib/types/database"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("donations").select("*").order("date", { ascending: false })

    if (!error && data) {
      setDonations(data)

      const total = data.reduce((sum, d) => sum + d.amount, 0)
      setStats({ total, count: data.length })
    }
    setIsLoading(false)
  }

  const handleDelete = async (donation: Donation) => {
    if (confirm("Are you sure you want to delete this donation record?")) {
      const { error } = await supabase.from("donations").delete().eq("id", donation.id)

      if (!error) {
        fetchDonations()
      }
    }
  }

  const columns = [
    {
      key: "donor_name",
      label: "Donor",
      render: (value: string) => value || "Anonymous",
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number) => `KES ${value.toLocaleString()}`,
    },
    { key: "method", label: "Method" },
    {
      key: "date",
      label: "Date",
      render: (value: string) => format(new Date(value), "MMM d, yyyy"),
    },
  ]

  return (
    <>
      <AdminHeader title="Donations" description="Track and manage donation records" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground font-medium">Total Raised</p>
            <p className="text-3xl font-bold text-foreground mt-2">KES {stats.total.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground font-medium">Total Donations</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.count}</p>
          </Card>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading donations...</p>
        ) : (
          <DataTable
            data={donations}
            columns={columns}
            onView={setSelectedDonation}
            onDelete={handleDelete}
            searchPlaceholder="Search donations..."
          />
        )}
      </div>

      <Dialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Donation Details</DialogTitle>
            <DialogDescription>View complete donation information</DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Donor Name</p>
                  <p className="text-base text-foreground">{selectedDonation.donor_name || "Anonymous"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-base text-foreground font-semibold">
                    KES {selectedDonation.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="text-base text-foreground capitalize">{selectedDonation.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-base text-foreground">
                    {format(new Date(selectedDonation.date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                {selectedDonation.message && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Message</p>
                    <p className="text-base text-foreground">{selectedDonation.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
