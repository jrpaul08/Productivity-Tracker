import { getCategoryProgress, formatDuration } from '../utils/calculations.js'

export default function CategoryProgressBar({ category, minutesToday }) {
  const status = getCategoryProgress(minutesToday, category)
  const barColors = { below: 'bg-red-400', minimum: 'bg-yellow-400', ideal: 'bg-green-400' }
  const target = category.dailyIdeal ?? category.dailyMin
  const pct = target > 0 ? Math.min((minutesToday / target) * 100, 100) : 0

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-2 w-36 shrink-0">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
        <span className="text-sm font-medium text-gray-700 truncate">{category.name}</span>
      </div>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColors[status]}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-24 text-right shrink-0">
        {formatDuration(minutesToday)} / {formatDuration(category.dailyMin || category.dailyIdeal || 0)}
      </span>
      {status === 'below' && category.dailyMin > 0 && (
        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded shrink-0">⚠ behind</span>
      )}
    </div>
  )
}
