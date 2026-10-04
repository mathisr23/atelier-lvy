// Pêle-mêle des témoignages (croquis + inspiration de Léa) : grille murale en fil doré, avis sur des cartes
// à bords festonnés ou en vichy, accrochés par une pince à linge, une punaise, du scotch ou un trombone, + stickers.
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Fleur } from './Graphique'
import photoBol from '../assets/IMG_4948.JPG'
import photoVase from '../assets/IMG_5006.JPG'

const BRUN = '#2A1506'
const TYPES = { initiation: 'Initiation', cours: 'Cours', autre: 'Autre', creation: 'Création' }

// Cadres des cartes : festons de couleur ou vichy, en alternance
const CADRES = [
  { type: 'feston', couleur: '#F2A0A8' },
  { type: 'vichy', couleur: '#9BBF90' },
  { type: 'feston', couleur: '#C9DE6E' },
  { type: 'feston', couleur: '#F3D07A' },
  { type: 'vichy', couleur: '#F2A0A8' },
  { type: 'feston', couleur: '#C9B8E8' },
]
const ROTATIONS = [-3, 2.5, -1.5, 3.5, -2.5, 1.5, -4, 2]
const DECALAGES = [0, 18, 6, 24, 10, 2, 20, 12]
const ATTACHES = ['trombone', 'punaise', 'scotch', 'pince']

// Bord festonné : demi-cercles sur les quatre côtés + aplat central (fond CSS, aucune image)
const R = 7
function styleCadre({ type, couleur }) {
  if (type === 'vichy') {
    return {
      padding: 12,
      background: `repeating-linear-gradient(0deg, ${couleur}99 0 7px, transparent 7px 14px), repeating-linear-gradient(90deg, ${couleur}99 0 7px, transparent 7px 14px), #FFFDF7`,
    }
  }
  const rond = (pos) => `radial-gradient(circle at ${pos}, ${couleur} ${R}px, transparent ${R + 0.5}px)`
  return {
    padding: R + 7,
    background: [
      `${rond('50% 100%')} top left / ${2 * R}px ${R}px repeat-x`,
      `${rond('50% 0')} bottom left / ${2 * R}px ${R}px repeat-x`,
      `${rond('100% 50%')} top left / ${R}px ${2 * R}px repeat-y`,
      `${rond('0 50%')} top right / ${R}px ${2 * R}px repeat-y`,
      `linear-gradient(${couleur}, ${couleur}) center / calc(100% - ${2 * R}px) calc(100% - ${2 * R}px) no-repeat`,
    ].join(', '),
  }
}

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
      className="relative self-start drop-shadow-[3px_6px_6px_rgba(42,21,6,0.25)]"
      style={{ ...styleCadre(CADRES[i % CADRES.length]), marginTop: DECALAGES[i % DECALAGES.length] }}
    >
      {ATTACHE[attache](i)}
      <div className="bg-[#FFFDF7] px-5 pt-6 pb-4">
        <blockquote className="font-body text-[1.05rem] leading-relaxed text-[#2A1506]/85">« {avis.texte} »</blockquote>
        <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mt-4 pt-3 border-t border-dashed border-[#2A1506]/20">
          <span className="shrink-0 max-w-full font-main font-bold text-2xl leading-none text-[#2A1506]">{avis.nom}</span>
          <span className="font-ui text-[0.6rem] font-bold uppercase tracking-widest px-2 py-1 rounded border border-[#2A1506]/30 text-[#2A1506]/60 -rotate-3">
            {TYPES[avis.type] ?? avis.type}
          </span>
        </figcaption>
      </div>
    </motion.figure>
  )
}

/* ─── Le tableau ─── */
const PREMIERS = 9 // au-delà, bouton « voir plus » pour ne pas transformer le tableau en mur

function Polaroid({ src, legende, className = '' }) {
  return (
    <div className={`absolute z-10 hidden lg:block bg-white p-2 pb-7 shadow-[3px_6px_10px_rgba(42,21,6,0.3)] ${className}`} aria-hidden="true">
      <img src={src} alt="" loading="lazy" className="w-28 h-28 object-cover" />
      <p className="absolute bottom-1 inset-x-0 text-center font-main text-lg leading-none text-[#2A1506]/70">{legende}</p>
      <Punaise couleur="#D97080" />
    </div>
  )
}

export default function PeleMele({ commentaires }) {
  const [tout, setTout] = useState(false)
  const affiches = tout ? commentaires : commentaires.slice(0, PREMIERS)

  // Grille murale en fil métallique doré : deux traits décalés (fil + ombre) tous les 64 px
  const or = '#C9A15A'
  const grilleMurale = {
    backgroundImage: [
      `linear-gradient(to right, ${or} 0 3px, transparent 3px)`,
      `linear-gradient(to bottom, ${or} 0 3px, transparent 3px)`,
      `linear-gradient(to right, #2A150622 0 3px, transparent 3px)`,
      `linear-gradient(to bottom, #2A150622 0 3px, transparent 3px)`,
    ].join(','),
    backgroundSize: '64px 64px',
    backgroundPosition: '-2px -2px, -2px -2px, 1px 1px, 1px 1px',
  }

  return (
    <div>
      {/* le mur crème */}
      <div className="relative rounded-3xl bg-[#FBF5E9] p-4 sm:p-6 md:p-10">
        <Polaroid src={photoBol} legende="océan" className="-left-12 top-[42%] -rotate-6" />
        <Polaroid src={photoVase} legende="sable" className="-right-5 bottom-16 rotate-[5deg]" />
        <Fleur taille={46} couleur="#F2A0A8" className="absolute z-10 -top-4 right-[18%]" />
        <span className="absolute z-0 hidden md:block -bottom-5 left-[12%] w-36 h-20 rounded-[50%_50%_45%_55%/60%_60%_40%_40%] [background:repeating-linear-gradient(0deg,#B9C8EE99_0_6px,transparent_6px_12px),repeating-linear-gradient(90deg,#B9C8EE99_0_6px,transparent_6px_12px),#fff]" aria-hidden="true" />
        {/* la grille et son cadre en fil */}
        <div className="relative rounded-xl border-[3px] border-[#C9A15A] shadow-[2px_3px_0_#2A150622]" style={grilleMurale}>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-14 px-6 md:px-12 pt-14 pb-12">
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
