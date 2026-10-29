// Section Halloween en haut de la boutique : les pièces de la collection « halloween » (voir hooks/useHalloween).
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProduitCarte from './ProduitCarte'
import useHalloween from '../hooks/useHalloween'
import { useCatalogue } from '../context/CatalogueContext'

const ENCRE = '#2A1506'

/* ─── Toile d'araignée accrochée dans un coin (rayons + fils qui pendent entre eux) ─── */
function Toile({ taille = 150, className = '' }) {
  const rayons = 6
  const angles = Array.from({ length: rayons }, (_, i) => (i / (rayons - 1)) * (Math.PI / 2))
  const point = (a, r) => [Math.cos(a) * r, Math.sin(a) * r]
  const tours = [26, 48, 72, 98]
  return (
    <svg viewBox="0 0 120 120" width={taille} height={taille} className={className} aria-hidden="true" fill="none" stroke={ENCRE} strokeLinecap="round">
      {angles.map((a, i) => {
        const [x, y] = point(a, 118)
        return <line key={i} x1="0" y1="0" x2={x} y2={y} strokeWidth="1.6" />
      })}
      {tours.map((r) => (
        <path
          key={r}
          strokeWidth="1.2"
          d={angles.slice(1).reduce((d, a, i) => {
            // chaque fil pend un peu vers le coin entre deux rayons
            const [x, y] = point(a, r)
            const [cx, cy] = point((a + angles[i]) / 2, r * 0.82)
            return `${d} Q ${cx} ${cy} ${x} ${y}`
          }, `M ${point(0, r).join(' ')}`)}
        />
      ))}
    </svg>
  )
}

/* ─── Petite araignée au bout de son fil ─── */
function Araignee({ fil = 70, className = '' }) {
  return (
    <svg viewBox={`0 0 30 ${fil + 26}`} width={30} height={fil + 26} className={className} aria-hidden="true">
      <line x1="15" y1="0" x2="15" y2={fil + 4} stroke={ENCRE} strokeWidth="1" />
      <g transform={`translate(15 ${fil + 12})`} stroke={ENCRE} strokeWidth="1.6" strokeLinecap="round" fill="none">
        {[-1, 1].map((s) => (
          <g key={s} transform={`scale(${s} 1)`}>
            <path d="M3 -3 L9 -8 L12 -3" /><path d="M4 -1 L11 -2 L13 3" /><path d="M4 1 L10 4 L11 9" /><path d="M3 3 L7 8 L7 12" />
          </g>
        ))}
        <circle r="5" fill={ENCRE} stroke="none" />
        <circle cy="-6" r="3" fill={ENCRE} stroke="none" />
      </g>
    </svg>
  )
}

