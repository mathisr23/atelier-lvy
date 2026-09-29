import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import logo1 from '../assets/logo1.png'
import { useCart } from '../context/CartContext'
import { VENTE_OUVERTE } from '../lib/vente'

function CartButton() {
  const { items, setOpen } = useCart()
  if (!VENTE_OUVERTE) return null // pas de panier tant que la vente en ligne est fermée
  return (
    <button onClick={() => setOpen(true)} className="relative p-1.5 hover:opacity-70 transition-opacity" aria-label="Panier">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2A1506" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {items.length > 0 && (
        <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] rounded-full bg-[#E87040] text-[#FBF5E9] text-[0.6rem] font-ui font-bold flex items-center justify-center px-1">
          {items.reduce((n, i) => n + i.qte, 0)}
        </span>
      )}
    </button>
  )
}

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
      <div className="max-w-7xl mx-auto px-6 py-2 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="hover:opacity-80 transition-opacity">
          <img src={logo1} alt="Léa — Artiste céramiste" className="h-12 md:h-20 w-auto" />
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
          <CartButton />
        </nav>

        {/* Mobile: panier + burger */}
        <div className="md:hidden flex items-center gap-3">
          <CartButton />
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Menu"
          >
            <span className={`block w-6 h-px bg-[#2A1506] transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-[#2A1506] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-[#2A1506] transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
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
