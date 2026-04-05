import { NextResponse } from 'next/server'
import { fetchAllGrants } from '@/lib/sources/grants'

export async function GET() {
  const grants = await fetchAllGrants()
  return NextResponse.json({ grants, total: grants.length })
}
