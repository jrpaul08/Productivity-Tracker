import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',        label: 'Dashboard' },
  { to: '/log',     label: 'Log Entry' },
  { to: '/history', label: 'History' },
]

export default function NavBar() {
  return (
    <nav style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }} className="sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-8 h-14">
        <span className="font-bold text-sm tracking-widest uppercase" style={{ color: 'var(--color-text-secondary)', letterSpacing: '0.15em' }}>
          Job Search
        </span>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-1.5 rounded-md transition-all ${
                  isActive
                    ? 'text-white'
                    : 'hover:text-white'
                }`
              }
              style={({ isActive }) => isActive
                ? { backgroundColor: 'var(--color-border-bright)', color: 'white' }
                : { color: 'var(--color-text-secondary)' }
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
