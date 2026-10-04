// Panier illustré vu du dessus (croquis + inspiration de Léa) : panier en fil de fer rose, pièces posées dedans.
// Les pièces sont posées par-dessus, en HTML, sur la zone du fond (en % du dessin).
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const L = 800
const H = 520
// Cadre du dessin : marge autour des anses (qui sortent du panier) et de l'ombre, pour qu'elles ne soient pas coupées
const CADRE = { x: -24, y: 0, l: L + 48, h: H + 12 }
const BORD = { x1: 72, y1: 62, x2: 728, y2: 458 } // intérieur du rebord
const FOND = { x1: 160, y1: 130, x2: 640, y2: 390 } // fond du panier
const TRAIT = '#2A1506'

// Zone du fond en % du dessin, pour placer les pièces
const ZONE_FOND = {
  gauche: ((FOND.x1 - CADRE.x) / CADRE.l) * 100,
  droite: ((FOND.x2 - CADRE.x) / CADRE.l) * 100,
  haut: ((FOND.y1 - CADRE.y) / CADRE.h) * 100,
  bas: ((FOND.y2 - CADRE.y) / CADRE.h) * 100,
}

const lerp = (a, b, t) => a + (b - a) * t
// Point du rectangle intermédiaire entre le rebord (k = 0) et le fond (k = 1)
const cadre = (k) => ({
  x1: lerp(BORD.x1, FOND.x1, k), y1: lerp(BORD.y1, FOND.y1, k),
  x2: lerp(BORD.x2, FOND.x2, k), y2: lerp(BORD.y2, FOND.y2, k),
})

const ROSE = '#F2A0A8'
const ROSE_OMBRE = '#D97080'

