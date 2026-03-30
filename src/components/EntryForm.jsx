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

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors[field] ? 'border-red-400' : 'border-gray-300'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputClass('date')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass('category')}>
          <option value="">Select a category…</option>
          {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
        <input type="text" value={form.activity} onChange={e => set('activity', e.target.value)} placeholder="What did you work on?" className={inputClass('activity')} />
        {errors.activity && <p className="text-xs text-red-500 mt-1">{errors.activity}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
        <div className="flex gap-2 mb-2">
          {QUICK_ADD.map(n => (
            <button key={n} type="button" onClick={() => set('duration', String(Number(form.duration || 0) + n))}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
              +{n}
            </button>
          ))}
        </div>
        <input type="number" min="1" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="0" className={inputClass('duration')} />
        {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400">(optional)</span></label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any context or reflection…" className={inputClass('notes')} />
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors">
        Save Entry
      </button>
    </form>
  )
}
