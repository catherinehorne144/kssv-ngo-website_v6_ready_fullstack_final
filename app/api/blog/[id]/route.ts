import { createServerClientInstance } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClientInstance()

  await supabase.rpc("increment_views", {
    table_name: "blog",
    row_id: params.id,
  })

  const { data, error } = await supabase.from("blog").select("*").eq("id", params.id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClientInstance()
  const body = await req.json()

  const { data, error } = await supabase
    .from("blog")
    .update(body)
    .eq("id", params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClientInstance()
  const { error } = await supabase.from("blog").delete().eq("id", params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
