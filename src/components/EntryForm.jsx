import { useState } from 'react'
import { CATEGORIES } from '../constants/categories.js'
import { toDateString } from '../utils/calculations.js'

const QUICK_ADD = [15, 30, 45, 60]
const emptyForm = (keepDate = '', keepCategory = '') => ({
  date: keepDate || toDateString(),
  category: keepCategory || '',
  activity: '',
  duration: '',
  notes: '',
})

const inputStyle = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-primary)',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
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
    if (!form.category) errs.category = 'Required'
    if (!form.activity.trim()) errs.activity = 'Required'
    if (!form.duration || Number(form.duration) <= 0) errs.duration = 'Must be > 0'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({
      id: crypto.randomUUID(),
      date: form.date,
      category: form.category,
      activity: form.activity.trim(),
      duration: Number(form.duration),
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    })
    setForm(emptyForm(form.date, form.category))
    setErrors({})
  }

  const fieldStyle = (field) => ({ ...inputStyle, ...(errors[field] ? errorBorder : {}) })

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-secondary)' }}>Date</label>
        <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={fieldStyle('date')} />
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
        <div className="flex gap-2 mb-2">
          {QUICK_ADD.map(n => (
            <button key={n} type="button"
              onClick={() => set('duration', String(Number(form.duration || 0) + n))}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-bright)' }}>
              +{n}
            </button>
          ))}
        </div>
        <input type="number" min="1" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="0" style={fieldStyle('duration')} />
        {errors.duration && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.duration}</p>}
      </div>

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
