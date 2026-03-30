import { getNetworkingDays } from '../utils/calculations.js'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const COLOR = '#F44336'

export default function NetworkingTracker({ weekEntries }) {
  const days = getNetworkingDays(weekEntries)
  const filledCount = days.filter(Boolean).length

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="flex gap-3">
        {days.map((filled, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={filled
                ? { backgroundColor: COLOR, color: 'white', boxShadow: `0 0 12px ${COLOR}66` }
                : { backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' }
              }
            >
              {filled ? '✓' : ''}
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{DAY_LABELS[idx]}</span>
          </div>
        ))}
      </div>
      <span className="text-sm font-semibold" style={{ color: filledCount >= 3 ? '#22c55e' : 'var(--color-text-secondary)' }}>
        {filledCount} / 3 days {filledCount >= 3 ? '✓' : 'goal'}
      </span>
    </div>
  )
}
