import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const focus_area = searchParams.get('focus_area');
    const status = searchParams.get('status');
    const quarter = searchParams.get('quarter');

    let query = supabase
      .from('workplans')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (focus_area && focus_area !== 'all') {
      query = query.eq('focus_area', focus_area);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (quarter && quarter !== 'all') {
      query = query.eq('quarter', quarter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching workplans:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in workplans GET:', error);
    return NextResponse.json({ error: 'Failed to fetch workplans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const workplanData = await request.json();

    // Validate required fields
    const requiredFields = ['focus_area', 'activity_name', 'timeline_text', 'tasks_description'];
    const missingFields = requiredFields.filter(field => !workplanData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare data for insertion (only include fields that exist in our schema)
    const insertData = {
      focus_area: workplanData.focus_area,
      activity_name: workplanData.activity_name,
      timeline_text: workplanData.timeline_text,
      quarter: workplanData.quarter || null,
      tasks_description: workplanData.tasks_description,
      target: workplanData.target || null,
      budget_allocated: workplanData.budget_allocated || 0,
      resource_person: workplanData.resource_person || null,
      status: workplanData.status || 'planned',
      progress: workplanData.progress || 0,
      public_visible: workplanData.public_visible !== undefined ? workplanData.public_visible : true,
    };

    const { data, error } = await supabase
      .from('workplans')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating workplan:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in workplans POST:', error);
    return NextResponse.json({ error: 'Failed to create workplan' }, { status: 500 });
  }
}