interface Props {
  count?: number
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl border p-5 animate-pulse"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-20 rounded-full" style={{ background: '#27272a' }} />
        <div className="h-5 w-14 rounded-full" style={{ background: '#27272a' }} />
      </div>
      <div className="h-4 w-24 rounded mb-2" style={{ background: '#27272a' }} />
      <div className="h-5 w-3/4 rounded mb-1" style={{ background: '#27272a' }} />
      <div className="h-5 w-1/2 rounded mb-3" style={{ background: '#27272a' }} />
      <div className="h-4 w-1/3 rounded mb-4" style={{ background: '#27272a' }} />
      <div className="flex gap-1.5 mb-5">
        <div className="h-5 w-16 rounded-md" style={{ background: '#27272a' }} />
        <div className="h-5 w-16 rounded-md" style={{ background: '#27272a' }} />
        <div className="h-5 w-16 rounded-md" style={{ background: '#27272a' }} />
      </div>
      <div className="h-9 rounded-lg" style={{ background: '#27272a' }} />
    </div>
  )
}

export default function LoadingSkeleton({ count = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
