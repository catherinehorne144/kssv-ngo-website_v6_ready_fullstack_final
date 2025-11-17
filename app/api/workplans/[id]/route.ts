import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('workplans')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching workplan:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Workplan not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in workplan GET:', error);
    return NextResponse.json({ error: 'Failed to fetch workplan' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();

    // Validate required fields if they are being updated
    const requiredFields = ['focus_area', 'activity_name', 'timeline_text', 'tasks_description'];
    const missingFields = requiredFields.filter(field => updates[field] === '');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Required fields cannot be empty: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare update data (only include fields that exist in our schema)
    const updateData: any = {};
    
    if (updates.focus_area !== undefined) updateData.focus_area = updates.focus_area;
    if (updates.activity_name !== undefined) updateData.activity_name = updates.activity_name;
    if (updates.timeline_text !== undefined) updateData.timeline_text = updates.timeline_text;
    if (updates.quarter !== undefined) updateData.quarter = updates.quarter;
    if (updates.tasks_description !== undefined) updateData.tasks_description = updates.tasks_description;
    if (updates.target !== undefined) updateData.target = updates.target;
    if (updates.budget_allocated !== undefined) updateData.budget_allocated = updates.budget_allocated;
    if (updates.resource_person !== undefined) updateData.resource_person = updates.resource_person;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.progress !== undefined) updateData.progress = updates.progress;
    if (updates.public_visible !== undefined) updateData.public_visible = updates.public_visible;

    const { data, error } = await supabase
      .from('workplans')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating workplan:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Workplan not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in workplan PUT:', error);
    return NextResponse.json({ error: 'Failed to update workplan' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('workplans')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting workplan:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Workplan deleted successfully' });
  } catch (error) {
    console.error('Error in workplan DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete workplan' }, { status: 500 });
  }
}