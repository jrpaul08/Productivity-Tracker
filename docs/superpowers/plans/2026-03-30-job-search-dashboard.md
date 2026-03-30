# Job Search Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React + Vite personal time-tracking dashboard that helps a data scientist stay balanced across job-search activities via quick logging, daily progress bars, and a weekly breakdown chart.

**Architecture:** React Context (`EntriesContext`) wraps the whole app and owns all localStorage I/O; every page reads/writes through a `useEntries()` hook. Pure utility functions in `calculations.js` derive all dashboard data from the raw entries array. Three pages (Dashboard, Log, History) wired together with React Router.

**Tech Stack:** React 18, Vite, Tailwind CSS v3, Recharts, React Router v6, Vitest + jsdom (unit tests for utils only), localStorage persistence.

---

## File Map

| File | Role |
|---|---|
| `src/constants/categories.js` | Single source of truth for all 6 categories, colours, targets |
| `src/utils/storage.js` | `getEntries()` / `saveEntries()` — all localStorage access |
| `src/utils/calculations.js` | Pure derived-data functions (totals, progress, formatting) |
| `src/utils/__tests__/storage.test.js` | Unit tests for storage |
| `src/utils/__tests__/calculations.test.js` | Unit tests for calculations |
| `src/test/setup.js` | Vitest global setup (jest-dom matchers) |
| `src/context/EntriesContext.jsx` | Context + Provider; owns state and localStorage sync |
| `src/hooks/useEntries.js` | `useEntries()` consumer hook |
| `src/components/NavBar.jsx` | Persistent top nav with active-link highlighting |
| `src/components/SummaryCard.jsx` | Reusable stat card for Dashboard top row |
| `src/components/Toast.jsx` | Auto-dismissing success/error notification |
| `src/components/CategoryProgressBar.jsx` | One row per category: label, "X/Y min", coloured progress bar, badge |
| `src/components/WeeklyBarChart.jsx` | Recharts grouped bar chart (actual + target bars) |
| `src/components/NetworkingTracker.jsx` | 7 filled/empty circles for networking days |
| `src/components/EntryForm.jsx` | Controlled form for logging an entry |
| `src/components/EntryTable.jsx` | Filterable, sortable table with inline delete confirm |
| `src/pages/Dashboard.jsx` | Assembles summary cards, progress bars, chart, tracker |
| `src/pages/Log.jsx` | Hosts EntryForm, handles submit → context → toast |
| `src/pages/History.jsx` | Hosts EntryTable + filter controls + summary chart |
| `src/App.jsx` | Router + EntriesProvider wrapper |
| `src/main.jsx` | Vite entry point |
| `index.html` | Update title |
| `vite.config.js` | Add Vitest config block |
| `tailwind.config.js` | Generated; set content paths |
| `src/index.css` | Tailwind directives + Inter font import |

---

## Task 1: Scaffold Project

**Files:**
- Modify: `package.json`, `vite.config.js`, `tailwind.config.js`, `src/index.css`, `index.html`
- Create: `src/test/setup.js`

- [ ] **Step 1: Initialise Vite + React in the existing directory**

```bash
cd /Users/jaredpaul/Coding/job-search-dashboard
npm create vite@latest . -- --template react
```

