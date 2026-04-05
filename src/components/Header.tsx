export default function Header() {
  return (
    <header
      className="border-b px-4 sm:px-6 lg:px-8 py-12 text-center"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          }}
        >
          W
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Web3
          <span
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Hub
          </span>
        </h1>
      </div>
      <p
        className="text-lg max-w-xl mx-auto"
        style={{ color: 'var(--text-muted)' }}
      >
        Jobs, hackathons, bug bounties, and grants — all in one place.
      </p>
      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Live data</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No signup required</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#06b6d4' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Free forever</span>
        </div>
      </div>
    </header>
  )
}
