// Pêle-mêle des témoignages (d'après le croquis de Léa) : cadre en bois, fond de lin, rubans croisés,
// et chaque avis sur un papier accroché par une pince à linge, une punaise, du scotch ou un trombone.
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const BRUN = '#2A1506'
const TYPES = { initiation: 'Initiation', cours: 'Cours', autre: 'Autre', creation: 'Création' }

// Papiers : couleur, rotation, petit décalage pour un accrochage « à la main »
const PAPIERS = ['#FBF5E9', '#F8DDA0', '#F7CBD0', '#CFE0C6', '#FFFDF7', '#E4D9F2']
const ROTATIONS = [-3, 2.5, -1.5, 3.5, -2.5, 1.5, -4, 2]
const DECALAGES = [0, 18, 6, 24, 10, 2, 20, 12]
const ATTACHES = ['pince', 'punaise', 'scotch', 'trombone']

/* ─── Les attaches ─── */
function Pince() {
  return (
    <svg width="22" height="58" viewBox="0 0 22 58" className="absolute -top-8 left-1/2 -translate-x-1/2 rotate-[4deg] drop-shadow-[1px_3px_2px_rgba(42,21,6,0.35)]" aria-hidden="true">
      <rect x="2" y="1" width="8.5" height="56" rx="3" fill="#D9A86C" stroke={BRUN} strokeWidth="1.2" />
      <rect x="11.5" y="1" width="8.5" height="56" rx="3" fill="#E6BA82" stroke={BRUN} strokeWidth="1.2" />
      <path d="M 3 24 h 16 M 3 29 h 16" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="26.5" r="3.5" fill="none" stroke="#8A8A8A" strokeWidth="1.6" />
    </svg>
  )
}

function Punaise({ couleur = '#E87040' }) {
  return (
    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full shadow-[2px_4px_4px_rgba(42,21,6,0.4)]"
      style={{ background: `radial-gradient(circle at 35% 30%, #fff9 0 18%, ${couleur} 22% 100%)` }} aria-hidden="true" />
  )
}

function Scotch() {
  const bande = 'absolute w-20 h-6 bg-[#FFFBEA]/60 backdrop-blur-[1px] shadow-sm [clip-path:polygon(3%_0,97%_4%,100%_50%,96%_100%,2%_95%,0_45%)]'
  return (
    <>
      <span className={`${bande} -top-3 -left-6 -rotate-[32deg]`} aria-hidden="true" />
      <span className={`${bande} -top-3 -right-6 rotate-[30deg]`} aria-hidden="true" />
    </>
  )
}

function Trombone() {
  return (
    <svg width="18" height="46" viewBox="0 0 18 46" className="absolute -top-4 left-7 rotate-[-6deg]" aria-hidden="true">
      <path d="M 12 30 V 8 a 4.5 4.5 0 0 0 -9 0 V 36 a 6 6 0 0 0 12 0 V 12" fill="none" stroke="#7D7D7D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const ATTACHE = {
  pince: () => <Pince />,
  punaise: (i) => <Punaise couleur={['#E87040', '#9BBF90', '#F3D07A', '#D97080'][i % 4]} />,
  scotch: () => <Scotch />,
  trombone: () => <Trombone />,
}

/* ─── Un avis sur son papier ─── */
function Papier({ avis, i }) {
  const reduire = useReducedMotion()
  const rotation = ROTATIONS[i % ROTATIONS.length]
  const attache = ATTACHES[i % ATTACHES.length]
  return (
    <motion.figure
      initial={reduire ? { opacity: 0 } : { opacity: 0, y: -24, rotate: rotation * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, delay: (i % 3) * 0.08 }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
      className="relative self-start p-6 pt-8 shadow-[3px_6px_12px_rgba(42,21,6,0.28)]"
      style={{ background: PAPIERS[i % PAPIERS.length], marginTop: DECALAGES[i % DECALAGES.length] }}
    >
      {ATTACHE[attache](i)}
      <blockquote className="font-body text-[1.05rem] leading-relaxed text-[#2A1506]/85">« {avis.texte} »</blockquote>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mt-5 pt-3 border-t border-dashed border-[#2A1506]/20">
        <span className="shrink-0 max-w-full font-display italic font-bold text-lg text-[#2A1506]">{avis.nom}</span>
        <span className="font-ui text-[0.6rem] font-bold uppercase tracking-widest px-2 py-1 rounded border border-[#2A1506]/30 text-[#2A1506]/60 -rotate-3">
          {TYPES[avis.type] ?? avis.type}
        </span>
      </figcaption>
    </motion.figure>
  )
}

/* ─── Le tableau ─── */
const PREMIERS = 9 // au-delà, bouton « voir plus » pour ne pas transformer le tableau en mur

export default function PeleMele({ commentaires }) {
  const [tout, setTout] = useState(false)
  const affiches = tout ? commentaires : commentaires.slice(0, PREMIERS)

  // Rubans tendus : verticaux aux tiers, horizontaux à intervalle régulier (comme le croquis)
  const ruban = '#F2A0A8'
  const rubansHorizontaux = {
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 34px, ${ruban}cc 34px 36px, ${ruban} 36px 46px, ${ruban}cc 46px 48px, transparent 48px 330px)`,
  }
  const grille = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-12 px-6 md:px-10'
  // Toile de lin : fine trame croisée
  const lin = {
    backgroundColor: '#EADBC2',
    backgroundImage: 'repeating-linear-gradient(0deg, #2A150608 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, #2A150608 0 1px, transparent 1px 4px)',
  }

  return (
    <div>
      {/* cadre en bois */}
      <div className="rounded-2xl p-3 md:p-4 bg-[#C98B4E] border-[3px] border-[#2A1506] shadow-[8px_8px_0_rgba(0,0,0,0.35)]">
        <div className="relative rounded-lg overflow-hidden border-2 border-[#2A1506]/60" style={lin}>
          <div className="absolute inset-0 pointer-events-none" style={rubansHorizontaux} aria-hidden="true" />
          {/* rubans verticaux : même grille que les papiers, un ruban au centre de chaque colonne */}
          <div className={`absolute inset-0 pointer-events-none ${grille}`} aria-hidden="true">
            {[0, 1, 2].map((c) => (
              <span key={c} className={`mx-auto w-3.5 h-full shadow-[1px_0_2px_rgba(42,21,6,0.2)] ${c === 1 ? 'hidden sm:block' : c === 2 ? 'hidden md:block' : 'block'}`} style={{ background: ruban }} />
            ))}
          </div>
          <div className={`relative ${grille} gap-y-14 pt-14 pb-12`}>
            {affiches.map((avis, i) => <Papier key={avis.id} avis={avis} i={i} />)}
          </div>
        </div>
      </div>
      {commentaires.length > PREMIERS && (
        <button onClick={() => setTout((v) => !v)}
          className="mt-6 mx-auto block font-ui font-semibold text-sm px-6 py-3 rounded-xl border-2 border-[#FBF5E9]/30 text-[#FBF5E9] hover:bg-[#FBF5E9] hover:text-[#2A1506] transition-colors">
          {tout ? 'Voir moins' : `Voir les ${commentaires.length - PREMIERS} autres témoignages`}
        </button>
      )}
    </div>
  )
}
