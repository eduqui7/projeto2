import { getStatus } from '@/app/api/metro/getLinesStatus'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const status = await getStatus()
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metro status' },
      { status: 500 }
    )
  }
}
