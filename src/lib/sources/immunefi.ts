import { BugBounty } from '../types'

// Immunefi has a public JSON endpoint that lists all bounties
export async function fetchImmunefiBounties(): Promise<BugBounty[]> {
  try {
    // Try the known public data endpoint
    const res = await fetch('https://immunefi.com/api/bounty/all/', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    })

    if (res.ok) {
      const data = await res.json() as { data?: Record<string, unknown>[] } | Record<string, unknown>[]
      const bounties = (data as { data?: Record<string, unknown>[] }).data || (data as Record<string, unknown>[]) || []
      if (Array.isArray(bounties) && bounties.length > 0) {
        return bounties.slice(0, 100).map((b) => mapImmunefiBounty(b as Record<string, unknown>, 'Immunefi'))
      }
    }
  } catch {
    // fall through to next attempt
  }

  // Fallback: try alternative endpoint
  try {
    const res = await fetch('https://immunefi.com/explore/', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (res.ok) {
      const html = await res.text()
      // Try to extract JSON from __NEXT_DATA__
      const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
      if (match) {
        const nextData = JSON.parse(match[1]) as {
          props?: {
            pageProps?: {
              bounties?: Record<string, unknown>[]
              data?: Record<string, unknown>[]
            }
          }
        }
        const bounties = nextData?.props?.pageProps?.bounties ||
          nextData?.props?.pageProps?.data || []
        if (Array.isArray(bounties) && bounties.length > 0) {
          return bounties.slice(0, 100).map((b) => mapImmunefiBounty(b as Record<string, unknown>, 'Immunefi'))
        }
      }
    }
  } catch {
    // fall through to static fallback
  }

  // Return curated static fallback list of top 20 Immunefi bounties
  return getStaticBounties()
}

function mapImmunefiBounty(b: Record<string, unknown>, source: string): BugBounty {
  const bountyRange = b.bountyRange as { max?: unknown; min?: unknown } | undefined
  const maxReward = b.maxBounty || b.maximum_reward || bountyRange?.max
  const minReward = b.minBounty || b.minimum_reward || bountyRange?.min

  const tags: string[] = []
  if (b.ecosystem) {
    const eco = Array.isArray(b.ecosystem) ? b.ecosystem : [b.ecosystem]
    tags.push(...eco.filter((e): e is string => typeof e === 'string'))
  }
  if (b.productType) {
    const pt = Array.isArray(b.productType) ? b.productType : [b.productType]
    tags.push(...pt.filter((e): e is string => typeof e === 'string'))
  }
  if (b.programType && typeof b.programType === 'string') tags.push(b.programType)

  const assets = b.assets as Array<{ type?: string } | string> | undefined

  return {
    id: `imm-${b.id || b.slug || b.name}`,
    title: (b.project || b.name || b.title || 'Unknown') as string,
    company: (b.project || b.name || 'Unknown') as string,
    url: (b.url as string) || `https://immunefi.com/bug-bounty/${b.slug || ''}/`,
    source,
    maxReward: maxReward ? `$${Number(maxReward).toLocaleString()}` : undefined,
    minReward: minReward ? `$${Number(minReward).toLocaleString()}` : undefined,
    tags: [...new Set(tags.filter(Boolean))],
    assets: assets?.map((a) => (typeof a === 'object' ? a.type || '' : a)).filter(Boolean) || [],
    severity: b.launchDate ? 'Active' : undefined,
  }
}

