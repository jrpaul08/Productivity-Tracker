import { useState, useEffect } from 'react'
import { CATEGORY_MAP, CATEGORY_NAMES } from '../constants/categories.js'
import { formatDuration } from '../utils/calculations.js'

export default function EntryTable({ entries, onDelete, onFilteredChange }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate]     = useState('')
  const [selectedCats, setSelectedCats] = useState([])
  const [confirmId, setConfirmId] = useState(null)

  const filtered = entries.filter(e => {
    if (fromDate && e.date < fromDate) return false
    if (toDate   && e.date > toDate)   return false
    if (selectedCats.length && !selectedCats.includes(e.category)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date)
    return b.createdAt.localeCompare(a.createdAt)
  })

  useEffect(() => {
    onFilteredChange?.(filtered)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, fromDate, toDate, selectedCats.join(',')])

  function toggleCat(name) {
    setSelectedCats(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])
  }

  const inputStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    borderRadius: '0.75rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    outline: 'none',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="rounded-2xl p-6 space-y-4" 
           style={{ 
             backgroundColor: 'var(--color-card)', 
             border: '1px solid var(--color-border)',
             boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
           }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-text-secondary)' }}>
            Filters
          </h3>
          {(fromDate || toDate || selectedCats.length > 0) && (
            <button 
              onClick={() => { setFromDate(''); setToDate(''); setSelectedCats([]) }} 
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ color: '#ef4444', backgroundColor: '#ef444422', border: '1px solid #ef444444' }}
            >
              Clear filters
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            From 
            <input 
              type="date" 
              value={fromDate} 
              onChange={e => setFromDate(e.target.value)} 
              style={inputStyle}
            />
          </label>
          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            To 
            <input 
              type="date" 
              value={toDate} 
              onChange={e => setToDate(e.target.value)} 
              style={inputStyle}
            />
          </label>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORY_NAMES.map(name => {
            const cat = CATEGORY_MAP[name]
            const active = selectedCats.includes(name)
            return (
              <button 
                key={name} 
                onClick={() => toggleCat(name)}
                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
                style={active 
                  ? { 
                      backgroundColor: `${cat.color}33`, 
                      color: cat.color,
                      border: `2px solid ${cat.color}`,
                      boxShadow: `0 0 12px ${cat.color}44`
                    } 
                  : { 
                      backgroundColor: 'var(--color-surface)', 
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)'
                    }
                }
              >
                {name}
              </button>
            )
          })}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" 
             style={{ 
               backgroundColor: 'var(--color-card)', 
               border: '2px dashed var(--color-border-bright)',
               boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
             }}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            No entries match the current filters.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" 
             style={{ 
               backgroundColor: 'var(--color-card)', 
               border: '1px solid var(--color-border)',
               boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
             }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-bright)' }}>
                <tr>
                  {['Date', 'Category', 'Activity', 'Duration', 'Notes', ''].map(h => (
                    <th key={h} className="text-left text-xs font-bold uppercase tracking-[0.1em] px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: 'var(--color-border)' }}>
                {sorted.map(entry => {
                  const cat = CATEGORY_MAP[entry.category]
                  const isConfirming = confirmId === entry.id
                  return (
                    <tr key={entry.id} className="hover:bg-opacity-50 transition-colors" 
                        style={{ backgroundColor: isConfirming ? 'rgba(239, 68, 68, 0.1)' : 'transparent' }}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {entry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ 
                            backgroundColor: `${cat?.color}22`,
                            color: cat?.color,
                            border: `1px solid ${cat?.color}44`
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat?.color }} />
                          {cat?.shortName || entry.category}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ color: 'var(--color-text-primary)' }}>
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatDuration(entry.duration)}
                      </td>
                      <td className="px-6 py-4 text-xs max-w-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                        {entry.notes || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {isConfirming ? (
                          <div className="flex items-center gap-2 justify-end">
                            <button 
                              onClick={() => { onDelete(entry.id); setConfirmId(null) }} 
                              className="px-2 py-1 rounded text-xs font-semibold transition-all hover:scale-105"
                              style={{ backgroundColor: '#ef4444', color: 'white', boxShadow: '0 2px 8px #ef444444' }}
                            >
                              ✓
                            </button>
                            <button 
                              onClick={() => setConfirmId(null)} 
                              className="px-2 py-1 rounded text-xs font-semibold transition-all hover:scale-105"
                              style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmId(entry.id)} 
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
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
