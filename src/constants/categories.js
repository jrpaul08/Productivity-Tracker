export const CATEGORIES = [
  { name: 'Job Applications', shortName: 'Applications', color: '#10b981', dailyMin: 60, dailyIdeal: 90 },
  { name: 'Interview Prep',   shortName: 'Prep',         color: '#2196F3', dailyMin: 45, dailyIdeal: 90 },
  { name: 'Project Work',     shortName: 'Projects',     color: '#9C27B0', dailyMin: 60, dailyIdeal: 120 },
  { name: 'Skill Building',   shortName: 'Skills',       color: '#FF9800', dailyMin: 30, dailyIdeal: 60 },
  { name: 'Networking',       shortName: 'Network',      color: '#F44336', dailyMin: 0,  dailyIdeal: null },
  { name: 'Other Work',       shortName: 'Other',        color: '#E91E8C', dailyMin: 0,  dailyIdeal: 30 },
]

// Lookup by name — use instead of array.find() throughout the app
export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.name, c]))

// Plain list of name strings for dropdowns / validation
export const CATEGORY_NAMES = CATEGORIES.map(c => c.name)
