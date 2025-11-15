import { NextResponse } from 'next/server'
import fetch from 'node-fetch'
// This route uses service role key on server to create a user in Supabase Auth
export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body
  if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resp = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRole!,
      'Authorization': `Bearer ${serviceRole!}`
    },
    body: JSON.stringify({ email, password, email_confirm: true })
  })
  if (!resp.ok) {
    const txt = await resp.text()
    return NextResponse.json({ error: txt }, { status: 500 })
  }
  const data = await resp.json()
  return NextResponse.json(data, { status: 201 })
}
