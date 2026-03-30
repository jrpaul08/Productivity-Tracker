import { getNetworkingDays } from '../utils/calculations.js'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const COLOR = '#F44336'

export default function NetworkingTracker({ weekEntries }) {
  const days = getNetworkingDays(weekEntries)
  const filledCount = days.filter(Boolean).length

  return (
    <div className="flex items-center justify-between gap-8 flex-wrap">
      <div className="flex gap-4">
        {days.map((filled, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 group">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110 cursor-pointer"
              style={filled
                ? { 
                    backgroundColor: COLOR, 
                    color: 'white', 
                    boxShadow: `0 0 20px ${COLOR}88, 0 4px 12px ${COLOR}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    border: `2px solid ${COLOR}`,
                  }
                : { 
                    backgroundColor: 'var(--color-surface)', 
                    color: 'var(--color-text-muted)',
                    border: '2px dashed var(--color-border-bright)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                  }
              }
            >
              {filled ? '✓' : ''}
            </div>
            <span className="text-xs font-medium transition-colors" 
                  style={{ color: filled ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}>
              {DAY_LABELS[idx]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full" 
           style={{ 
             backgroundColor: filledCount >= 3 ? '#22c55e22' : 'var(--color-surface)',
             border: filledCount >= 3 ? '1px solid #22c55e44' : '1px solid var(--color-border-bright)',
             boxShadow: filledCount >= 3 ? '0 0 16px #22c55e33' : 'none'
           }}>
        <span className="text-2xl font-bold" style={{ color: filledCount >= 3 ? '#22c55e' : 'var(--color-text-secondary)' }}>
          {filledCount}
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold" style={{ color: filledCount >= 3 ? '#22c55e' : 'var(--color-text-secondary)' }}>
            / 3 days
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {filledCount >= 3 ? 'Goal met! ✓' : 'this week'}
          </span>
        </div>
      </div>
    </div>
  )
}
