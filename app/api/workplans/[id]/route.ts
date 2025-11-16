// app/api/workplans/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with your database
let workplans: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workplan = workplans.find(w => w.id === params.id)
    if (!workplan) {
      return NextResponse.json(
        { error: 'Workplan not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(workplan)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workplan' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const index = workplans.findIndex(w => w.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Workplan not found' },
        { status: 404 }
      )
    }

    workplans[index] = {
      ...workplans[index],
      ...data,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(workplans[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update workplan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const index = workplans.findIndex(w => w.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Workplan not found' },
        { status: 404 }
      )
    }

    workplans.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete workplan' },
      { status: 500 }
    )
  }
}