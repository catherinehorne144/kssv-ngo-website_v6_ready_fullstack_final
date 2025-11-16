"use client"
// ADD AT TOP with other imports
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { createServerClientInstance } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
      <LogOut size={16} />
      Logout
    </Button>
  )
}
