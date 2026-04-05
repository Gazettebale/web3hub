import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web3Hub — Find Web3 Jobs, Hackathons & Bounties',
  description:
    'The all-in-one platform for Web3 opportunities. Browse jobs, hackathons, bug bounties, and grants in one place.',
  keywords: ['web3 jobs', 'crypto jobs', 'blockchain hackathons', 'bug bounty', 'defi grants'],
  openGraph: {
    title: 'Web3Hub',
    description: 'All your Web3 opportunities in one place.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
