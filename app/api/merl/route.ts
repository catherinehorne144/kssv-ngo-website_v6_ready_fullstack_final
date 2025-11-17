import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workplan_id = searchParams.get('workplan_id');

    let query = supabase
      .from('merl_entries')
      .select('*');

    if (workplan_id) {
      query = query.eq('workplan_id', workplan_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch MERL entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const merlData = await request.json();

    const { data, error } = await supabase
      .from('merl_entries')
      .insert([merlData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create MERL entry' }, { status: 500 });
  }
}