/* ─── Chauve-souris : ailes festonnées, pieds en haut une fois retournée (suspendue) ─── */
export function ChauveSouris({ taille = 46, vole = false, encre = ENCRE }) {
  const aile = 'M0 0 C 8 -10 22 -14 34 -6 C 30 -2 29 3 30 7 C 26 3 21 3 18 7 C 15 3 10 3 7 8 C 6 4 3 2 0 3 Z'
  return (
    <svg viewBox="-36 -18 72 36" width={taille} height={taille / 2} aria-hidden="true" className="overflow-visible">
      {[-1, 1].map((s) => (
        <g key={s} transform={`scale(${s} 1)`}>
          <path d={aile} fill={encre} className={vole ? 'aile-battement' : 'aile-repliee'} style={{ transformOrigin: '0 0' }} />
        </g>
      ))}
      <ellipse cx="0" cy="1" rx="5" ry="8" fill={encre} />
      <path d="M-4 -5 L-5 -12 L-1 -7 Z M4 -5 L5 -12 L1 -7 Z" fill={encre} />
      <circle cx="-2" cy="-3" r="0.9" fill="#E87040" /><circle cx="2" cy="-3" r="0.9" fill="#E87040" />
      <path d="M-2 9 L-2 12 M2 9 L2 12" stroke={encre} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// Trajet de chaque chauve-souris : départ hors champ à gauche, arrivée suspendue au bord haut (droite = position finale)
const VOLS = [
  { droite: '4%', taille: 64, depart: 520, delai: 0.2 },
  { droite: '24%', taille: 46, depart: 360, delai: 0.55 },
  { droite: '44%', taille: 56, depart: 440, delai: 0.9 },
  { droite: '63%', taille: 40, depart: 300, delai: 1.25 },
]

function Vol({ droite, taille, depart, delai }) {
  const reduire = useReducedMotion()
  const [posee, setPosee] = useState(reduire)
  // Animations limitées par l'utilisateur : directement suspendue, sans vol
  if (reduire) {
    return (
      <div className="absolute top-[-3px] z-10 pointer-events-none rotate-180" style={{ right: droite }}>
        <ChauveSouris taille={taille} vole={false} />
      </div>
    )
  }
  return (
    <motion.div
      className="absolute top-[-3px] z-10 pointer-events-none"
      style={{ right: droite }}
      initial={{ x: '-110vw', y: depart * 0.25, rotate: 0 }}
      animate={{ x: ['-110vw', '-45vw', '0vw'], y: [depart * 0.25, -depart * 0.08, 0], rotate: [0, -8, 180] }}
      transition={{ duration: 2.4, delay: delai, ease: 'easeOut', times: [0, 0.6, 1] }}
      onAnimationComplete={() => setPosee(true)}
    >
      <ChauveSouris taille={taille} vole={!posee} />
    </motion.div>
  )
}

export default function SectionHalloween({ onToutVoir }) {
  const halloween = useHalloween()
  const { categoriesParId } = useCatalogue()
  if (!halloween) return null
  const { pieces } = halloween
  // 4 cases au plus : au-delà, la dernière renvoie vers la boutique filtrée
  const MAX = 4
  const montrees = pieces.length > MAX ? pieces.slice(0, MAX - 1) : pieces
  const autres = pieces.length - montrees.length

  return (
    <section id="halloween" aria-labelledby="titre-halloween" className="relative overflow-hidden bg-[#E87040] border-y-2 border-[#2A1506] text-[#2A1506]">
      <Toile taille={170} className="absolute left-0 top-0 w-[110px] h-[110px] md:w-[170px] md:h-[170px]" />
      <Araignee fil={92} className="absolute top-0 left-[66px] hidden xl:block" />
      <Toile taille={110} className="absolute right-0 bottom-0 rotate-180 w-[70px] h-[70px] md:w-[110px] md:h-[110px]" />
      {VOLS.map((v) => <Vol key={v.droite} {...v} />)}

      <div className="relative max-w-[90rem] mx-auto px-6 md:px-16 lg:px-24 pt-20 pb-10 md:pt-16 md:pb-12 grid grid-cols-1 xl:grid-cols-[minmax(0,23rem)_1fr] gap-8 xl:gap-10 items-center">
        <div className="xl:pl-14">
          <p className="font-ui text-[0.65rem] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 whitespace-nowrap">
            Halloween · jusqu'au 2 nov.
          </p>
          <h2 id="titre-halloween" className="font-display font-black leading-[0.9] mb-5" style={{ fontSize: 'clamp(2.6rem, 4.6vw, 4.2rem)' }}>
            Pour tous<br />les <span className="italic text-[#FBF5E9] whitespace-nowrap">31.</span>
          </h2>
          <p className="font-body text-lg leading-relaxed max-w-sm mb-6">
            {pieces.length > 1 ? `${pieces.length} pièces modelées` : 'Une pièce modelée'} à la main, à ressortir chaque année.
            Retrait gratuit à l'atelier pour l'avoir avant le 31.
          </p>
          <button
            onClick={onToutVoir}
            className="font-ui text-xs font-bold uppercase tracking-[0.2em] underline decoration-2 underline-offset-[6px] hover:text-[#FBF5E9] transition-colors"
          >
            Voir dans la boutique →
          </button>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5">
          {montrees.map((p) => (
            <li key={p.id}>
              <ProduitCarte produit={p} categorie={categoriesParId[p.categorie_id]} retourBoutique={1} fond="#FBF5E9" />
            </li>
          ))}
          {autres > 0 && (
            <li>
              <button
                onClick={onToutVoir}
                className="group relative w-full h-full min-h-56 flex flex-col items-center justify-center gap-3 text-center rounded-[2rem] border-2 border-[#2A1506] bg-[#2A1506] text-[#FBF5E9] p-4 transition-all duration-300 hover:-translate-y-1.5 hover:rotate-1 hover:shadow-[6px_6px_0_#FBF5E9]"
              >
                <span className="rotate-180 transition-transform duration-300 group-hover:rotate-[165deg]"><ChauveSouris taille={52} encre="#FBF5E9" /></span>
                <span className="font-display font-black italic leading-none text-[#E87040]" style={{ fontSize: 'clamp(2.8rem, 5vw, 4rem)' }}>+{autres}</span>
                <span className="font-display font-bold text-base md:text-lg leading-tight">{autres > 1 ? 'autres pièces' : 'autre pièce'}<br />d'Halloween</span>
                <span className="font-ui text-[0.65rem] md:text-xs font-bold uppercase tracking-[0.2em] underline decoration-2 underline-offset-4 group-hover:text-[#E87040] transition-colors">Tout voir →</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}

/* ─── Bandeau d'accueil qui renvoie vers la section (même période) ─── */
export function BandeauHalloween({ className = '' }) {
  const halloween = useHalloween()
  if (!halloween) return null
  const n = halloween.pieces.length
  return (
    <Link
      to="/boutique"
      className={`group relative flex items-center justify-center gap-3 md:gap-5 overflow-hidden bg-[#E87040] border-b-2 border-[#2A1506] text-[#2A1506] px-6 py-3 md:py-3.5 ${className}`}
    >
      <Toile taille={56} className="absolute left-0 top-0 hidden sm:block" />
      <span className="shrink-0 rotate-180 transition-transform duration-300 group-hover:rotate-[168deg]"><ChauveSouris taille={34} /></span>
      <span className="font-ui text-[0.65rem] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] leading-relaxed">
        Halloween<span className="hidden sm:inline"> à l'atelier</span> · {n > 1 ? `${n} pièces` : 'une pièce'} à ressortir tous les 31
        <span className="hidden md:inline"> · jusqu'au 2 nov.</span>
      </span>
      <span className="shrink-0 font-ui text-xs font-bold uppercase tracking-[0.2em] underline decoration-2 underline-offset-4 group-hover:text-[#FBF5E9] transition-colors">
        Voir →
      </span>
    </Link>
  )
}
