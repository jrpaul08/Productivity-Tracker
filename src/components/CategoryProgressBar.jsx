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
    <div className="flex items-center gap-4 py-3">
      {/* Dot + name */}
      <div className="flex items-center gap-2.5 w-40 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: category.color, boxShadow: `0 0 6px ${category.color}88` }} />
        <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{category.name}</span>
      </div>

      {/* Bar */}
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: pct > 0 ? `0 0 8px ${barColor}66` : 'none' }}
        />
      </div>

      {/* Label */}
      <span className="text-xs w-20 text-right shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
        {formatDuration(minutesToday)} / {formatDuration(category.dailyMin || category.dailyIdeal || 0)}
      </span>

      {/* Badge */}
      {status === 'below' && category.dailyMin > 0 && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded shrink-0" style={{ color: '#ef4444', backgroundColor: '#ef444418' }}>
          ⚠ behind
        </span>
      )}
    </div>
  )
}