function getStaticBounties(): BugBounty[] {
  return [
    {
      id: 'imm-ethereum',
      title: 'Ethereum Foundation',
      company: 'Ethereum Foundation',
      url: 'https://ethereum.org/en/bug-bounty/',
      source: 'Immunefi',
      maxReward: '$250,000',
      tags: ['Ethereum', 'Protocol'],
      assets: ['Smart Contract', 'Core Protocol'],
    },
    {
      id: 'imm-uniswap',
      title: 'Uniswap',
      company: 'Uniswap Labs',
      url: 'https://immunefi.com/bug-bounty/uniswap/',
      source: 'Immunefi',
      maxReward: '$2,250,000',
      tags: ['Ethereum', 'DeFi', 'DEX'],
      assets: ['Smart Contract'],
    },
    {
      id: 'imm-aave',
      title: 'Aave',
      company: 'Aave',
      url: 'https://immunefi.com/bug-bounty/aave/',
      source: 'Immunefi',
      maxReward: '$250,000',
      tags: ['Ethereum', 'DeFi', 'Lending'],
      assets: ['Smart Contract'],
    },
    {
      id: 'imm-chainlink',
      title: 'Chainlink',
      company: 'Chainlink Labs',
      url: 'https://immunefi.com/bug-bounty/chainlink/',
      source: 'Immunefi',
      maxReward: '$10,000,000',
      tags: ['Ethereum', 'Oracle', 'Infrastructure'],
      assets: ['Smart Contract', 'Website'],
    },
    {
      id: 'imm-compound',
      title: 'Compound',
      company: 'Compound Finance',
      url: 'https://immunefi.com/bug-bounty/compound/',
      source: 'Immunefi',
      maxReward: '$150,000',
      tags: ['Ethereum', 'DeFi', 'Lending'],
      assets: ['Smart Contract'],
    },
    {
      id: 'imm-synthetix',
      title: 'Synthetix',
      company: 'Synthetix',
      url: 'https://immunefi.com/bug-bounty/synthetix/',
      source: 'Immunefi',
      maxReward: '$65,000',
      tags: ['Ethereum', 'DeFi', 'Derivatives'],
      assets: ['Smart Contract'],
    },
    {
      id: 'imm-makerdao',
      title: 'MakerDAO',
      company: 'MakerDAO',
      url: 'https://immunefi.com/bug-bounty/makerdao/',
      source: 'Immunefi',
      maxReward: '$10,000,000',
      tags: ['Ethereum', 'DeFi', 'Stablecoin'],
      assets: ['Smart Contract'],
    },
    {
      id: 'imm-curve',
      title: 'Curve Finance',
      company: 'Curve',
      url: 'https://immunefi.com/bug-bounty/curvefi/',
      source: 'Immunefi',
      maxReward: '$250,000',
      tags: ['Ethereum', 'DeFi', 'DEX'],
      assets: ['Smart Contract'],
    },
    {
      id: 'imm-1inch',
      title: '1inch Network',
      company: '1inch',
      url: 'https://immunefi.com/bug-bounty/1inch/',
      source: 'Immunefi',
      maxReward: '$500,000',
      tags: ['Ethereum', 'DeFi', 'Aggregator'],
      assets: ['Smart Contract'],
    },
    {
      id: 'imm-polygon',
      title: 'Polygon',
      company: 'Polygon',
      url: 'https://immunefi.com/bug-bounty/polygon/',
      source: 'Immunefi',
      maxReward: '$2,000,000',
      tags: ['Polygon', 'Layer2', 'Infrastructure'],
      assets: ['Smart Contract', 'Core Protocol'],
    },
    {
      id: 'imm-optimism',
      title: 'Optimism',
      company: 'Optimism',
      url: 'https://immunefi.com/bug-bounty/optimism/',
      source: 'Immunefi',
      maxReward: '$2,000,042',
      tags: ['Optimism', 'Layer2', 'Infrastructure'],
      assets: ['Smart Contract', 'Core Protocol'],
    },
    {
      id: 'imm-arbitrum',
      title: 'Arbitrum',
      company: 'Offchain Labs',
      url: 'https://immunefi.com/bug-bounty/arbitrum/',
      source: 'Immunefi',
      maxReward: '$2,000,000',
      tags: ['Arbitrum', 'Layer2', 'Infrastructure'],
      assets: ['Smart Contract', 'Core Protocol'],
    },
    {
      id: 'imm-blur',
      title: 'Blur',
      company: 'Blur',
      url: 'https://immunefi.com/bug-bounty/blur/',
      source: 'Immunefi',
      maxReward: '$100,000',
      tags: ['Ethereum', 'NFT', 'DeFi'],
      assets: ['Smart Contract', 'Website'],
    },
    {
      id: 'imm-lido',
      title: 'Lido Finance',
      company: 'Lido',
      url: 'https://immunefi.com/bug-bounty/lido/',
      source: 'Immunefi',
      maxReward: '$2,000,000',
      tags: ['Ethereum', 'DeFi', 'Staking'],
      assets: ['Smart Contract'],
    },
    {
      id: 'imm-balancer',
      title: 'Balancer',
      company: 'Balancer Labs',
      url: 'https://immunefi.com/bug-bounty/balancer/',
      source: 'Immunefi',
      maxReward: '$1,000,000',
      tags: ['Ethereum', 'DeFi', 'DEX'],
      assets: ['Smart Contract'],
    },
  ]
}

