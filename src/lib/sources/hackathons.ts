import { Hackathon } from '../types'

function getHackathonStatus(startDate?: string, endDate?: string): 'live' | 'upcoming' | 'ended' {
  const now = new Date()
  if (!startDate) return 'upcoming'
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)
  if (now >= start && now <= end) return 'live'
  if (now < start) return 'upcoming'
  return 'ended'
}

async function fetchETHGlobalHackathons(): Promise<Hackathon[]> {
  try {
    const res = await fetch('https://ethglobal.com/events', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!res.ok) return []
    const html = await res.text()

    // Try __NEXT_DATA__
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (match) {
      const nextData = JSON.parse(match[1]) as {
        props?: {
          pageProps?: {
            events?: Record<string, unknown>[]
            hackathons?: Record<string, unknown>[]
          }
        }
      }
      const events = nextData?.props?.pageProps?.events ||
        nextData?.props?.pageProps?.hackathons || []
      if (Array.isArray(events) && events.length > 0) {
        return (events as Record<string, unknown>[]).slice(0, 10).map((e) => ({
          id: `eth-${e.id || e.slug}`,
          title: (e.title || e.name) as string,
          organizer: 'ETHGlobal',
          url: `https://ethglobal.com/events/${e.slug || e.id}`,
          source: 'ETHGlobal',
          startDate: (e.startDate || e.start_date) as string | undefined,
          endDate: (e.endDate || e.end_date) as string | undefined,
          prize: (e.prizePool || e.prize) as string | undefined,
          status: getHackathonStatus(
            (e.startDate || e.start_date) as string | undefined,
            (e.endDate || e.end_date) as string | undefined
          ),
          tags: ['Ethereum', 'Web3', e.location ? 'IRL' : 'Online'],
          description: e.description as string | undefined,
          location: (e.location || 'Online') as string,
        } as Hackathon))
      }
    }
    return []
  } catch {
    return []
  }
}

async function fetchDoraHacksHackathons(): Promise<Hackathon[]> {
  try {
    const res = await fetch('https://dorahacks.io/hackathon', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!res.ok) return []
    const html = await res.text()

    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (match) {
      try {
        const nextData = JSON.parse(match[1]) as {
          props?: {
            pageProps?: {
              hackathons?: Record<string, unknown>[]
              data?: { hackathons?: Record<string, unknown>[] }
            }
          }
        }
        const hackathons = nextData?.props?.pageProps?.hackathons ||
          nextData?.props?.pageProps?.data?.hackathons || []
        if (Array.isArray(hackathons) && hackathons.length > 0) {
          return (hackathons as Record<string, unknown>[]).slice(0, 10).map((h) => ({
            id: `dh-${h.id || h.slug}`,
            title: (h.title || h.name) as string,
            organizer: 'DoraHacks',
            url: `https://dorahacks.io/hackathon/${h.slug || h.id}`,
            source: 'DoraHacks',
            startDate: (h.startTime || h.start_time || h.startDate) as string | undefined,
            endDate: (h.endTime || h.end_time || h.endDate) as string | undefined,
            prize: h.prizePool ? `$${Number(h.prizePool).toLocaleString()}` : undefined,
            status: getHackathonStatus(
              (h.startTime || h.start_time) as string | undefined,
              (h.endTime || h.end_time) as string | undefined
            ),
            tags: ['Web3', 'Blockchain'],
            description: h.description as string | undefined,
            location: h.mode === 'online' ? 'Online' : (h.location as string | undefined),
          } as Hackathon))
        }
      } catch {
        // ignore parse errors
      }
    }
    return []
  } catch {
    return []
  }
}

interface DevfolioHackathon {
  id: string
  slug: string
  name?: string
  title?: string
  tagline?: string
  description?: string
  starts_at?: string
  start_date?: string
  ends_at?: string
  end_date?: string
  prize_pool?: number
  is_online?: boolean
  location?: string
  team?: { name?: string }
}

