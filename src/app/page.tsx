'use client'

import { useState, useEffect, useCallback } from 'react'
import { Job, Hackathon, BugBounty, Grant, Tab, FilterState } from '@/lib/types'
import Header from '@/components/Header'
import TabNav from '@/components/TabNav'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import JobCard from '@/components/JobCard'
import HackathonCard from '@/components/HackathonCard'
import BountyCard from '@/components/BountyCard'
import GrantCard from '@/components/GrantCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'
import { filterItems } from '@/lib/utils'

const JOB_FILTERS = [
  'Engineer', 'Developer', 'Designer', 'Marketing', 'Product', 'Research',
  'Security', 'Data', 'Community', 'Sales', 'Remote', 'Senior', 'Junior',
  'Internship', 'Contract', 'Ethereum', 'Solana', 'Polygon', 'Arbitrum',
  'Optimism', 'Base', 'Cosmos', 'ZK', 'Bitcoin', 'DeFi', 'NFT',
  'Infrastructure', 'Gaming', 'DAO', 'Layer2',
]

const HACKATHON_FILTERS = [
  'Online', 'IRL', 'Ethereum', 'Solana', 'Multi-chain', 'Public Goods', 'AI', 'DeFi',
]

const BOUNTY_FILTERS = [
  'Smart Contract', 'Ethereum', 'Solana', 'Polygon', 'Arbitrum', 'Optimism',
  'Layer2', 'DeFi', 'DEX', 'Oracle', 'Infrastructure', 'Audit',
]

const GRANT_FILTERS = [
  'Ethereum', 'Solana', 'Polygon', 'Arbitrum', 'Optimism', 'Cosmos', 'NEAR',
  'Public Goods', 'Infrastructure', 'DeFi', 'Research', 'Open Source', 'DAO',
]

type LoadingState = Record<Tab, boolean>
type LoadedState = Record<Tab, boolean>

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs')
  const [filters, setFilters] = useState<FilterState>({ search: '', tags: [] })

  const [jobs, setJobs] = useState<Job[]>([])
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [bounties, setBounties] = useState<BugBounty[]>([])
  const [grants, setGrants] = useState<Grant[]>([])

  const [loading, setLoading] = useState<LoadingState>({
    jobs: false,
    hackathons: false,
    bounties: false,
    grants: false,
  })
  const [loaded, setLoaded] = useState<LoadedState>({
    jobs: false,
    hackathons: false,
    bounties: false,
    grants: false,
  })

  const fetchData = useCallback(
    async (tab: Tab) => {
      if (loaded[tab]) return
      setLoading(prev => ({ ...prev, [tab]: true }))
      try {
        const res = await fetch(`/api/${tab}`)
        const data = await res.json() as Record<string, unknown>
        if (tab === 'jobs') setJobs((data.jobs as Job[]) || [])
        if (tab === 'hackathons') setHackathons((data.hackathons as Hackathon[]) || [])
        if (tab === 'bounties') setBounties((data.bounties as BugBounty[]) || [])
        if (tab === 'grants') setGrants((data.grants as Grant[]) || [])
        setLoaded(prev => ({ ...prev, [tab]: true }))
      } catch (e) {
        console.error(`Failed to fetch ${tab}:`, e)
      } finally {
        setLoading(prev => ({ ...prev, [tab]: false }))
      }
    },
    [loaded]
  )

  useEffect(() => {
    fetchData('jobs')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setFilters({ search: '', tags: [] })
    fetchData(tab)
  }

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const currentFilters = {
    jobs: JOB_FILTERS,
    hackathons: HACKATHON_FILTERS,
    bounties: BOUNTY_FILTERS,
    grants: GRANT_FILTERS,
  }[activeTab]

  const filteredJobs = filterItems(jobs, filters.search, filters.tags)
  const filteredHackathons = filterItems(hackathons, filters.search, filters.tags)
  const filteredBounties = filterItems(bounties, filters.search, filters.tags)
  const filteredGrants = filterItems(grants, filters.search, filters.tags)

  const counts: Record<Tab, number> = {
    jobs: jobs.length,
    hackathons: hackathons.length,
    bounties: bounties.length,
    grants: grants.length,
  }

  const hasFilters = filters.tags.length > 0 || !!filters.search

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} counts={counts} />

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters(prev => ({ ...prev, search }))}
            placeholder={`Search ${activeTab}...`}
          />
        </div>

        <FilterBar
          filters={currentFilters}
          activeFilters={filters.tags}
          onToggle={toggleTag}
          onClear={() => setFilters(prev => ({ ...prev, tags: [] }))}
        />

        {/* Jobs */}
        {activeTab === 'jobs' && (
          <section className="mt-6">
            {loading.jobs ? (
              <LoadingSkeleton count={9} />
            ) : filteredJobs.length === 0 ? (
              <EmptyState tab="jobs" hasFilters={hasFilters} />
            ) : (
              <>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Hackathons */}
        {activeTab === 'hackathons' && (
          <section className="mt-6">
            {loading.hackathons ? (
              <LoadingSkeleton count={6} />
            ) : filteredHackathons.length === 0 ? (
              <EmptyState tab="hackathons" hasFilters={hasFilters} />
            ) : (
              <>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  {filteredHackathons.length} hackathon{filteredHackathons.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHackathons.map(h => (
                    <HackathonCard key={h.id} hackathon={h} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Bounties */}
        {activeTab === 'bounties' && (
          <section className="mt-6">
            {loading.bounties ? (
              <LoadingSkeleton count={6} />
            ) : filteredBounties.length === 0 ? (
              <EmptyState tab="bounties" hasFilters={hasFilters} />
            ) : (
              <>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  {filteredBounties.length} bounty program{filteredBounties.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBounties.map(b => (
                    <BountyCard key={b.id} bounty={b} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Grants */}
        {activeTab === 'grants' && (
          <section className="mt-6">
            {loading.grants ? (
              <LoadingSkeleton count={6} />
            ) : filteredGrants.length === 0 ? (
              <EmptyState tab="grants" hasFilters={hasFilters} />
            ) : (
              <>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  {filteredGrants.length} grant program{filteredGrants.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGrants.map(g => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <footer
        className="border-t py-8 text-center text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        <p>Web3Hub — All your Web3 opportunities in one place</p>
        <p className="mt-1">
          Data from Greenhouse, Lever, Immunefi, ETHGlobal, DoraHacks, Gitcoin & more
        </p>
      </footer>
    </div>
  )
}