// Code4rena - competitive audit platform
export async function fetchCode4renaBounties(): Promise<BugBounty[]> {
  try {
    const res = await fetch('https://code4rena.com/contests', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!res.ok) return getStaticCode4rena()
    const html = await res.text()
    // Try __NEXT_DATA__
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (match) {
      const nextData = JSON.parse(match[1]) as {
        props?: {
          pageProps?: {
            contests?: Record<string, unknown>[]
            data?: Record<string, unknown>[]
          }
        }
      }
      const contests = nextData?.props?.pageProps?.contests ||
        nextData?.props?.pageProps?.data || []
      if (Array.isArray(contests) && contests.length > 0) {
        const active = (contests as Record<string, unknown>[])
          .filter((c) => c.status === 'active' || c.phase === 'active')
          .slice(0, 10)
        if (active.length > 0) {
          return active.map((c) => ({
            id: `c4-${c.id || c.slug}`,
            title: (c.title || c.name || 'Unknown Contest') as string,
            company: (c.sponsor || c.title || 'Unknown') as string,
            url: `https://code4rena.com/audits/${c.slug || c.id}`,
            source: 'Code4rena',
            maxReward: c.totalPrize
              ? `$${Number(c.totalPrize).toLocaleString()} USDC`
              : (c.prize as string | undefined),
            tags: ['Smart Contract', 'Ethereum', 'Audit'],
            assets: ['Smart Contract'],
          } as BugBounty))
        }
      }
    }
    return getStaticCode4rena()
  } catch {
    return getStaticCode4rena()
  }
}

function getStaticCode4rena(): BugBounty[] {
  return [
    {
      id: 'c4-active',
      title: 'Active Code4rena Contests',
      company: 'Code4rena',
      url: 'https://code4rena.com/audits',
      source: 'Code4rena',
      tags: ['Smart Contract', 'Audit', 'Ethereum'],
      assets: ['Smart Contract'],
    },
    {
      id: 'c4-sherlock',
      title: 'Sherlock Audit Contests',
      company: 'Sherlock',
      url: 'https://app.sherlock.xyz/audits/contests',
      source: 'Sherlock',
      tags: ['Smart Contract', 'Audit', 'DeFi'],
      assets: ['Smart Contract'],
    },
  ]
}

export async function fetchAllBounties(): Promise<BugBounty[]> {
  const [immunefi, code4rena] = await Promise.allSettled([
    fetchImmunefiBounties(),
    fetchCode4renaBounties(),
  ])

  const all: BugBounty[] = []
  if (immunefi.status === 'fulfilled') all.push(...immunefi.value)
  if (code4rena.status === 'fulfilled') all.push(...code4rena.value)

  // Deduplicate by id
  const seen = new Set<string>()
  return all.filter(b => {
    if (seen.has(b.id)) return false
    seen.add(b.id)
    return true
  })
}
