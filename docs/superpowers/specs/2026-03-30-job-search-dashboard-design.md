# Job Search Dashboard — Design Spec
Date: 2026-03-30

## Overview

A personal time-tracking and accountability web app for a data science job search. The problem being solved: tunnel vision on one activity (usually project work) while neglecting others. The app lets the user log time entries quickly, view a live dashboard for balance, and enforces daily minimums per category.

No backend. All data persists in localStorage under `"jsd_entries"`.

---

## Tech Stack

- React (Vite)
- Tailwind CSS
- Recharts
- React Router (3 routes)
- localStorage (no backend)
- JavaScript (no TypeScript)

---

## Data Model

Each entry in `localStorage["jsd_entries"]`:

```json
{
  "id": "uuid",
  "date": "YYYY-MM-DD",
  "category": "Job Applications",
  "activity": "Applied to Acme Corp",
  "duration": 90,
  "notes": "optional string",
  "createdAt": "ISO timestamp"
}
```

---

## Categories & Targets

| Category | Color | Daily Min (min) | Daily Ideal (min) |
|---|---|---|---|
| Job Applications | #4CAF50 | 60 | 90 |
| Interview Prep | #2196F3 | 45 | 90 |
| Project Work | #9C27B0 | 60 | 120 |
| Skill Building | #FF9800 | 30 | 60 |
| Networking | #F44336 | 0 | — (3x/week goal) |
| Admin | #E91E8C | 0 | 30 |

Defined once in `src/constants/categories.js`, imported everywhere.

---

## Architecture

### State Management: React Context + `useEntries` hook

- `EntriesContext` wraps the full app in `App.jsx`
- Loads from localStorage on mount, writes back on every mutation
- Exposes: `entries`, `addEntry(entry)`, `deleteEntry(id)`
- All pages consume via `useEntries()` hook — no prop drilling, no direct localStorage access in components

### File Structure

```
src/
  constants/
    categories.js          # category definitions, colours, targets
  context/
    EntriesContext.jsx     # context + provider
  hooks/
    useEntries.js          # consumer hook
  utils/
    storage.js             # localStorage read/write helpers
    calculations.js        # daily totals, weekly totals, progress, neglect
  components/
    NavBar.jsx
    SummaryCard.jsx
    CategoryProgressBar.jsx
    NetworkingTracker.jsx
    WeeklyBarChart.jsx
    EntryForm.jsx
    EntryTable.jsx
    Toast.jsx
  pages/
    Dashboard.jsx
    Log.jsx
    History.jsx
  App.jsx
  main.jsx
```

---

## Pages

### Dashboard (`/`)

**Summary cards (4):**
1. Total hours logged today
2. Total hours logged this week (Mon–Sun)
3. Applications sent this week (count of Job Applications entries this week)
4. Most neglected category — category with the largest gap between minutes logged this week and its ideal weekly target (ideal daily × 5). Networking excluded (no numeric ideal). Admin included only if it has a target gap.

**Daily progress per category:**
- Name + colour dot
- "X / Y min" logged vs daily minimum
- Progress bar: red (below min) → yellow (≥ min, < ideal) → green (≥ ideal)
- "⚠ behind" badge if below minimum
- Empty state if no entries today: "Nothing logged yet today — start your first entry →" (links to /log)

**Weekly bar chart (Recharts BarChart):**
- X-axis: categories; Y-axis: minutes
- Each bar coloured by category colour
- Dashed reference line per category at ideal weekly target (ideal daily × 5)
- Networking has no reference line (no numeric weekly ideal)

**Networking tracker:**
- 7 circles (Mon–Sun), filled (●) if ≥1 networking entry that day, empty (○) otherwise
- Goal label: "3+ days this week"

### Log Entry (`/log`)

Form fields:
- Date — date picker, default today
- Category — dropdown (6 options)
- Activity — text input
- Duration — number input (minutes) + quick-add buttons: +15, +30, +45, +60 (each button is additive — increments the current value, does not replace it)
- Notes — optional textarea

Validation: category, activity, and duration all required. On submit: save to context/localStorage, show success toast ("Entry saved ✓"), clear activity/duration/notes fields (keep date + category for fast repeat logging).

### History (`/history`)

Table columns: Date | Category (colour badge) | Activity | Duration ("Xh Ym") | Notes | Delete

Filters:
- Date range (from / to date pickers)
- Category (dropdown or multi-select)

Delete: per-row button, requires confirmation before deletion (inline confirmation, not a modal).

Weekly summary chart below table: grouped bar chart (Recharts) showing total minutes per category for the filtered range.

---

## Shared Components

**NavBar:** persistent top bar, links to Dashboard / Log / History. Active link highlighted.

**Toast:** brief success/error notification, auto-dismisses after ~2.5s.

---

## UX & Design

- Light background (white / light grey), no gradients
- Font: Inter or system-ui
- Responsive: single-column stacked layout on mobile
- Times always displayed as "Xh Ym" (never raw minutes)
- Colour usage: category colours on badges, progress bars, chart bars only

---

## Utilities

**`storage.js`:** `getEntries()`, `saveEntries(entries)` — single source of truth for localStorage key `"jsd_entries"`.

**`calculations.js`:** pure functions —
- `getTodayEntries(entries)` — filter to today's date
- `getWeekEntries(entries)` — filter to current Mon–Sun week
- `getDailyTotals(entries)` — minutes per category for a given day
- `getWeeklyTotals(entries)` — minutes per category for a given week
- `getCategoryProgress(todayMinutes, category)` — returns status: `"below"` | `"minimum"` | `"ideal"`
- `getMostNeglectedCategory(weeklyTotals)` — returns category with largest gap from ideal
- `getNetworkingDays(weekEntries)` — returns array of 7 booleans (Mon–Sun) indicating days with ≥1 networking entry
- `formatDuration(minutes)` — "Xh Ym" formatter

---

## Stretch Goals (deferred)

- Weekly review prompt (Sundays)
- CSV export on History page
- Consecutive-day streak counter