When prompted "Current directory is not empty. Remove existing files and continue?" — answer **y** (the only file, CLAUDE.md, will be restored by git; the docs/ folder Vite won't touch).

Expected output ends with: `Done. Now run: npm install`

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install react-router-dom recharts
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D tailwindcss postcss autoprefixer vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 4: Initialise Tailwind**

```bash
npx tailwindcss init -p
```

Expected: creates `tailwind.config.js` and `postcss.config.js`.

- [ ] **Step 5: Configure Tailwind content paths**

Replace the full contents of `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: Add Tailwind directives and Inter font to index.css**

Replace `src/index.css` in full:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 7: Add Vitest config to vite.config.js**

Replace `vite.config.js` in full:

```js
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

- [ ] **Step 8: Create Vitest setup file**

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 9: Add test script to package.json**

Open `package.json` and add to the `"scripts"` block:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 10: Update page title**

In `index.html`, change the `<title>` tag:

```html
<title>Job Search Dashboard</title>
```

- [ ] **Step 11: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts at `http://localhost:5173`. Open in browser — Vite default page renders. Stop server with Ctrl+C.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React project with Tailwind and Vitest"
```

---

## Task 2: Category Constants

**Files:**
- Create: `src/constants/categories.js`

- [ ] **Step 1: Create the file**

Create `src/constants/categories.js`:

```js
export const CATEGORIES = [
  { name: 'Job Applications', shortName: 'Applications', color: '#4CAF50', dailyMin: 60, dailyIdeal: 90 },
  { name: 'Interview Prep',   shortName: 'Prep',         color: '#2196F3', dailyMin: 45, dailyIdeal: 90 },
  { name: 'Project Work',     shortName: 'Projects',     color: '#9C27B0', dailyMin: 60, dailyIdeal: 120 },
  { name: 'Skill Building',   shortName: 'Skills',       color: '#FF9800', dailyMin: 30, dailyIdeal: 60 },
  { name: 'Networking',       shortName: 'Network',      color: '#F44336', dailyMin: 0,  dailyIdeal: null },
  { name: 'Admin',            shortName: 'Admin',        color: '#E91E8C', dailyMin: 0,  dailyIdeal: 30 },
]

// Lookup by name — use instead of array.find() throughout the app
export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.name, c]))

// Plain list of name strings for dropdowns / validation
export const CATEGORY_NAMES = CATEGORIES.map(c => c.name)
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/categories.js
git commit -m "feat: add category constants"
```

---

## Task 3: Storage Utils (TDD)

**Files:**
- Create: `src/utils/storage.js`
- Create: `src/utils/__tests__/storage.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/utils/__tests__/storage.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest'
import { getEntries, saveEntries } from '../storage.js'

describe('getEntries', () => {
  beforeEach(() => localStorage.clear())

  it('returns empty array when nothing stored', () => {
    expect(getEntries()).toEqual([])
  })

  it('returns empty array when stored value is malformed JSON', () => {
    localStorage.setItem('jsd_entries', 'not-json')
    expect(getEntries()).toEqual([])
  })
})

describe('saveEntries / getEntries round-trip', () => {
  beforeEach(() => localStorage.clear())

  it('persists entries and retrieves them', () => {
    const entries = [{ id: '1', category: 'Admin', duration: 30 }]
    saveEntries(entries)
    expect(getEntries()).toEqual(entries)
  })

  it('overwrites previous entries on second save', () => {
    saveEntries([{ id: '1' }])
    saveEntries([{ id: '2' }])
    expect(getEntries()).toEqual([{ id: '2' }])
  })
})
```

- [ ] **Step 2: Run — confirm tests fail**

```bash
npm test
```

Expected: 4 failures — `Cannot find module '../storage.js'`

- [ ] **Step 3: Implement storage.js**

Create `src/utils/storage.js`:

```js
const KEY = 'jsd_entries'

export function getEntries() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntries(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries))
}
```

- [ ] **Step 4: Run — confirm tests pass**

```bash
npm test
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/storage.js src/utils/__tests__/storage.test.js
git commit -m "feat: add storage utils with tests"
```

---

## Task 4: Calculation Utils — Formatting and Totals (TDD)

**Files:**
- Create: `src/utils/calculations.js`
- Create: `src/utils/__tests__/calculations.test.js`

- [ ] **Step 1: Write failing tests for formatDuration and getCategoryTotals**

Create `src/utils/__tests__/calculations.test.js`:

```js
import { formatDuration, getCategoryTotals } from '../calculations.js'

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
```

- [ ] **Step 2: Run — confirm tests fail**

```bash
npm test
```

Expected: failures — `Cannot find module '../calculations.js'`

- [ ] **Step 3: Implement formatDuration and getCategoryTotals**

Create `src/utils/calculations.js`:

```js
import { CATEGORIES } from '../constants/categories.js'

// ─── Formatting ─────────────────────────────────────────────────────────────

export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// ─── Date helpers ────────────────────────────────────────────────────────────

