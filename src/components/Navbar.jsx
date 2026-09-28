import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo1 from '../assets/logo1.png'
import { useCart } from '../context/CartContext'
import { useCatalogue, lienBoutique } from '../context/CatalogueContext'

function CartButton() {
  const { items, setOpen } = useCart()
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

// Sous-menu Boutique : deux portes d'entrée, par univers (collections) ou par type d'objet
function BoutiqueSousMenu({ onChoix, compact = false }) {
  const { collectionsActives, categoriesActives } = useCatalogue()
  const colonnes = [
    { titre: 'Collections', items: collectionsActives, cle: 'collection' },
    { titre: 'Objets', items: categoriesActives, cle: 'type' },
  ].filter((c) => c.items.length > 0)

  if (compact) {
    return (
      <div className="flex flex-col gap-3 pl-4 border-l-2 border-[#E87040]/30">
        {colonnes.map(({ titre, items, cle }) => (
          <div key={titre}>
            <p className="font-ui text-[0.65rem] uppercase tracking-[0.2em] text-[#2A1506]/40 mb-1.5">{titre}</p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((it) => (
                <Link key={it.id} to={lienBoutique({ [cle]: it.slug })} state={{ versPieces: true }} onClick={onChoix}
                  className="font-ui text-sm px-3 py-1 rounded-full bg-white border border-[#2A1506]/10 text-[#2A1506]/80 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: it.couleur }} />
                  {it.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-10">
      {colonnes.map(({ titre, items, cle }) => (
        <div key={titre} className="min-w-[10rem]">
          <p className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-[#2A1506]/40 mb-3">{titre}</p>
          <ul className="flex flex-col gap-2">
            {items.map((it) => (
              <li key={it.id}>
                <Link to={lienBoutique({ [cle]: it.slug })} state={{ versPieces: true }} onClick={onChoix}
                  className="group/item font-display text-lg text-[#2A1506] hover:text-[#E87040] transition-colors inline-flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full transition-transform group-hover/item:scale-150" style={{ backgroundColor: it.couleur }} />
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function BoutiqueMenuDesktop() {
  const [ouvert, setOuvert] = useState(false)
  // Ferme le menu après un choix (le lien garde sinon le focus et le rouvre)
  const fermer = () => { setOuvert(false); document.activeElement?.blur() }
  return (
    <div className="relative" onMouseEnter={() => setOuvert(true)} onMouseLeave={() => setOuvert(false)} onFocus={() => setOuvert(true)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOuvert(false)}>
      <NavLink
        to="/boutique"
        onClick={fermer}
        className={({ isActive }) =>
          `font-ui text-sm font-medium tracking-wide transition-colors relative group inline-flex items-center gap-1 ${
            isActive ? 'text-[#E87040]' : 'text-[#2A1506]/70 hover:text-[#2A1506]'
          }`
        }
      >
        Boutique
        <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${ouvert ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute -bottom-0.5 left-0 h-px bg-[#E87040] transition-all duration-300 w-0 group-hover:w-full" />
      </NavLink>
      <AnimatePresence>
        {ouvert && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
          >
            <div className="bg-[#FBF5E9] border border-[#2A1506]/10 rounded-2xl shadow-xl p-6">
              <BoutiqueSousMenu onChoix={fermer} />
              <Link to="/boutique" state={{ versPieces: true }} onClick={fermer}
                className="block mt-5 pt-4 border-t border-dashed border-[#2A1506]/15 font-ui text-xs font-semibold uppercase tracking-widest text-[#E87040] hover:text-[#2A1506] transition-colors">
                Toutes les pièces →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
          {links.map(({ to, label }) => to === '/boutique' ? <BoutiqueMenuDesktop key={to} /> : (
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
      <div className={`md:hidden overflow-y-auto transition-all duration-300 ${open ? 'max-h-[80vh]' : 'max-h-0'}`}>
        <nav className="flex flex-col px-6 pb-6 gap-4 border-t border-[#2A1506]/10 pt-4">
          {links.map(({ to, label }) => (
            <div key={to} className="flex flex-col gap-3">
              <NavLink
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `font-ui text-base font-medium ${isActive ? 'text-[#E87040]' : 'text-[#2A1506]/70'}`
                }
              >
                {label}
              </NavLink>
              {to === '/boutique' && <BoutiqueSousMenu compact onChoix={() => setOpen(false)} />}
            </div>
          ))}
        </nav>
      </div>
    </header>
  )
}
