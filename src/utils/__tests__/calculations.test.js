import {
  formatDuration, getCategoryTotals,
  getCategoryProgress, getMostNeglectedCategory, getNetworkingDays, toDateString, getWeekRange,
} from '../calculations.js'
import { CATEGORIES } from '../../constants/categories.js'

describe('formatDuration', () => {
  it('formats 0 minutes', () => expect(formatDuration(0)).toBe('0m'))
  it('formats minutes only', () => expect(formatDuration(45)).toBe('45m'))
  it('formats hours only', () => expect(formatDuration(120)).toBe('2h'))
  it('formats hours and minutes', () => expect(formatDuration(90)).toBe('1h 30m'))
  it('handles null/undefined', () => expect(formatDuration(null)).toBe('0m'))
})

describe('getCategoryTotals', () => {
  it('returns zero for every category with no entries', () => {
    const totals = getCategoryTotals([])
    expect(totals['Job Applications']).toBe(0)
    expect(totals['Networking']).toBe(0)
  })

  it('sums minutes per category', () => {
    const entries = [
      { category: 'Job Applications', duration: 60 },
      { category: 'Job Applications', duration: 30 },
      { category: 'Admin', duration: 20 },
    ]
    const totals = getCategoryTotals(entries)
    expect(totals['Job Applications']).toBe(90)
    expect(totals['Admin']).toBe(20)
    expect(totals['Interview Prep']).toBe(0)
  })
})

describe('getCategoryProgress', () => {
  const jobApps = CATEGORIES.find(c => c.name === 'Job Applications')

  it('returns "below" when under daily minimum', () => {
    expect(getCategoryProgress(59, jobApps)).toBe('below')
  })
  it('returns "minimum" when at minimum but below ideal', () => {
    expect(getCategoryProgress(60, jobApps)).toBe('minimum')
    expect(getCategoryProgress(89, jobApps)).toBe('minimum')
  })
  it('returns "ideal" when at or above ideal', () => {
    expect(getCategoryProgress(90, jobApps)).toBe('ideal')
    expect(getCategoryProgress(120, jobApps)).toBe('ideal')
  })
})

describe('getMostNeglectedCategory', () => {
  it('returns category with largest gap from weekly ideal', () => {
    const totals = {
      'Job Applications': 400,
      'Interview Prep': 0,
      'Project Work': 0,
      'Skill Building': 0,
      'Networking': 0,
      'Admin': 0,
    }
    expect(getMostNeglectedCategory(totals).name).toBe('Project Work')
  })

  it('excludes Networking (no numeric ideal)', () => {
    const totals = Object.fromEntries(CATEGORIES.map(c => [c.name, 0]))
    expect(getMostNeglectedCategory(totals).name).not.toBe('Networking')
  })
})

describe('getNetworkingDays', () => {
  it('returns 7-element array, all false with no networking entries', () => {
    const days = getNetworkingDays([])
    expect(days).toHaveLength(7)
    expect(days.every(d => d === false)).toBe(true)
  })

  it('marks the correct day index when a networking entry exists this week', () => {
    const { monday } = getWeekRange()
    const mondayStr = toDateString(monday)
    const days = getNetworkingDays([{ category: 'Networking', date: mondayStr }])
    expect(days[0]).toBe(true)
    expect(days[1]).toBe(false)
  })
})