// Returns "YYYY-MM-DD" for a Date object (local time)
export function toDateString(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Returns the Monday–Sunday Date range for the week containing `now`
export function getWeekRange(now = new Date()) {
  const day = now.getDay() // 0 = Sun
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return { monday, sunday }
}

// ─── Entry filters ───────────────────────────────────────────────────────────

export function getTodayEntries(entries) {
  const today = toDateString()
  return entries.filter(e => e.date === today)
}

export function getWeekEntries(entries) {
  const { monday, sunday } = getWeekRange()
  return entries.filter(e => {
    // Parse as local time to avoid UTC-shift issues
    const d = new Date(e.date + 'T00:00:00')
    return d >= monday && d <= sunday
  })
}

// ─── Aggregation ─────────────────────────────────────────────────────────────

// Returns { [categoryName]: totalMinutes } initialised to 0 for every category
export function getCategoryTotals(entries) {
  const totals = Object.fromEntries(CATEGORIES.map(c => [c.name, 0]))
  entries.forEach(e => {
    if (e.category in totals) totals[e.category] += e.duration
  })
  return totals
}
```

- [ ] **Step 4: Run — confirm tests pass**

```bash
npm test
```

Expected: 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/calculations.js src/utils/__tests__/calculations.test.js
git commit -m "feat: add calculations utils (formatting, totals) with tests"
```

---

## Task 5: Calculation Utils — Progress, Neglect, Networking (TDD)

**Files:**
- Modify: `src/utils/calculations.js`
- Modify: `src/utils/__tests__/calculations.test.js`

- [ ] **Step 1: Add failing tests**

Append to `src/utils/__tests__/calculations.test.js`. First update the import at the top of the file to include the new functions:

```js
import {
  formatDuration, getCategoryTotals,
  getCategoryProgress, getMostNeglectedCategory, getNetworkingDays, toDateString, getWeekRange,
} from '../calculations.js'
import { CATEGORIES } from '../../constants/categories.js'
```

Then append these `describe` blocks after the existing ones:

```js
describe('getCategoryProgress', () => {
  const jobApps = CATEGORIES.find(c => c.name === 'Job Applications') // min:60, ideal:90

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
    // Project Work ideal = 120*5=600; Job Applications ideal = 90*5=450
    const totals = {
      'Job Applications': 400,  // gap = 50
      'Interview Prep': 0,      // gap = 450
      'Project Work': 0,        // gap = 600 ← most neglected
      'Skill Building': 0,
      'Networking': 0,
      'Admin': 0,
    }
    const result = getMostNeglectedCategory(totals)
    expect(result.name).toBe('Project Work')
  })

  it('excludes Networking (no numeric ideal)', () => {
    const totals = Object.fromEntries(CATEGORIES.map(c => [c.name, 0]))
    const result = getMostNeglectedCategory(totals)
    expect(result.name).not.toBe('Networking')
  })
})

describe('getNetworkingDays', () => {
  it('returns 7-element array, all false with no networking entries', () => {
    const days = getNetworkingDays([])
    expect(days).toHaveLength(7)
    expect(days.every(d => d === false)).toBe(true)
  })

  it('marks the correct day index when a networking entry exists this week', () => {
    // Create an entry for Monday of the current week
    const { monday } = getWeekRange()
    const mondayStr = toDateString(monday)
    const entries = [{ category: 'Networking', date: mondayStr }]
    const days = getNetworkingDays(entries)
    expect(days[0]).toBe(true)  // Monday = index 0
    expect(days[1]).toBe(false)
  })
})
```

- [ ] **Step 2: Run — confirm new tests fail**

```bash
npm test
```

Expected: the 3 new describe blocks fail — functions not found.

- [ ] **Step 3: Append implementations to calculations.js**

Add to the bottom of `src/utils/calculations.js`:

```js
// ─── Progress classification ─────────────────────────────────────────────────

// Returns 'below' | 'minimum' | 'ideal'
export function getCategoryProgress(minutes, category) {
  if (minutes >= category.dailyIdeal) return 'ideal'
  if (minutes >= category.dailyMin) return 'minimum'
  return 'below'
}

// ─── Neglect detection ───────────────────────────────────────────────────────

// Returns the CATEGORIES entry with the largest gap between logged and ideal (weekly).
// Excludes categories with no numeric ideal (Networking).
export function getMostNeglectedCategory(weeklyTotals) {
  let maxGap = -Infinity
  let neglected = null
  CATEGORIES.forEach(cat => {
    if (cat.dailyIdeal === null) return
    const weeklyIdeal = cat.dailyIdeal * 5
    const gap = weeklyIdeal - (weeklyTotals[cat.name] || 0)
    if (gap > maxGap) {
      maxGap = gap
      neglected = cat
    }
  })
  return neglected
}

// ─── Networking tracker ──────────────────────────────────────────────────────

// Returns boolean[7] — index 0 = Monday, 6 = Sunday.
// true means at least one Networking entry that day.
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
```

- [ ] **Step 4: Run — confirm all tests pass**

```bash
npm test
```

Expected: all tests pass (no failures).

- [ ] **Step 5: Commit**

```bash
git add src/utils/calculations.js src/utils/__tests__/calculations.test.js
git commit -m "feat: add progress, neglect, and networking calculations with tests"
```

---

## Task 6: EntriesContext + useEntries Hook

**Files:**
- Create: `src/context/EntriesContext.jsx`
- Create: `src/hooks/useEntries.js`

- [ ] **Step 1: Create EntriesContext**

Create `src/context/EntriesContext.jsx`:

```jsx
import { createContext, useContext, useState, useCallback } from 'react'
import { getEntries, saveEntries } from '../utils/storage.js'

const EntriesContext = createContext(null)

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState(() => getEntries())

  const addEntry = useCallback((entry) => {
    setEntries(prev => {
      const next = [entry, ...prev]
      saveEntries(next)
      return next
    })
  }, [])

  const deleteEntry = useCallback((id) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id)
      saveEntries(next)
      return next
    })
  }, [])

  return (
    <EntriesContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </EntriesContext.Provider>
  )
}

export { EntriesContext }
```

- [ ] **Step 2: Create useEntries hook**

Create `src/hooks/useEntries.js`:

```js
import { useContext } from 'react'
import { EntriesContext } from '../context/EntriesContext.jsx'

export function useEntries() {
  const ctx = useContext(EntriesContext)
  if (!ctx) throw new Error('useEntries must be used inside EntriesProvider')
  return ctx
}
```

- [ ] **Step 3: Commit**

```bash
git add src/context/EntriesContext.jsx src/hooks/useEntries.js
git commit -m "feat: add EntriesContext and useEntries hook"
```

---

## Task 7: App Routing + NavBar

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`
- Create: `src/components/NavBar.jsx`
- Create: `src/pages/Dashboard.jsx` (skeleton)
- Create: `src/pages/Log.jsx` (skeleton)
- Create: `src/pages/History.jsx` (skeleton)

- [ ] **Step 1: Create NavBar**

Create `src/components/NavBar.jsx`:

```jsx
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',        label: 'Dashboard' },
  { to: '/log',     label: 'Log Entry' },
  { to: '/history', label: 'History' },
]

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-14">
        <span className="font-semibold text-gray-800 mr-4">Job Search</span>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `text-sm font-medium pb-0.5 border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create page skeletons**

Create `src/pages/Dashboard.jsx`:

```jsx
export default function Dashboard() {
  return <div className="p-6"><h1 className="text-xl font-semibold">Dashboard</h1></div>
}
```

Create `src/pages/Log.jsx`:

```jsx
export default function Log() {
  return <div className="p-6"><h1 className="text-xl font-semibold">Log Entry</h1></div>
}
```

Create `src/pages/History.jsx`:

```jsx
export default function History() {
  return <div className="p-6"><h1 className="text-xl font-semibold">History</h1></div>
}
```

- [ ] **Step 3: Wire up App.jsx**

Replace `src/App.jsx` in full:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EntriesProvider } from './context/EntriesContext.jsx'
import NavBar from './components/NavBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Log from './pages/Log.jsx'
import History from './pages/History.jsx'

export default function App() {
  return (
    <EntriesProvider>
      <BrowserRouter>
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<Log />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </BrowserRouter>
    </EntriesProvider>
  )
}
```

