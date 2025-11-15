import type React from "react"
import type { Metadata } from "next"
import { Sidebar } from "@/components/admin/sidebar"

export const metadata: Metadata = {
  title: "KSSV Admin - Content Management System",
  description: "Admin dashboard for managing KSSV NGO website content",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}
