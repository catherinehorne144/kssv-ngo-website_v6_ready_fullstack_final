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
      .from('case_registers')
      .select('*')
      .eq('case_id', params.id)
      .single();

    if (error) {
      console.error('Error fetching case:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in case GET:', error);
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
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
    
    if (updates.case_status !== undefined) updateData.case_status = updates.case_status;
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.contact_no !== undefined) updateData.contact_no = updates.contact_no;
    if (updates.emergency_no !== undefined) updateData.emergency_no = updates.emergency_no;
    if (updates.consent_status !== undefined) updateData.consent_status = updates.consent_status;
    if (updates.date_sharing_consent !== undefined) updateData.date_sharing_consent = updates.date_sharing_consent;

    const { data, error } = await supabase
      .from('case_registers')
      .update(updateData)
      .eq('case_id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating case:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in case PUT:', error);
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('case_registers')
      .delete()
      .eq('case_id', params.id);

    if (error) {
      console.error('Error deleting case:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error in case DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete case' }, { status: 500 });
  }
}