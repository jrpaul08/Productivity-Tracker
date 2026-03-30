import { useState } from 'react'
import { CATEGORY_MAP } from '../constants/categories.js'
import { formatDuration } from '../utils/calculations.js'

export default function DailyLogTable({ entries, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(null)

  if (entries.length === 0) return null

  const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0)

  const handleDelete = (id) => {
    onDelete(id)
    setConfirmingDelete(null)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ 
      backgroundColor: 'var(--color-card)', 
      border: '1px solid var(--color-border)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 font-bold text-xs uppercase tracking-[0.1em]" 
           style={{ 
             backgroundColor: 'var(--color-surface)', 
             borderBottom: '1px solid var(--color-border-bright)',
             color: 'var(--color-text-secondary)'
           }}>
        <div className="col-span-1">Time</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-4">Activity</div>
        <div className="col-span-2">Duration</div>
        <div className="col-span-2">Notes</div>
        <div className="col-span-1"></div>
      </div>

      {/* Entries */}
      <div className="divide-y" style={{ divideColor: 'var(--color-border)' }}>
        {entries.map((entry) => {
          const category = CATEGORY_MAP[entry.category]
          const isConfirming = confirmingDelete === entry.id
          return (
            <div key={entry.id} 
                 className="grid grid-cols-12 gap-4 px-6 py-4 text-sm hover:bg-opacity-50 transition-colors"
                 style={{ backgroundColor: isConfirming ? 'rgba(239, 68, 68, 0.1)' : 'transparent' }}>
              <div className="col-span-1 font-semibold font-mono" style={{ color: 'var(--color-text-primary)' }}>
                {entry.time || '—'}
              </div>
              <div className="col-span-2">
                <span 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ 
                    backgroundColor: `${category?.color}22`,
                    color: category?.color,
                    border: `1px solid ${category?.color}44`
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category?.color }} />
                  {category?.shortName || entry.category}
                </span>
              </div>
              <div className="col-span-4" style={{ color: 'var(--color-text-primary)' }}>
                {entry.activity}
                {entry.jobCount && (
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" 
                        style={{ 
                          backgroundColor: '#10b98122', 
                          color: '#10b981',
                          border: '1px solid #10b98144'
                        }}>
                    {entry.jobCount} {entry.jobCount === 1 ? 'job' : 'jobs'}
                  </span>
                )}
              </div>
              <div className="col-span-2 font-semibold font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                {formatDuration(entry.duration)}
              </div>
              <div className="col-span-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {entry.notes || '—'}
              </div>
              <div className="col-span-1 flex justify-end">
                {isConfirming ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="px-2 py-1 rounded text-xs font-semibold transition-all hover:scale-105"
                      style={{ backgroundColor: '#ef4444', color: 'white', boxShadow: '0 2px 8px #ef444444' }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(null)}
                      className="px-2 py-1 rounded text-xs font-semibold transition-all hover:scale-105"
                      style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingDelete(entry.id)}
                    className="p-1.5 rounded-lg transition-all hover:scale-110"
                    style={{ color: '#ef4444', backgroundColor: 'transparent' }}
                    title="Delete entry"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Total Row */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 font-bold text-sm border-t-2" 
           style={{ 
             backgroundColor: 'var(--color-surface)', 
             borderColor: 'var(--color-border-bright)',
             color: 'var(--color-text-primary)'
           }}>
        <div className="col-span-7">Total</div>
        <div className="col-span-2 font-mono text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {formatDuration(totalMinutes)}
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  )
}
