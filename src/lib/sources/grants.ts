import { Grant } from '../types'

interface GitcoinRound {
  id: string
  chainId?: number
  roundMetadata?: {
    name?: string
    description?: string
  }
  applicationsStartTime?: string
  applicationsEndTime?: string
}

async function fetchGitcoinGrants(): Promise<Grant[]> {
  try {
    // Try Gitcoin's public GraphQL API
    const res = await fetch('https://grants-stack-indexer-v2.gitcoin.co/graphql', {
      method: 'POST',
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          rounds(first: 10, filter: {
            strategyName: {
              in: ["allov2.DonationVotingMerkleDistributionDirectTransferStrategy"]
            }
          }) {
            id
            chainId
            roundMetadata {
              name
              description
            }
            applicationsStartTime
            applicationsEndTime
          }
        }`,
      }),
    })
    if (res.ok) {
      const data = await res.json() as { data?: { rounds?: GitcoinRound[] } }
      const rounds = data?.data?.rounds || []
      if (rounds.length > 0) {
        return rounds.map((r) => ({
          id: `gc-${r.id}`,
          title: r.roundMetadata?.name || 'Gitcoin Grants Round',
          organization: 'Gitcoin',
          url: 'https://grants.gitcoin.co/',
          source: 'Gitcoin',
          deadline: r.applicationsEndTime,
          tags: ['Public Goods', 'Ethereum', 'Open Source'],
          description: r.roundMetadata?.description,
          status: r.applicationsEndTime && new Date(r.applicationsEndTime) > new Date() ? 'open' : 'closed',
        } as Grant))
      }
    }
  } catch {
    // fall through to static
  }
  return getStaticGrants()
}

function getStaticGrants(): Grant[] {
  return [
    {
      id: 'gc-main',
      title: 'Gitcoin Grants',
      organization: 'Gitcoin',
      url: 'https://grants.gitcoin.co',
      source: 'Gitcoin',
      tags: ['Public Goods', 'Ethereum', 'Open Source', 'DeFi'],
      description: 'Fund public goods in the Ethereum ecosystem through quadratic funding.',
      status: 'rolling',
    },
    {
      id: 'ef-esp',
      title: 'Ethereum Foundation — ESP',
      organization: 'Ethereum Foundation',
      url: 'https://esp.ethereum.foundation',
      source: 'Ethereum Foundation',
      tags: ['Ethereum', 'Infrastructure', 'Research', 'Open Source'],
      description: 'Ecosystem Support Program for builders working on Ethereum infrastructure, tools, and research.',
      status: 'rolling',
    },
    {
      id: 'op-rpgf',
      title: 'Optimism Retroactive Public Goods Funding',
      organization: 'Optimism',
      url: 'https://app.optimism.io/retropgf',
      source: 'Optimism',
      amount: 'Up to $110M+ per round',
      tags: ['Optimism', 'Layer2', 'Public Goods', 'OP Stack'],
      description: 'Retroactive grants for projects that have created value for the Optimism ecosystem.',
      status: 'rolling',
    },
    {
      id: 'arb-grants',
      title: 'Arbitrum DAO Grants',
      organization: 'Arbitrum',
      url: 'https://arbitrum.foundation/grants',
      source: 'Arbitrum',
      amount: '$20K – $1M+',
      tags: ['Arbitrum', 'Layer2', 'DeFi', 'Infrastructure'],
      description: 'Grants for projects building on Arbitrum. Multiple tracks for different stages.',
      status: 'rolling',
    },
    {
      id: 'polygon-village',
      title: 'Polygon Village Grants',
      organization: 'Polygon',
      url: 'https://polygon.technology/village/grants',
      source: 'Polygon',
      amount: 'Up to $100K',
      tags: ['Polygon', 'DeFi', 'Gaming', 'Infrastructure'],
      description: 'Support for early-stage projects building on Polygon.',
      status: 'open',
    },
    {
      id: 'solana-foundation',
      title: 'Solana Foundation Grants',
      organization: 'Solana Foundation',
      url: 'https://solana.org/grants',
      source: 'Solana',
      tags: ['Solana', 'Infrastructure', 'DeFi', 'NFT'],
      description: 'Grants for developers building dApps, tools, and infrastructure on Solana.',
      status: 'rolling',
    },
    {
      id: 'near-grants',
      title: 'NEAR Foundation Grants',
      organization: 'NEAR Protocol',
      url: 'https://near.foundation/grants/',
      source: 'NEAR',
      amount: 'Up to $50K',
      tags: ['NEAR', 'Infrastructure', 'DeFi', 'Cosmos'],
      description: 'NEAR Foundation grants for developers building in the NEAR ecosystem.',
      status: 'open',
    },
    {
      id: 'uniswap-grants',
      title: 'Uniswap Foundation Grants',
      organization: 'Uniswap',
      url: 'https://www.uniswapfoundation.org/grants',
      source: 'Uniswap',
      tags: ['Ethereum', 'DeFi', 'DEX', 'Infrastructure'],
      description: 'Grants for research, development, and governance related to the Uniswap Protocol.',
      status: 'rolling',
    },
    {
      id: 'cosmos-grants',
      title: 'Cosmos Hub Community Pool',
      organization: 'Cosmos',
      url: 'https://forum.cosmos.network/tag/grant',
      source: 'Cosmos',
      tags: ['Cosmos', 'IBC', 'Infrastructure', 'Interop'],
      description: 'Community grants for projects in the Cosmos ecosystem via governance.',
      status: 'rolling',
    },
    {
      id: 'ens-grants',
      title: 'ENS Small Grants',
      organization: 'ENS DAO',
      url: 'https://ensgrants.xyz',
      source: 'ENS',
      tags: ['Ethereum', 'Identity', 'Infrastructure', 'DAO'],
      description: 'Small grants for projects building on or integrating ENS.',
      status: 'rolling',
    },
    {
      id: 'base-grants',
      title: 'Base Ecosystem Fund',
      organization: 'Base / Coinbase',
      url: 'https://base.mirror.xyz',
      source: 'Base',
      amount: 'Varies',
      tags: ['Base', 'Ethereum', 'Layer2', 'Infrastructure'],
      description: 'Support for developers building on the Base network.',
      status: 'rolling',
    },
    {
      id: 'zksync-grants',
      title: 'zkSync Ignite Grants',
      organization: 'Matter Labs',
      url: 'https://app.zerion.io/explore/dapps',
      source: 'zkSync',
      amount: 'Varies',
      tags: ['ZK', 'Layer2', 'Infrastructure', 'DeFi'],
      description: 'Grants and incentives for projects deploying on zkSync Era.',
      status: 'open',
    },
    {
      id: 'aave-grants',
      title: 'Aave Grants DAO',
      organization: 'Aave',
      url: 'https://aavegrants.org',
      source: 'Aave',
      amount: 'Up to $100K',
      tags: ['Ethereum', 'DeFi', 'Lending', 'DAO'],
      description: 'Grants for developers and researchers contributing to the Aave ecosystem.',
      status: 'rolling',
    },
  ]
}

export async function fetchAllGrants(): Promise<Grant[]> {
  const gitcoin = await fetchGitcoinGrants().catch(() => getStaticGrants())
  return gitcoin
}
