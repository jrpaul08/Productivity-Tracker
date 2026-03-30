import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',        label: 'Dashboard' },
  { to: '/log',     label: 'Log Entry' },
  { to: '/history', label: 'History' },
]

export default function NavBar() {
  return (
    <nav 
      className="sticky top-0 z-50 backdrop-blur-xl" 
      style={{ 
        backgroundColor: 'rgba(15, 21, 32, 0.8)', 
        borderBottom: '1px solid var(--color-border-bright)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" 
               style={{ boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)' }} />
          <span className="font-black text-base tracking-[0.1em] uppercase bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Productivity Tracker
          </span>
        </div>
        <div className="flex items-center gap-2">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'scale-105'
                    : 'hover:scale-105'
                }`
              }
              style={({ isActive }) => isActive
                ? { 
                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)', 
                    color: 'white',
                    boxShadow: '0 4px 16px #2563eb55, inset 0 1px 0 rgba(255,255,255,0.2)'
                  }
                : { 
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'transparent'
                  }
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