- [ ] **Step 4: Update main.jsx to remove default CSS import**

Replace `src/main.jsx` in full:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 5: Verify routing works**

```bash
npm run dev
```

Open `http://localhost:5173`. You should see the nav bar and "Dashboard" heading. Click Log Entry and History — each shows its heading. Active nav link should be blue. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/main.jsx src/components/NavBar.jsx src/pages/Dashboard.jsx src/pages/Log.jsx src/pages/History.jsx
git commit -m "feat: add routing, NavBar, and page skeletons"
```

---

## Task 8: SummaryCard + Toast Components

**Files:**
- Create: `src/components/SummaryCard.jsx`
- Create: `src/components/Toast.jsx`

- [ ] **Step 1: Create SummaryCard**

Create `src/components/SummaryCard.jsx`:

```jsx
// Props: label (string), value (string|number), sub (optional string)
export default function SummaryCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  )
}
```

- [ ] **Step 2: Create Toast**

Create `src/components/Toast.jsx`:

```jsx
import { useEffect } from 'react'

// Props: message (string), onClose (fn), duration (ms, default 2500)
export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
      <span className="text-green-400">✓</span>
      {message}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SummaryCard.jsx src/components/Toast.jsx
git commit -m "feat: add SummaryCard and Toast components"
```

---

## Task 9: CategoryProgressBar Component

**Files:**
- Create: `src/components/CategoryProgressBar.jsx`

- [ ] **Step 1: Create CategoryProgressBar**

Create `src/components/CategoryProgressBar.jsx`:

```jsx
import { getCategoryProgress, formatDuration } from '../utils/calculations.js'

