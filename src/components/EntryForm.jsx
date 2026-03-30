import { useState } from 'react'
import { CATEGORIES } from '../constants/categories.js'
import { toDateString } from '../utils/calculations.js'
import CustomTimePicker from './CustomTimePicker.jsx'

const getCurrentTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

const emptyForm = (keepDate = '', keepCategory = '', keepTime = '') => ({
  date: keepDate || toDateString(),
  time: keepTime || getCurrentTime(),
  category: keepCategory || '',
  activity: '',
  duration: '',
  jobCount: '',
  notes: '',
})

const inputStyle = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-primary)',
  borderRadius: '0.75rem',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
  transition: 'all 0.2s',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
}


const errorBorder = { border: '1px solid #ef4444' }

export default function EntryForm({ onSubmit }) {
  const [form, setForm] = useState(emptyForm())
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!form.time) errs.time = 'Required'
    if (!form.category) errs.category = 'Required'
    if (!form.activity.trim()) errs.activity = 'Required'
    if (!form.duration || Number(form.duration) <= 0) errs.duration = 'Must be > 0'
    if (form.category === 'Job Applications' && (!form.jobCount || Number(form.jobCount) <= 0)) {
      errs.jobCount = 'Must be > 0'
    }
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const entry = {
      id: crypto.randomUUID(),
      date: form.date,
      time: form.time,
      category: form.category,
      activity: form.activity.trim(),
      duration: Number(form.duration),
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    }
    
    // Add jobCount only for Job Applications category
    if (form.category === 'Job Applications' && form.jobCount) {
      entry.jobCount = Number(form.jobCount)
    }
    
    onSubmit(entry)
    setForm(emptyForm(form.date, form.category, getCurrentTime()))
    setErrors({})
  }

  const fieldStyle = (field) => ({ ...inputStyle, ...(errors[field] ? errorBorder : {}) })

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-secondary)' }}>Date</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={fieldStyle('date')} />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Time
          </label>
          <CustomTimePicker 
            value={form.time} 
            onChange={(time) => set('time', time)} 
            error={errors.time}
          />
          {errors.time && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.time}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-secondary)' }}>Category</label>
        <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...fieldStyle('category'), appearance: 'auto' }}>
          <option value="">Select a category…</option>
          {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        {errors.category && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.category}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-secondary)' }}>Activity</label>
        <input type="text" value={form.activity} onChange={e => set('activity', e.target.value)} placeholder="What did you work on?" style={fieldStyle('activity')} />
        {errors.activity && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.activity}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-secondary)' }}>Duration (minutes)</label>
        <input type="number" min="1" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="0" style={fieldStyle('duration')} />
        {errors.duration && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.duration}</p>}
      </div>

      {form.category === 'Job Applications' && (
        <div className="p-4 rounded-xl transition-all duration-300 animate-slideIn" 
             style={{ 
               backgroundColor: 'rgba(16, 185, 129, 0.1)', 
               border: '2px solid rgba(16, 185, 129, 0.3)',
               boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
             }}>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: '#10b981' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Number of Jobs Applied
          </label>
          <input 
            type="number" 
            min="1" 
            value={form.jobCount} 
            onChange={e => set('jobCount', e.target.value)} 
            placeholder="How many jobs did you apply to?"
            style={{
              ...fieldStyle('jobCount'),
              backgroundColor: 'var(--color-surface)',
              border: errors.jobCount ? '1px solid #ef4444' : '1px solid rgba(16, 185, 129, 0.4)',
            }}
          />
          {errors.jobCount && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.jobCount}</p>}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Notes <span style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
        </label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
          placeholder="Any context or reflection…"
          style={{ ...fieldStyle('notes'), resize: 'vertical' }} />
      </div>

      <button type="submit" className="w-full font-semibold text-sm py-3 rounded-xl transition-all hover:brightness-110"
        style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white', boxShadow: '0 4px 20px #2563eb44' }}>
        Save Entry
      </button>
    </form>
  )
}
