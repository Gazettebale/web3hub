import { NextResponse } from 'next/server'
import { fetchAllHackathons } from '@/lib/sources/hackathons'

export async function GET() {
  const hackathons = await fetchAllHackathons()
  return NextResponse.json({ hackathons, total: hackathons.length })
}
