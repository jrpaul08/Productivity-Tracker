import { getCategoryProgress, formatDuration } from '../utils/calculations.js'

const STATUS_COLORS = {
  below:   '#ef4444',
  minimum: '#f59e0b',
  ideal:   '#22c55e',
}

export default function CategoryProgressBar({ category, minutesToday }) {
  const status = getCategoryProgress(minutesToday, category)
  const barColor = STATUS_COLORS[status]
  const target = category.dailyIdeal ?? category.dailyMin
  const pct = target > 0 ? Math.min((minutesToday / target) * 100, 100) : 0

  return (
    <div className="flex items-center gap-4 py-4 group hover:bg-opacity-50 transition-all duration-200 rounded-lg px-2 -mx-2 hover:scale-[1.02]" 
         style={{ backgroundColor: 'transparent' }}>
      {/* Dot + name */}
      <div className="flex items-center gap-3 w-44 shrink-0">
        <div 
          className="w-3 h-3 rounded-full shrink-0 ring-2 ring-offset-2 transition-all duration-300 group-hover:scale-125" 
          style={{ 
            backgroundColor: category.color, 
            boxShadow: `0 0 12px ${category.color}88, 0 2px 8px ${category.color}44`,
            ringColor: `${category.color}33`,
            ringOffsetColor: 'var(--color-card)'
          }} 
        />
        <span className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
          {category.name}
        </span>
      </div>

      {/* Bar */}
      <div className="flex-1 h-3 rounded-full overflow-hidden relative" 
           style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative"
          style={{ 
            width: `${pct}%`, 
            backgroundColor: barColor,
            boxShadow: pct > 0 ? `0 0 16px ${barColor}66, inset 0 1px 0 rgba(255,255,255,0.2)` : 'none',
            background: pct > 0 ? `linear-gradient(90deg, ${barColor}, ${barColor}dd)` : barColor
          }}
        >
          {pct > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />
          )}
        </div>
      </div>

      {/* Label */}
      <span className="text-xs w-24 text-right shrink-0 font-mono font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
        {formatDuration(minutesToday)} / {formatDuration(category.dailyMin || category.dailyIdeal || 0)}
      </span>

      {/* Badge */}
      {status === 'below' && category.dailyMin > 0 && (
        <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 animate-pulse" 
              style={{ 
                color: '#ef4444', 
                backgroundColor: '#ef444422',
                border: '1px solid #ef444444',
                boxShadow: '0 0 8px #ef444433'
              }}>
          ⚠ behind
        </span>
      )}
    </div>
  )
}
