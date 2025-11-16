import { redirect } from "next/navigation"
import { createServerClientInstance } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClientInstance()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login")
  }

  // ✅ No Sidebar here — parent layout already has it
  return <>{children}</>
}
