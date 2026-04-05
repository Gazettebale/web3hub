import { NextResponse } from 'next/server'
import { fetchAllBounties } from '@/lib/sources/immunefi'

export async function GET() {
  const bounties = await fetchAllBounties()
  return NextResponse.json({ bounties, total: bounties.length })
}
