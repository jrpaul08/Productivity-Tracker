import { CATEGORIES } from '../constants/categories.js'

export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function toDateString(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getWeekRange(now = new Date()) {
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return { monday, sunday }
}

export function getTodayEntries(entries) {
  const today = toDateString()
  return entries.filter(e => e.date === today)
}

export function getWeekEntries(entries) {
  const { monday, sunday } = getWeekRange()
  return entries.filter(e => {
    const d = new Date(e.date + 'T00:00:00')
    return d >= monday && d <= sunday
  })
}

export function getCategoryTotals(entries) {
  const totals = Object.fromEntries(CATEGORIES.map(c => [c.name, 0]))
  entries.forEach(e => {
    if (e.category in totals) totals[e.category] += e.duration
  })
  return totals
}

export function getCategoryProgress(minutes, category) {
  if (minutes >= category.dailyIdeal) return 'ideal'
  if (minutes >= category.dailyMin) return 'minimum'
  return 'below'
}

export function getMostNeglectedCategory(weeklyTotals) {
  let maxGap = -Infinity
  let neglected = null
  CATEGORIES.forEach(cat => {
    if (cat.dailyIdeal === null) return
    const gap = cat.dailyIdeal * 5 - (weeklyTotals[cat.name] || 0)
    if (gap > maxGap) { maxGap = gap; neglected = cat }
  })
  return neglected
}

export function getNetworkingDays(weekEntries) {
  const { monday } = getWeekRange()
  const days = Array(7).fill(false)
  weekEntries
    .filter(e => e.category === 'Networking')
    .forEach(e => {
      const d = new Date(e.date + 'T00:00:00')
      const idx = Math.round((d - monday) / (1000 * 60 * 60 * 24))
      if (idx >= 0 && idx < 7) days[idx] = true
    })
  return days
}
