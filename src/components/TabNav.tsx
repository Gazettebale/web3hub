'use client'

import { Tab } from '@/lib/types'

interface Props {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  counts: Record<Tab, number>
}

const tabs: { id: Tab; label: string; icon: string; color: string }[] = [
  { id: 'jobs', label: 'Jobs', icon: '💼', color: '#8b5cf6' },
  { id: 'hackathons', label: 'Hackathons', icon: '⚡', color: '#06b6d4' },
  { id: 'bounties', label: 'Bug Bounties', icon: '🛡️', color: '#22c55e' },
  { id: 'grants', label: 'Grants', icon: '✨', color: '#f97316' },
]

export default function TabNav({ activeTab, onTabChange, counts }: Props) {
  return (
    <div
      className="flex gap-1 mt-8 p-1 rounded-xl border overflow-x-auto scrollbar-hide"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-w-fit"
            style={{
              background: isActive ? 'var(--bg-card)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {counts[tab.id] > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-semibold transition-all"
                style={{
                  background: isActive ? tab.color + '22' : '#27272a',
                  color: isActive ? tab.color : 'var(--text-muted)',
                }}
              >
                {counts[tab.id]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