// Devfolio has an unofficial API
async function fetchDevfolioHackathons(): Promise<Hackathon[]> {
  try {
    const res = await fetch('https://devfolio.co/api/hackathons?status=open', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
    })
    if (!res.ok) return []
    const data = await res.json() as { results?: DevfolioHackathon[]; data?: DevfolioHackathon[] }
    const hackathons = data.results || data.data || []
    return hackathons
      .filter((h) => {
        const name = (h.name || h.title || '').toLowerCase()
        const desc = (h.description || '').toLowerCase()
        return ['web3', 'blockchain', 'crypto', 'defi', 'nft', 'ethereum', 'solana'].some(
          k => name.includes(k) || desc.includes(k)
        )
      })
      .slice(0, 10)
      .map((h) => ({
        id: `df-${h.id || h.slug}`,
        title: h.name || h.title || 'Hackathon',
        organizer: h.team?.name || 'Devfolio',
        url: `https://devfolio.co/hackathons/${h.slug || h.id}`,
        source: 'Devfolio',
        startDate: h.starts_at || h.start_date,
        endDate: h.ends_at || h.end_date,
        prize: h.prize_pool ? `$${Number(h.prize_pool).toLocaleString()}` : undefined,
        status: getHackathonStatus(h.starts_at || h.start_date, h.ends_at || h.end_date),
        tags: ['Web3', 'Blockchain', 'Hackathon'],
        description: h.tagline || h.description,
        location: h.is_online ? 'Online' : h.location,
      } as Hackathon))
  } catch {
    return []
  }
}

function getStaticHackathons(): Hackathon[] {
  // Curated list - always shown as context
  return [
    {
      id: 'eth-ethglobal-events',
      title: 'ETHGlobal Events',
      organizer: 'ETHGlobal',
      url: 'https://ethglobal.com/events',
      source: 'ETHGlobal',
      status: 'upcoming',
      tags: ['Ethereum', 'Web3', 'Online', 'IRL'],
      description: 'The largest Ethereum hackathon series with events worldwide.',
      location: 'Worldwide',
    },
    {
      id: 'dh-dorahacks',
      title: 'DoraHacks Open Hackathons',
      organizer: 'DoraHacks',
      url: 'https://dorahacks.io/hackathon',
      source: 'DoraHacks',
      status: 'upcoming',
      tags: ['Web3', 'Blockchain', 'Multi-chain'],
      description: 'Global hackathon platform for Web3, AI, and more.',
      location: 'Online',
    },
    {
      id: 'df-devfolio',
      title: 'Devfolio Web3 Hackathons',
      organizer: 'Devfolio',
      url: 'https://devfolio.co/hackathons',
      source: 'Devfolio',
      status: 'upcoming',
      tags: ['Web3', 'Ethereum', 'Hackathon'],
      description: 'Discover and participate in top web3 hackathons.',
      location: 'Online',
    },
    {
      id: 'gitcoin-grants',
      title: 'Gitcoin Grants Rounds',
      organizer: 'Gitcoin',
      url: 'https://grants.gitcoin.co',
      source: 'Gitcoin',
      status: 'upcoming',
      tags: ['Public Goods', 'Ethereum', 'DeFi', 'Online'],
      description: 'Fund open source and public goods in the Ethereum ecosystem.',
      location: 'Online',
    },
    {
      id: 'hack-season',
      title: 'HackSeason — Web3 Hackathon',
      organizer: 'HackSeason',
      url: 'https://hackseason.io',
      source: 'HackSeason',
      status: 'upcoming',
      tags: ['Web3', 'Ethereum', 'DeFi', 'Online'],
      description: 'A global online hackathon for Web3 builders.',
      location: 'Online',
    },
    {
      id: 'encode-club',
      title: 'Encode Club Hackathons',
      organizer: 'Encode Club',
      url: 'https://www.encode.club/hackathons',
      source: 'Encode Club',
      status: 'upcoming',
      tags: ['Web3', 'Ethereum', 'Solana', 'Online'],
      description: 'Education and hackathon series for the next generation of Web3 developers.',
      location: 'Online',
    },
  ]
}

export async function fetchAllHackathons(): Promise<Hackathon[]> {
  const [ethglobal, dorahacks, devfolio] = await Promise.allSettled([
    fetchETHGlobalHackathons(),
    fetchDoraHacksHackathons(),
    fetchDevfolioHackathons(),
  ])

  const all: Hackathon[] = []
  if (ethglobal.status === 'fulfilled' && ethglobal.value.length > 0) all.push(...ethglobal.value)
  if (dorahacks.status === 'fulfilled' && dorahacks.value.length > 0) all.push(...dorahacks.value)
  if (devfolio.status === 'fulfilled' && devfolio.value.length > 0) all.push(...devfolio.value)

  // Always add static as fallback/supplement
  const staticOnes = getStaticHackathons()
  for (const s of staticOnes) {
    if (!all.find(h => h.source === s.source)) all.push(s)
  }

  // Deduplicate by id
  const seen = new Set<string>()
  const deduped = all.filter(h => {
    if (seen.has(h.id)) return false
    seen.add(h.id)
    return true
  })

  // Sort: live first, then upcoming, then ended
  return deduped.sort((a, b) => {
    const order: Record<string, number> = { live: 0, upcoming: 1, ended: 2 }
    return order[a.status] - order[b.status]
  })
}
