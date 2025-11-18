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
    const service_type = searchParams.get('service_type');
    const status = searchParams.get('status');

    let query = supabase
      .from('case_services')
      .select('*')
      .order('service_date', { ascending: false });

    // Apply filters if provided
    if (case_id) {
      query = query.eq('case_id', case_id);
    }

    if (service_type && service_type !== 'all') {
      query = query.eq('service_type', service_type);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in services GET:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json();

    // Validate required fields
    const requiredFields = ['case_id', 'service_type', 'service_date'];
    const missingFields = requiredFields.filter(field => !serviceData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const insertData = {
      case_id: serviceData.case_id,
      service_date: serviceData.service_date,
      service_type: serviceData.service_type,
      service_provider: serviceData.service_provider || null,
      actions_taken: serviceData.actions_taken || null,
      notes_observations: serviceData.notes_observations || null,
      next_steps: serviceData.next_steps || null,
      follow_up_date: serviceData.follow_up_date || null,
      status: serviceData.status || 'SCHEDULED',
    };

    const { data, error } = await supabase
      .from('case_services')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in services POST:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}