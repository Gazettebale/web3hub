# Web3Hub

![Open Source](https://img.shields.io/badge/Open%20Source-MIT-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Gazettebale/web3hub)

**All your Web3 opportunities in one place.**

Web3Hub is an open-source aggregator for Web3 job listings, hackathons, bug bounties, and grants. No account needed, no paywalls — just real-time data from the best sources in the ecosystem.

> Add a screenshot here: `public/screenshot.png`

---

## Features

- **Jobs** — Live job listings from Greenhouse and Lever boards across 70+ top web3 companies (Coinbase, Kraken, Fireblocks, Uniswap, Arbitrum, and more)
- **Hackathons** — Upcoming and live hackathons from ETHGlobal, DoraHacks, Devfolio, and Gitcoin
- **Bug Bounties** — Active bug bounty programs from Immunefi, Code4rena, and Sherlock
- **Grants** — Open grant programs from Gitcoin, Ethereum Foundation, Optimism, Arbitrum, Polygon, Solana Foundation, and more
- **Search & Filter** — Fast client-side search and tag filtering across all categories
- **Dark, modern UI** — Clean Linear.app-inspired design, fully responsive
- **No API keys required** — All data is fetched from public endpoints

---

## Data Sources

| Section | Sources |
|---------|---------|
| Jobs | Greenhouse API, Lever API |
| Hackathons | ETHGlobal, DoraHacks, Devfolio, Gitcoin |
| Bug Bounties | Immunefi, Code4rena, Sherlock |
| Grants | Gitcoin, Ethereum Foundation, Optimism, Arbitrum, Polygon, Solana, NEAR, Uniswap, Cosmos, ENS, Base, Aave |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Gazettebale/web3hub.git
cd web3hub

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

No API keys are required. Optionally copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

---

## Deploy to Vercel

The easiest way to deploy Web3Hub is with [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Gazettebale/web3hub)

Or from the CLI:

```bash
npm i -g vercel
vercel
```

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page (client component)
│   ├── globals.css         # Global styles
│   └── api/
│       ├── jobs/           # Job aggregation endpoint
│       ├── hackathons/     # Hackathon aggregation endpoint
│       ├── bounties/       # Bug bounty aggregation endpoint
│       └── grants/         # Grant aggregation endpoint
├── components/             # UI components
└── lib/
    ├── types.ts            # TypeScript interfaces
    ├── utils.ts            # Utility functions
    └── sources/            # Data source fetchers
        ├── greenhouse.ts
        ├── lever.ts
        ├── immunefi.ts
        ├── hackathons.ts
        └── grants.ts
```

---

## Contributing

Contributions are welcome! Here are some ways to help:

- Add new job board sources
- Add new hackathon platforms
- Improve tag extraction logic
- Add more grant programs
- Improve the UI/UX

### Adding a new source

1. Create a new file in `src/lib/sources/`
2. Export an async function that returns typed data
3. Import and call it in the appropriate API route

---

## License

MIT — free to use, modify, and distribute.

---

Built with love for the Web3 community.
