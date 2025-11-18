import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabase
      .from('case_registers')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (status && status !== 'all') {
      query = query.eq('case_status', status);
    }

    if (search) {
      query = query.or(`case_id.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching cases:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in cases GET:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const caseData = await request.json();

    // Validate required fields
    const requiredFields = ['case_id', 'name', 'case_status'];
    const missingFields = requiredFields.filter(field => !caseData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const insertData = {
      case_id: caseData.case_id,
      case_status: caseData.case_status,
      name: caseData.name,
      contact_no: caseData.contact_no || null,
      emergency_no: caseData.emergency_no || null,
      consent_status: caseData.consent_status || false,
      date_sharing_consent: caseData.date_sharing_consent || null,
    };

    const { data, error } = await supabase
      .from('case_registers')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating case:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in cases POST:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}