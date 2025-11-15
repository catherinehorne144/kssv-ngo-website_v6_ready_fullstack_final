import { createClient } from "./server"

export async function getCurrentAdminUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  return adminUser
}

export async function isSuperAdmin() {
  const adminUser = await getCurrentAdminUser()
  return adminUser?.role === "super_admin"
}

export async function isAdmin() {
  const adminUser = await getCurrentAdminUser()
  return adminUser?.role === "super_admin" || adminUser?.role === "admin"
}
