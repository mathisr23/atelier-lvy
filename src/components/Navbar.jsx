import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const links = [
  { to: '/', label: 'À propos' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/initiation', label: 'Initiation' },
  { to: '/cours', label: 'Cours' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBF5E9]/90 backdrop-blur-sm border-b border-[#2A1506]/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="font-display text-2xl font-bold tracking-tight text-[#2A1506] hover:text-[#E87040] transition-colors">
          léa.
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `font-ui text-sm font-medium tracking-wide transition-colors relative group ${
                  isActive ? 'text-[#E87040]' : 'text-[#2A1506]/70 hover:text-[#2A1506]'
                }`
              }
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 h-px bg-[#E87040] transition-all duration-300 w-0 group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Menu"
        >
          <span className={`block w-6 h-px bg-[#2A1506] transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-px bg-[#2A1506] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-[#2A1506] transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-64' : 'max-h-0'}`}>
        <nav className="flex flex-col px-6 pb-6 gap-4 border-t border-[#2A1506]/10 pt-4">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-ui text-base font-medium ${isActive ? 'text-[#E87040]' : 'text-[#2A1506]/70'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
