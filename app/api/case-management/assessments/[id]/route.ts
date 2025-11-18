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
      .from('case_assessments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching assessment:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in assessment GET:', error);
    return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 });
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
    
    if (updates.date_of_intake !== undefined) updateData.date_of_intake = updates.date_of_intake;
    if (updates.service_needs !== undefined) updateData.service_needs = updates.service_needs;
    if (updates.safety_risk_level !== undefined) updateData.safety_risk_level = updates.safety_risk_level;
    if (updates.primary_goal !== undefined) updateData.primary_goal = updates.primary_goal;
    if (updates.services_provided_log !== undefined) updateData.services_provided_log = updates.services_provided_log;
    if (updates.referral_tracking !== undefined) updateData.referral_tracking = updates.referral_tracking;
    if (updates.case_notes !== undefined) updateData.case_notes = updates.case_notes;
    if (updates.case_closure !== undefined) updateData.case_closure = updates.case_closure;
    if (updates.reason_for_closure !== undefined) updateData.reason_for_closure = updates.reason_for_closure;

    const { data, error } = await supabase
      .from('case_assessments')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating assessment:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in assessment PUT:', error);
    return NextResponse.json({ error: 'Failed to update assessment' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('case_assessments')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting assessment:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error in assessment DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete assessment' }, { status: 500 });
  }
}