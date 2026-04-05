export interface Job {
  id: string
  title: string
  company: string
  location: string
  url: string
  source: string
  tags: string[]
  postedAt?: string
  remote: boolean
  salary?: string
  type?: string // full-time, part-time, contract
  level?: string // senior, mid, junior
}

export interface Hackathon {
  id: string
  title: string
  organizer: string
  url: string
  source: string
  startDate?: string
  endDate?: string
  prize?: string
  status: 'live' | 'upcoming' | 'ended'
  tags: string[]
  description?: string
  location?: string // online or city
}

export interface BugBounty {
  id: string
  title: string
  company: string
  url: string
  source: string
  maxReward?: string
  minReward?: string
  tags: string[] // ecosystems, chains, etc.
  assets?: string[] // smart contracts, websites, etc.
  severity?: string
}

export interface Grant {
  id: string
  title: string
  organization: string
  url: string
  source: string
  amount?: string
  deadline?: string
  tags: string[]
  description?: string
  status?: 'open' | 'closed' | 'rolling'
}

export type Tab = 'jobs' | 'hackathons' | 'bounties' | 'grants'

export interface FilterState {
  search: string
  tags: string[]
}
