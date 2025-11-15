import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminUser } = await supabase.from("admin_users").select("role").eq("id", user.id).single()

    if (adminUser?.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can create new admin users" }, { status: 403 })
    }

    const { email, password, fullName, role = "admin" } = await request.json()

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 })
    }

    // Validate role
    if (!["admin", "editor", "super_admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const { error: profileError } = await supabaseAdmin.from("admin_users").insert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: role,
      is_active: true,
    })

    if (profileError) {
      console.error("Profile error:", profileError)
      return NextResponse.json(
        {
          error: "User created but profile setup failed. Please run the SQL script manually.",
          userId: authData.user.id,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `${role === "super_admin" ? "Super Admin" : role === "editor" ? "Editor" : "Admin"} user created successfully!`,
      userId: authData.user.id,
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
