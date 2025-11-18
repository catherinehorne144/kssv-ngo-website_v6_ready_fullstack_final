import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const case_id = searchParams.get('case_id');
    const risk_level = searchParams.get('risk_level');

    let query = supabase
      .from('case_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (case_id) {
      query = query.eq('case_id', case_id);
    }

    if (risk_level && risk_level !== 'all') {
      query = query.eq('safety_risk_level', risk_level);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching assessments:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in assessments GET:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const assessmentData = await request.json();

    // Validate required fields
    const requiredFields = ['case_id', 'safety_risk_level'];
    const missingFields = requiredFields.filter(field => !assessmentData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const insertData = {
      case_id: assessmentData.case_id,
      date_of_intake: assessmentData.date_of_intake || null,
      service_needs: assessmentData.service_needs || [],
      safety_risk_level: assessmentData.safety_risk_level,
      primary_goal: assessmentData.primary_goal || null,
      services_provided_log: assessmentData.services_provided_log || null,
      referral_tracking: assessmentData.referral_tracking || null,
      case_notes: assessmentData.case_notes || null,
      case_closure: assessmentData.case_closure || false,
      reason_for_closure: assessmentData.reason_for_closure || null,
    };

    const { data, error } = await supabase
      .from('case_assessments')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in assessments POST:', error);
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}