// Props: category (CATEGORIES entry), minutesToday (number)
export default function CategoryProgressBar({ category, minutesToday }) {
  const status = getCategoryProgress(minutesToday, category)

  const barColors = {
    below:   'bg-red-400',
    minimum: 'bg-yellow-400',
    ideal:   'bg-green-400',
  }

  const target = category.dailyIdeal ?? category.dailyMin
  const pct = target > 0 ? Math.min((minutesToday / target) * 100, 100) : 0

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Colour dot + name */}
      <div className="flex items-center gap-2 w-36 shrink-0">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <span className="text-sm font-medium text-gray-700 truncate">{category.name}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColors[status]}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Minutes label */}
      <span className="text-xs text-gray-500 w-24 text-right shrink-0">
        {formatDuration(minutesToday)} / {formatDuration(category.dailyMin || category.dailyIdeal || 0)}
      </span>

      {/* Behind badge */}
      {status === 'below' && category.dailyMin > 0 && (
        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded shrink-0">
          ⚠ behind
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CategoryProgressBar.jsx
git commit -m "feat: add CategoryProgressBar component"
```

---

## Task 10: WeeklyBarChart Component

**Files:**
- Create: `src/components/WeeklyBarChart.jsx`

- [ ] **Step 1: Create WeeklyBarChart**

Create `src/components/WeeklyBarChart.jsx`:

```jsx
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, Legend,
} from 'recharts'
import { CATEGORIES } from '../constants/categories.js'
import { getCategoryTotals } from '../utils/calculations.js'

// Props:
//   entries     — array of entries to summarise
//   showIdeal   — whether to render the weekly-target bars (default true)
//   title       — optional string shown above chart
export default function WeeklyBarChart({ entries, showIdeal = true, title }) {
  const totals = getCategoryTotals(entries)

  const data = CATEGORIES.map(cat => ({
    name: cat.shortName,
    actual: totals[cat.name] || 0,
    // Weekly ideal = dailyIdeal × 5; null for Networking (no target)
    target: showIdeal && cat.dailyIdeal ? cat.dailyIdeal * 5 : undefined,
    color: cat.color,
  }))

  return (
    <div>
      {title && <h3 className="text-sm font-semibold text-gray-600 mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} barCategoryGap="30%">
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="m" width={36} />
          <Tooltip
            formatter={(value, name) => [
              `${value} min`,
              name === 'actual' ? 'This week' : 'Weekly target',
            ]}
          />
          {showIdeal && <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} />}

          {/* Actual minutes — each bar uses its category colour */}
          <Bar dataKey="actual" name="actual" maxBarSize={40}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Bar>

          {/* Weekly target — transparent bars with dashed border */}
          {showIdeal && (
            <Bar
              dataKey="target"
              name="target"
              maxBarSize={40}
              fill="transparent"
              stroke="#9ca3af"
              strokeDasharray="4 2"
              strokeWidth={1.5}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WeeklyBarChart.jsx
git commit -m "feat: add WeeklyBarChart component"
```

---

## Task 11: NetworkingTracker Component

**Files:**
- Create: `src/components/NetworkingTracker.jsx`

- [ ] **Step 1: Create NetworkingTracker**

Create `src/components/NetworkingTracker.jsx`:

```jsx
import { getNetworkingDays } from '../utils/calculations.js'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const NETWORKING_COLOR = '#F44336'

// Props: weekEntries — entries for the current week only
export default function NetworkingTracker({ weekEntries }) {
  const days = getNetworkingDays(weekEntries)
  const filledCount = days.filter(Boolean).length

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        {days.map((filled, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span
              className="text-xl leading-none select-none"
              style={{ color: filled ? NETWORKING_COLOR : '#d1d5db' }}
              title={filled ? 'Networking logged' : 'No networking'}
            >
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/NetworkingTracker.jsx
git commit -m "feat: add NetworkingTracker component"
```

---

## Task 12: Dashboard Page

**Files:**
- Modify: `src/pages/Dashboard.jsx`

- [ ] **Step 1: Replace Dashboard skeleton with full implementation**

Replace `src/pages/Dashboard.jsx` in full:

```jsx
import { Link } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries.js'
import { CATEGORIES } from '../constants/categories.js'
import {
  getTodayEntries, getWeekEntries, getCategoryTotals,
  getMostNeglectedCategory, formatDuration,
} from '../utils/calculations.js'
import SummaryCard from '../components/SummaryCard.jsx'
import CategoryProgressBar from '../components/CategoryProgressBar.jsx'
import WeeklyBarChart from '../components/WeeklyBarChart.jsx'
import NetworkingTracker from '../components/NetworkingTracker.jsx'

export default function Dashboard() {
  const { entries } = useEntries()

  const todayEntries = getTodayEntries(entries)
  const weekEntries  = getWeekEntries(entries)

  const todayTotals  = getCategoryTotals(todayEntries)
  const weekTotals   = getCategoryTotals(weekEntries)

  const todayMinutes = Object.values(todayTotals).reduce((a, b) => a + b, 0)
  const weekMinutes  = Object.values(weekTotals).reduce((a, b) => a + b, 0)

  const appsThisWeek = weekEntries.filter(e => e.category === 'Job Applications').length
  const neglected    = getMostNeglectedCategory(weekTotals)

  const hasEntriesToday = todayEntries.length > 0

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Today" value={formatDuration(todayMinutes)} />
        <SummaryCard label="This Week" value={formatDuration(weekMinutes)} />
        <SummaryCard label="Applications (week)" value={appsThisWeek} sub="entries logged" />
        <SummaryCard
          label="Most Neglected"
          value={neglected?.shortName ?? '—'}
          sub="vs weekly target"
        />
      </div>

      {/* Daily progress */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Today's Progress
        </h2>

        {!hasEntriesToday ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
            Nothing logged yet today —{' '}
            <Link to="/log" className="text-blue-600 font-medium hover:underline">
              start your first entry →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 px-4">
            {CATEGORIES.map(cat => (
              <CategoryProgressBar
                key={cat.name}
                category={cat}
                minutesToday={todayTotals[cat.name] || 0}
              />
            ))}
          </div>
        )}

      </section>

      {/* Weekly bar chart */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          This Week
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <WeeklyBarChart entries={weekEntries} showIdeal title="Minutes per category (Mon–Sun)" />
        </div>
      </section>

      {/* Networking tracker */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Networking Days
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <NetworkingTracker weekEntries={weekEntries} />
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify Dashboard renders**

```bash
npm run dev
```

Open `http://localhost:5173`. With no entries, you should see:
- Four summary cards showing 0s
- "Nothing logged yet today — start your first entry →" empty state

Stop server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Dashboard.jsx
git commit -m "feat: build out Dashboard page"
```

---

## Task 13: EntryForm Component

**Files:**
- Create: `src/components/EntryForm.jsx`

- [ ] **Step 1: Create EntryForm**

Create `src/components/EntryForm.jsx`:

```jsx
import { useState } from 'react'
import { CATEGORIES, CATEGORY_NAMES } from '../constants/categories.js'
import { toDateString } from '../utils/calculations.js'

const QUICK_ADD = [15, 30, 45, 60]

const emptyForm = (keepDate = '', keepCategory = '') => ({
  date: keepDate || toDateString(),
  category: keepCategory || '',
  activity: '',
  duration: '',
  notes: '',
})

// Props: onSubmit(entry) — called with a validated entry object ready to save
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

    // Keep date + category for fast repeat logging
    setForm(emptyForm(form.date, form.category))
    setErrors({})
  }

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={e => set('date', e.target.value)}
          className={inputClass('date')}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={form.category}
          onChange={e => set('category', e.target.value)}
          className={inputClass('category')}
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
      </div>

      {/* Activity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
        <input
          type="text"
          value={form.activity}
          onChange={e => set('activity', e.target.value)}
          placeholder="What did you work on?"
          className={inputClass('activity')}
        />
        {errors.activity && <p className="text-xs text-red-500 mt-1">{errors.activity}</p>}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
        <div className="flex gap-2 mb-2">
          {QUICK_ADD.map(n => (
            <button
              key={n}
              type="button"
              onClick={() => set('duration', String(Number(form.duration || 0) + n))}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              +{n}
            </button>
          ))}
        </div>
        <input
          type="number"
          min="1"
          value={form.duration}
          onChange={e => set('duration', e.target.value)}
          placeholder="0"
          className={inputClass('duration')}
        />
        {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400">(optional)</span></label>
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          rows={3}
          placeholder="Any context or reflection…"
          className={inputClass('notes')}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
      >
        Save Entry
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EntryForm.jsx
git commit -m "feat: add EntryForm component"
```

---

## Task 14: Log Page

**Files:**
- Modify: `src/pages/Log.jsx`

- [ ] **Step 1: Replace Log skeleton with full implementation**

Replace `src/pages/Log.jsx` in full:

```jsx
import { useState, useCallback } from 'react'
import { useEntries } from '../hooks/useEntries.js'
import EntryForm from '../components/EntryForm.jsx'
import Toast from '../components/Toast.jsx'

export default function Log() {
  const { addEntry } = useEntries()
  const [toast, setToast] = useState(null)

  const handleSubmit = useCallback((entry) => {
    addEntry(entry)
    setToast('Entry saved ✓')
  }, [addEntry])

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Log Entry</h1>
      <EntryForm onSubmit={handleSubmit} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
```

- [ ] **Step 2: Verify Log page works end-to-end**

```bash
npm run dev
```

1. Navigate to `/log`
2. Fill in all fields and click Save Entry
3. Toast "Entry saved ✓" should appear and dismiss after ~2.5s
4. Form should clear activity/duration/notes but retain date and category
5. Navigate to `/` — Dashboard summary cards should now show non-zero values

Stop server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Log.jsx
git commit -m "feat: build out Log page"
```

---

## Task 15: EntryTable Component

**Files:**
- Create: `src/components/EntryTable.jsx`

**Note:** EntryTable owns filter state and calls `onFilteredChange(filtered)` whenever filters change so the History page can pass the filtered list to the summary chart.

- [ ] **Step 1: Create EntryTable**

Create `src/components/EntryTable.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { CATEGORY_MAP, CATEGORY_NAMES } from '../constants/categories.js'
import { formatDuration } from '../utils/calculations.js'

// Props:
//   entries           — full entries array (all time)
//   onDelete(id)      — called after user confirms deletion
//   onFilteredChange  — called with the filtered entries array whenever filters change
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

  // Notify parent whenever filtered set changes
  useEffect(() => {
    onFilteredChange?.(filtered)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, fromDate, toDate, selectedCats.join(',')])

  function toggleCat(name) {
    setSelectedCats(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    )
  }

  const inputClass = 'border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-600">Filters</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-1.5 text-sm text-gray-600">
            From
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className={inputClass} />
          </label>
          <label className="flex items-center gap-1.5 text-sm text-gray-600">
            To
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className={inputClass} />
          </label>
          {(fromDate || toDate || selectedCats.length > 0) && (
            <button
              onClick={() => { setFromDate(''); setToDate(''); setSelectedCats([]) }}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_NAMES.map(name => {
            const cat = CATEGORY_MAP[name]
            const active = selectedCats.includes(name)
            return (
              <button
                key={name}
                onClick={() => toggleCat(name)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  active ? 'text-white' : 'text-gray-600 bg-white border-gray-300 hover:border-gray-400'
                }`}
                style={active ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
              >
                {name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No entries match the current filters.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Category', 'Activity', 'Duration', 'Notes', ''].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map(entry => {
                  const cat = CATEGORY_MAP[entry.category]
                  const isConfirming = confirmId === entry.id
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{entry.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: cat?.color + '22', color: cat?.color }}
                        >
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{entry.activity}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDuration(entry.duration)}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{entry.notes || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {isConfirming ? (
                          <span className="flex items-center gap-2 justify-end">
                            <span className="text-xs text-gray-500">Delete?</span>
                            <button
                              onClick={() => { onDelete(entry.id); setConfirmId(null) }}
                              className="text-xs font-semibold text-red-600 hover:underline"
                            >Yes</button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-xs text-gray-400 hover:underline"
                            >No</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmId(entry.id)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            Delete
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EntryTable.jsx
git commit -m "feat: add EntryTable component with filters and inline delete"
```

---

## Task 16: History Page

**Files:**
- Modify: `src/pages/History.jsx`

- [ ] **Step 1: Replace History skeleton with full implementation**

Replace `src/pages/History.jsx` in full:

```jsx
import { useState } from 'react'
import { useEntries } from '../hooks/useEntries.js'
import EntryTable from '../components/EntryTable.jsx'
import WeeklyBarChart from '../components/WeeklyBarChart.jsx'

export default function History() {
  const { entries, deleteEntry } = useEntries()
  const [filteredEntries, setFilteredEntries] = useState(entries)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">History</h1>

      <EntryTable
        entries={entries}
        onDelete={deleteEntry}
        onFilteredChange={setFilteredEntries}
      />

      {filteredEntries.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <WeeklyBarChart
            entries={filteredEntries}
            showIdeal={false}
            title="Total minutes per category (filtered range)"
          />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify full app end-to-end**

```bash
npm run dev
```

Smoke-test checklist:
1. Log 2-3 entries across different categories at `/log` — toast appears, form partially resets
2. Dashboard (`/`) shows updated totals in summary cards, progress bars with correct colours, the chart bars, and networking circles
3. History (`/history`) shows all entries in the table, newest first
4. Apply a category filter — table and chart update together
5. Click Delete on a row, click "No" — entry survives. Click Delete again, click "Yes" — entry removed from table and Dashboard

- [ ] **Step 3: Commit**

```bash
git add src/pages/History.jsx
git commit -m "feat: build out History page with filters and summary chart"
```

---

## Task 17: Clean up and remove dead Vite boilerplate

**Files:**
- Modify: `src/App.jsx` (remove default App.css import if present)
- Delete: `src/App.css`, `src/assets/react.svg`, `public/vite.svg` (if they exist)

- [ ] **Step 1: Remove Vite boilerplate assets**

```bash
rm -f src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 2: Run all tests to confirm nothing is broken**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Run dev server one final time**

```bash
npm run dev
```

Verify the app loads without console errors. Stop server.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove Vite boilerplate files"
```

---

## Notes & Deviations from Spec

1. **`EntryTable` callback pattern** — `EntryTable` owns its own filter state and calls `onFilteredChange(filtered)` on every filter change. `History.jsx` stores the result in `filteredEntries` state and passes it to the summary chart. This keeps the component self-contained while still sharing filtered data upward.

2. **WeeklyBarChart ideal representation** — The spec says "dashed reference line per category." Recharts has no native per-bar reference lines on a categorical axis. Instead the chart shows a transparent dashed-border bar for the weekly target alongside the actual bar. Visual effect is equivalent.

3. **Duration quick-add buttons are additive** — Clicking +30 adds 30 to whatever is already in the duration field.

4. **`shortName` added to categories** — X-axis labels on the chart use shortened names (e.g., "Applications" instead of "Job Applications") to avoid overlap.
