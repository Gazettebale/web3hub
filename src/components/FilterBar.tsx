'use client'

interface Props {
  filters: string[]
  activeFilters: string[]
  onToggle: (tag: string) => void
  onClear: () => void
}

export default function FilterBar({ filters, activeFilters, onToggle, onClear }: Props) {
  return (
    <div className="mt-3 flex gap-2 overflow-x-auto pb-2 items-center scrollbar-hide">
      {activeFilters.length > 0 && (
        <button
          onClick={onClear}
          className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all"
          style={{ borderColor: '#ef4444', color: '#ef4444', background: '#ef444411' }}
        >
          Clear ×
        </button>
      )}
      {filters.map(tag => {
        const active = activeFilters.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all"
            style={{
              borderColor: active ? '#8b5cf6' : 'var(--border)',
              color: active ? '#8b5cf6' : 'var(--text-muted)',
              background: active ? '#8b5cf622' : 'transparent',
            }}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