// Tous les fils du panier, dessinés deux fois : une ombre décalée puis le fil, pour le relief
function Fils({ couleur }) {
  const montants = []
  const N = 14
  // Montants : du rebord vers le fond, sur les quatre parois
  for (let i = 0; i <= N; i++) {
    const t = i / N
    montants.push(
      [lerp(BORD.x1, BORD.x2, t), BORD.y1, lerp(FOND.x1, FOND.x2, t), FOND.y1],
      [lerp(BORD.x1, BORD.x2, t), BORD.y2, lerp(FOND.x1, FOND.x2, t), FOND.y2],
    )
  }
  for (let i = 1; i < 9; i++) {
    const t = i / 9
    montants.push(
      [BORD.x1, lerp(BORD.y1, BORD.y2, t), FOND.x1, lerp(FOND.y1, FOND.y2, t)],
      [BORD.x2, lerp(BORD.y1, BORD.y2, t), FOND.x2, lerp(FOND.y1, FOND.y2, t)],
    )
  }
  // Fond quadrillé
  const grille = []
  for (let x = FOND.x1 + 40; x < FOND.x2 - 10; x += 40) grille.push([x, FOND.y1, x, FOND.y2])
  for (let y = FOND.y1 + 37; y < FOND.y2 - 10; y += 37) grille.push([FOND.x1, y, FOND.x2, y])
  const rang = cadre(0.5)
  const anse = 'M 58 180 C -4 176, -4 344, 58 340'

  return (
    <g stroke={couleur} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={anse} strokeWidth="9" />
      <path d={anse} strokeWidth="9" transform={`translate(${L} 0) scale(-1 1)`} />
      {montants.map(([x1, y1, x2, y2], i) => <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="5" />)}
      {grille.map(([x1, y1, x2, y2], i) => <line key={`g${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="5" />)}
      <rect x={rang.x1} y={rang.y1} width={rang.x2 - rang.x1} height={rang.y2 - rang.y1} rx="16" strokeWidth="5" />
      <rect x={FOND.x1} y={FOND.y1} width={FOND.x2 - FOND.x1} height={FOND.y2 - FOND.y1} rx="10" strokeWidth="7" />
      <rect x={BORD.x1} y={BORD.y1} width={BORD.x2 - BORD.x1} height={BORD.y2 - BORD.y1} rx="26" strokeWidth="7" />
      <rect x="50" y="40" width="700" height="440" rx="36" strokeWidth="11" />
    </g>
  )
}

// Panier en fil de fer rose vu du dessus (inspiration de Léa) : rebord, parois en perspective, fond quadrillé, deux anses
export function DessinPanier() {
  return (
    <svg viewBox={`${CADRE.x} ${CADRE.y} ${CADRE.l} ${CADRE.h}`} className="block w-full h-auto" aria-hidden="true">
      <rect x={FOND.x1} y={FOND.y1} width={FOND.x2 - FOND.x1} height={FOND.y2 - FOND.y1} rx="10" fill="#FFFFFF" opacity="0.55" />
      <g transform="translate(5 7)" opacity="0.45"><Fils couleur={ROSE_OMBRE} /></g>
      <Fils couleur={ROSE} />
    </svg>
  )
}

// Stickers : étoile à branches (comme les étoiles de l'inspiration)
function Etoile({ branches = 5, couleur, className = '', creux = 0.45 }) {
  const pts = []
  for (let i = 0; i < branches * 2; i++) {
    const r = i % 2 ? 50 * creux : 50
    const a = (Math.PI * i) / branches - Math.PI / 2
    pts.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`)
  }
  return (
    <svg viewBox="-4 -4 108 108" className={className} aria-hidden="true">
      <polygon points={pts.join(' ')} fill={couleur} stroke={TRAIT} strokeOpacity="0.15" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Emplacements des pièces : position (x, y en %), rotation, taille (% de la largeur) ─── */
const DISPOSITIONS = {
  1: [[50, 50, -4, 28]],
  2: [[37, 49, -8, 23], [63, 51, 7, 21]],
  3: [[36, 39, -8, 17], [64, 40, 7, 17], [50, 63, -3, 18]],
  4: [[36, 38, -6, 15.5], [63, 37, 8, 15.5], [37, 63, 5, 15.5], [64, 62, -7, 15.5]],
  5: [[31, 38, -7, 14], [50, 36, 4, 14], [69, 39, -4, 14], [40, 63, 6, 14], [61, 63, -5, 14]],
  6: [[31, 38, -7, 14], [50, 36, 4, 14], [69, 38, -4, 14], [31, 63, 6, 14], [50, 64, -5, 14], [69, 62, 3, 14]],
}

// Au-delà de 6 pièces : quinconce sur le fond, les pièces se chevauchent un peu comme dans un vrai panier
function disposition(n) {
  if (DISPOSITIONS[n]) return DISPOSITIONS[n]
  const colonnes = Math.ceil(Math.sqrt(n * 1.6))
  const rangs = Math.ceil(n / colonnes)
  const { gauche, droite, haut, bas } = ZONE_FOND
  const taille = Math.max(9, 60 / colonnes)
  return Array.from({ length: n }, (_, i) => {
    const c = i % colonnes
    const r = Math.floor(i / colonnes)
    const x = gauche + 7 + ((droite - gauche - 14) * (c + 0.5 + (r % 2 ? 0.25 : -0.15))) / colonnes
    const y = haut + 9 + ((bas - haut - 18) * (r + 0.5)) / rangs
    return [Math.min(droite - 6, x), y, ((i * 37) % 17) - 8, taille]
  })
}

/* ─── Le panier garni ─── */
// pieces : [{ cle, nom, prix, photo, detouree }] — une entrée par exemplaire
export default function PanierIllustre({ pieces }) {
  const reduire = useReducedMotion()
  const [survol, setSurvol] = useState(null)
  const places = disposition(pieces.length)
  const etiquettesVisibles = pieces.length <= 4
  const ratio = CADRE.l / CADRE.h // pour convertir une taille en % de largeur en % de hauteur

  return (
    <div className="relative w-full">
      <Etoile branches={5} couleur="#C9DE6E" className="absolute -top-[2%] right-[3%] w-[11%] rotate-12" />
      <Etoile branches={9} creux={0.6} couleur={ROSE} className="absolute -bottom-[3%] left-[2%] w-[13%] -rotate-6" />
      <DessinPanier />
      <AnimatePresence>
        {pieces.map((piece, i) => {
          const [x, y, rotation, taille] = places[i]
          return (
            <motion.div
              key={piece.cle}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              onMouseEnter={() => setSurvol(i)}
              onMouseLeave={() => setSurvol(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 hover:z-20"
              style={{ left: `${x}%`, top: `${y}%`, width: `${taille}%` }}
            >
              <motion.div
                initial={reduire ? { opacity: 0 } : { opacity: 0, y: -140, rotate: rotation - 25, scale: 1.15 }}
                animate={{ opacity: 1, y: 0, rotate: rotation, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: reduire ? 0 : 0.25 + i * 0.12 }}
                whileHover={{ scale: 1.07, rotate: 0 }}
                className="aspect-square"
              >
                {piece.detouree ? (
                  <img src={piece.detouree} alt={piece.nom} draggable="false"
                    className="w-full h-full object-contain drop-shadow-[0_10px_8px_rgba(42,21,6,0.35)]" />
                ) : (
                  <img src={piece.photo} alt={piece.nom} draggable="false" loading="lazy"
                    className="w-full h-full object-cover rounded-full border-[5px] border-[#FBF5E9] shadow-[0_10px_18px_rgba(42,21,6,0.35)]" />
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Étiquettes écrites à la main, au-dessus de toutes les pièces (toujours visibles s'il y a peu de pièces, sinon au survol) */}
      {pieces.map((piece, i) => {
        const [x, y, , taille] = places[i]
        const visible = etiquettesVisibles || survol === i
        return (
          <motion.span
            key={piece.cle}
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ delay: etiquettesVisibles && !reduire ? 0.7 + i * 0.12 : 0, duration: 0.2 }}
            className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/3 -rotate-3 whitespace-nowrap font-main font-bold text-[clamp(1rem,1.7vw,1.4rem)] leading-none text-[#D97080] bg-[#FBF5E9] px-2.5 pt-1 pb-1.5 rounded-md shadow-[2px_3px_0_rgba(217,112,128,0.35)]"
            style={{ left: `${x}%`, top: `${y + (taille * ratio) / 2}%` }}
          >
            {piece.nom}{piece.prix ? <span className="text-[#2A1506]/55"> · {piece.prix}</span> : null}
          </motion.span>
        )
      })}
    </div>
  )
}
