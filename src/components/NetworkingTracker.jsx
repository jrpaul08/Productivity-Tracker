import { getNetworkingDays } from '../utils/calculations.js'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function NetworkingTracker({ weekEntries }) {
  const days = getNetworkingDays(weekEntries)
  const filledCount = days.filter(Boolean).length

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        {days.map((filled, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-xl leading-none select-none" style={{ color: filled ? '#F44336' : '#d1d5db' }}>
              {filled ? '●' : '○'}
            </span>
            <span className="text-xs text-gray-400">{DAY_LABELS[idx]}</span>
          </div>
        ))}
      </div>
      <span className={`text-sm font-medium ${filledCount >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
        {filledCount}/3 days goal {filledCount >= 3 ? '✓' : ''}
      </span>
    </div>
  )
}
