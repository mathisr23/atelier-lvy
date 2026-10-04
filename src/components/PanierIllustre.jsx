// Panier en osier vu du dessus (d'après le croquis de Léa) : bord, parois tressées, fond quadrillé, deux anses.
// Les pièces sont posées par-dessus, en HTML, sur la zone du fond (en % du dessin).
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const L = 800
const H = 520
const BORD = { x1: 70, y1: 60, x2: 730, y2: 460 } // intérieur du rebord
const FOND = { x1: 160, y1: 130, x2: 640, y2: 390 } // fond du panier
const TRAIT = '#2A1506'

// Zone du fond en % du dessin, pour placer les pièces
const ZONE_FOND = {
  gauche: (FOND.x1 / L) * 100,
  droite: (FOND.x2 / L) * 100,
  haut: (FOND.y1 / H) * 100,
  bas: (FOND.y2 / H) * 100,
}

const lerp = (a, b, t) => a + (b - a) * t
// Point du rectangle intermédiaire entre le rebord (k = 0) et le fond (k = 1)
const cadre = (k) => ({
  x1: lerp(BORD.x1, FOND.x1, k), y1: lerp(BORD.y1, FOND.y1, k),
  x2: lerp(BORD.x2, FOND.x2, k), y2: lerp(BORD.y2, FOND.y2, k),
})

function Tressage() {
  const montants = []
  const N = 18
  // Montants de l'osier : du rebord vers le fond, sur les quatre parois
  for (let i = 0; i <= N; i++) {
    const t = i / N
    montants.push(
      [lerp(BORD.x1, BORD.x2, t), BORD.y1, lerp(FOND.x1, FOND.x2, t), FOND.y1],
      [lerp(BORD.x1, BORD.x2, t), BORD.y2, lerp(FOND.x1, FOND.x2, t), FOND.y2],
    )
  }
  for (let i = 1; i < 12; i++) {
    const t = i / 12
    montants.push(
      [BORD.x1, lerp(BORD.y1, BORD.y2, t), FOND.x1, lerp(FOND.y1, FOND.y2, t)],
      [BORD.x2, lerp(BORD.y1, BORD.y2, t), FOND.x2, lerp(FOND.y1, FOND.y2, t)],
    )
  }
  // Rangs de tressage : cadres concentriques entre le rebord et le fond
  const rangs = [0.22, 0.45, 0.7].map(cadre)
  return (
    <g stroke={TRAIT} strokeLinecap="round" fill="none">
      {montants.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.35" strokeWidth="2" />)}
      {rangs.map((r, i) => <rect key={i} x={r.x1} y={r.y1} width={r.x2 - r.x1} height={r.y2 - r.y1} rx={18 - i * 4} strokeOpacity="0.3" strokeWidth="2.5" />)}
    </g>
  )
}

function Fond() {
  const lignes = []
  for (let x = FOND.x1 + 32; x < FOND.x2; x += 32) lignes.push([x, FOND.y1, x, FOND.y2])
  for (let y = FOND.y1 + 29; y < FOND.y2; y += 29) lignes.push([FOND.x1, y, FOND.x2, y])
  return (
    <g>
      <rect x={FOND.x1} y={FOND.y1} width={FOND.x2 - FOND.x1} height={FOND.y2 - FOND.y1} rx="10" fill="#E9C08B" />
      <g stroke={TRAIT} strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round">
        {lignes.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
      </g>
      {/* ombre portée des parois sur le fond */}
      <rect x={FOND.x1} y={FOND.y1} width={FOND.x2 - FOND.x1} height={FOND.y2 - FOND.y1} rx="10" fill="url(#panier-ombre-fond)" />
      <rect x={FOND.x1} y={FOND.y1} width={FOND.x2 - FOND.x1} height={FOND.y2 - FOND.y1} rx="10" fill="none" stroke={TRAIT} strokeOpacity="0.55" strokeWidth="2.5" />
    </g>
  )
}

function Anse({ cote }) {
  // Anse en osier : boucle qui sort du flanc, dessinée à gauche puis retournée pour la droite
  const d = 'M 58 175 C -6 172, -6 348, 58 345'
  return (
    <g transform={cote === 'droite' ? `translate(${L} 0) scale(-1 1)` : undefined}>
      <path d={d} fill="none" stroke={TRAIT} strokeWidth="30" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#C98B4E" strokeWidth="22" strokeLinecap="round" />
      <path d={d} fill="none" stroke={TRAIT} strokeOpacity="0.4" strokeWidth="22" strokeDasharray="3 9" />
    </g>
  )
}

export function DessinPanier() {
  const paroi = (pts, fill) => <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={fill} />
  const { x1, y1, x2, y2 } = BORD
  return (
    <svg viewBox={`0 0 ${L} ${H}`} className="block w-full h-auto" aria-hidden="true">
      <defs>
        <radialGradient id="panier-ombre-fond" cx="50%" cy="50%" r="65%">
          <stop offset="60%" stopColor={TRAIT} stopOpacity="0" />
          <stop offset="100%" stopColor={TRAIT} stopOpacity="0.28" />
        </radialGradient>
      </defs>
      {/* ombre au sol */}
      <rect x="70" y="72" width="690" height="440" rx="40" fill={TRAIT} opacity="0.12" />
      <Anse cote="gauche" />
      <Anse cote="droite" />
      {/* rebord */}
      <rect x="48" y="38" width="704" height="444" rx="34" fill="#C98B4E" stroke={TRAIT} strokeWidth="3" />
      <rect x="58" y="48" width="684" height="424" rx="28" fill="none" stroke={TRAIT} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="10 7" />
      {/* parois : légères variations de ton pour le relief */}
      {paroi([[x1, y1], [x2, y1], [FOND.x2, FOND.y1], [FOND.x1, FOND.y1]], '#CF935A')}
      {paroi([[x1, y1], [FOND.x1, FOND.y1], [FOND.x1, FOND.y2], [x1, y2]], '#D79D62')}
      {paroi([[x2, y1], [x2, y2], [FOND.x2, FOND.y2], [FOND.x2, FOND.y1]], '#E2AE72')}
      {paroi([[x1, y2], [FOND.x1, FOND.y2], [FOND.x2, FOND.y2], [x2, y2]], '#E6B77C')}
      <Tressage />
      <Fond />
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx="22" fill="none" stroke={TRAIT} strokeWidth="3" />
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
  const places = disposition(pieces.length)

  return (
    <div className="relative w-full">
      <DessinPanier />
      <AnimatePresence>
        {pieces.map((piece, i) => {
          const [x, y, rotation, taille] = places[i]
          return (
            <motion.div
              key={piece.cle}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 hover:z-20"
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
              {/* étiquette au survol */}
              <span className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap font-ui text-[0.7rem] font-semibold bg-[#2A1506] text-[#FBF5E9] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {piece.nom}{piece.prix ? ` · ${piece.prix}` : ''}
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
