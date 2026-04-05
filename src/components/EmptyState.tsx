import { Tab } from '@/lib/types'

interface Props {
  tab: Tab
  hasFilters: boolean
}

const MESSAGES = {
  jobs: {
    icon: '💼',
    title: 'No jobs found',
    subtitle: 'Try different filters or search terms, or check back later.',
    hint: 'Jobs are sourced from Greenhouse and Lever boards across 70+ web3 companies.',
  },
  hackathons: {
    icon: '⚡',
    title: 'No hackathons found',
    subtitle: 'Check ETHGlobal, DoraHacks, and Devfolio for the latest events.',
    hint: 'Hackathons are sourced from ETHGlobal, DoraHacks, Devfolio, and Gitcoin.',
  },
  bounties: {
    icon: '🛡️',
    title: 'No bounties found',
    subtitle: 'Try removing filters to see all available bounty programs.',
    hint: 'Bounties are sourced from Immunefi, Code4rena, and Sherlock.',
  },
  grants: {
    icon: '✨',
    title: 'No grants found',
    subtitle: 'Try different filters or check back for new grant programs.',
    hint: 'Grants are sourced from Gitcoin, Ethereum Foundation, Optimism, Arbitrum, and more.',
  },
}

export default function EmptyState({ tab, hasFilters }: Props) {
  const msg = MESSAGES[tab]

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">{msg.icon}</div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {hasFilters ? 'No results match your filters' : msg.title}
      </h3>
      <p className="max-w-sm mb-3" style={{ color: 'var(--text-muted)' }}>
        {hasFilters ? 'Try clearing some filters or adjusting your search.' : msg.subtitle}
      </p>
      <p className="text-xs max-w-sm" style={{ color: '#3f3f46' }}>
        {msg.hint}
      </p>
    </div>
  )
}
