import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  const { data, error } = await supabase.from('branding').select('*').order('updated_at', { ascending: false }).limit(1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? {})
}

export async function POST(request: Request) {
  const body = await request.json()
  // Upsert branding (single row)
  const { data, error } = await supabase.from('branding').upsert(body).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
