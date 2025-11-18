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
      .from('case_services')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in service GET:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();

    // Prepare update data
    const updateData: any = {};
    
    if (updates.service_date !== undefined) updateData.service_date = updates.service_date;
    if (updates.service_type !== undefined) updateData.service_type = updates.service_type;
    if (updates.service_provider !== undefined) updateData.service_provider = updates.service_provider;
    if (updates.actions_taken !== undefined) updateData.actions_taken = updates.actions_taken;
    if (updates.notes_observations !== undefined) updateData.notes_observations = updates.notes_observations;
    if (updates.next_steps !== undefined) updateData.next_steps = updates.next_steps;
    if (updates.follow_up_date !== undefined) updateData.follow_up_date = updates.follow_up_date;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('case_services')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in service PUT:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('case_services')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting service:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error in service DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}