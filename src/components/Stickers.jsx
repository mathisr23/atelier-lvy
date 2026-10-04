// Kit graphique de la nouvelle DA : petits stickers en SVG (légers, aucune image à charger),
// frise de stickers, étiquettes écrites à la main, texte en arc.
import { useId } from 'react'

const BRUN = '#2A1506'
const trait = { stroke: BRUN, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' }

export function Etoile({ taille = 40, couleur = '#C9DE6E', branches = 5, creux = 0.45, className = '' }) {
  const pts = []
  for (let i = 0; i < branches * 2; i++) {
    const r = i % 2 ? 46 * creux : 46
    const a = (Math.PI * i) / branches - Math.PI / 2
    pts.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`)
  }
  return (
    <svg viewBox="0 0 100 100" width={taille} height={taille} className={className} aria-hidden="true">
      <polygon points={pts.join(' ')} fill={couleur} {...trait} />
    </svg>
  )
}

export function Coeur({ taille = 40, couleur = '#F2A0A8', className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={taille} height={taille} className={className} aria-hidden="true">
      <path d="M50 86 C 18 64, 6 44, 16 26 C 26 10, 46 14, 50 30 C 54 14, 74 10, 84 26 C 94 44, 82 64, 50 86 Z" fill={couleur} {...trait} />
      <path d="M28 30 q 4 -6 10 -5" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function Nuage({ taille = 80, couleur = '#FFFFFF', className = '', contour = true }) {
  return (
    <svg viewBox="0 0 120 70" width={taille} height={(taille * 70) / 120} className={className} aria-hidden="true">
      <path d="M22 60 C 6 60, 4 40, 20 36 C 18 20, 40 12, 50 24 C 56 8, 84 8, 88 28 C 104 24, 116 40, 104 52 C 104 60, 96 62, 90 60 Z"
        fill={couleur} {...(contour ? trait : {})} />
    </svg>
  )
}

export function Tasse({ taille = 44, couleur = '#9BBF90', className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={taille} height={taille} className={className} aria-hidden="true">
      <path d="M72 42 c 18 -2, 18 26, -2 24" fill="none" {...trait} strokeWidth="6" />
      <path d="M18 30 h 58 v 34 c 0 14, -10 22, -24 22 h -10 c -14 0, -24 -8, -24 -22 Z" fill={couleur} {...trait} />
      <circle cx="36" cy="52" r="5" fill="#FBF5E9" /><circle cx="54" cy="62" r="4" fill="#FBF5E9" /><circle cx="56" cy="44" r="3.5" fill="#FBF5E9" />
    </svg>
  )
}

export function Vase({ taille = 44, couleur = '#F3D07A', className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={taille} height={taille} className={className} aria-hidden="true">
      <path d="M40 10 h 20 v 12 c 0 6, 22 14, 22 38 c 0 20, -14 30, -32 30 c -18 0, -32 -10, -32 -30 c 0 -24, 22 -32, 22 -38 Z" fill={couleur} {...trait} />
      <path d="M26 58 q 12 -8 24 0 t 24 0" fill="none" stroke="#E87040" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Fleurette({ taille = 40, couleur = '#F2A0A8', coeur = '#F3D07A', rayonCoeur = 13, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={taille} height={taille} className={className} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        return <ellipse key={i} cx={50 + Math.cos(a) * 22} cy={50 + Math.sin(a) * 22} rx="17" ry="17" fill={couleur} {...trait} />
      })}
      <circle cx="50" cy="50" r={rayonCoeur} fill={coeur} {...trait} />
    </svg>
  )
}

export function Spirale({ taille = 40, couleur = '#E87040', className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={taille} height={taille} className={className} aria-hidden="true">
      <path d="M50 50 m 0 -4 a 4 4 0 1 1 -4 6 a 10 10 0 1 1 14 -10 a 18 18 0 1 1 -26 18 a 26 26 0 1 1 40 -24" fill="none" stroke={couleur} strokeWidth="7" strokeLinecap="round" />
    </svg>
  )
}

/* ─── Frise de stickers : bande colorée ponctuée de petits pictos ─── */
const FRISE = [
  (k) => <Tasse key={k} couleur="#9BBF90" />,
  (k) => <Coeur key={k} couleur="#F2A0A8" taille={36} />,
  (k) => <Etoile key={k} couleur="#F3D07A" taille={36} />,
  (k) => <Vase key={k} couleur="#C9B8E8" />,
  (k) => <Fleurette key={k} couleur="#FBF5E9" coeur="#E87040" taille={36} />,
  (k) => <Nuage key={k} couleur="#DCE8F4" taille={52} />,
  (k) => <Spirale key={k} couleur="#E87040" taille={32} />,
  (k) => <Etoile key={k} couleur="#C9DE6E" branches={8} creux={0.55} taille={36} />,
]

export function FriseStickers({ fond = '#FBF5E9', className = '', bordure = true }) {
  const items = [...FRISE, ...FRISE]
  return (
    <div className={`overflow-hidden ${bordure ? 'border-y-2 border-[#2A1506]' : ''} ${className}`} style={{ backgroundColor: fond }} aria-hidden="true">
      <div className="flex items-center justify-around gap-6 md:gap-10 py-3 px-4 min-w-max md:min-w-0">
        {items.map((rendre, i) => (
          <span key={i} className={`shrink-0 ${i % 2 ? 'rotate-6' : '-rotate-6'} ${i >= FRISE.length ? 'hidden md:inline-flex' : 'inline-flex'}`}>{rendre(i)}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Étiquette écrite à la main, façon sticker ─── */
export function Etiquette({ children, fond = '#F2A0A8', couleur = BRUN, rotation = -4, className = '' }) {
  return (
    <span className={`inline-block font-main font-bold text-xl md:text-2xl leading-none px-4 py-1.5 rounded-full border-2 border-[#2A1506] shadow-[3px_3px_0_#2A1506] ${className}`}
      style={{ backgroundColor: fond, color: couleur, transform: `rotate(${rotation}deg)` }}>
      {children}
    </span>
  )
}

/* ─── Texte en arc (au-dessus d'une photo, comme « create unique and bright ») ─── */
export function TexteArc({ texte, largeur = 400, courbure = 90, couleur = BRUN, taille = 34, className = '', police = 'Fraunces, serif', italique = true }) {
  const id = useId().replace(/:/g, '')
  const h = courbure + taille + 10
  return (
    <svg viewBox={`0 0 ${largeur} ${h}`} className={className} aria-label={texte} role="img">
      <defs><path id={`arc-${id}`} d={`M ${taille / 2} ${h - 6} Q ${largeur / 2} ${h - 6 - courbure * 2} ${largeur - taille / 2} ${h - 6}`} /></defs>
      <text fill={couleur} style={{ fontFamily: police, fontSize: taille, fontWeight: 900, fontStyle: italique ? 'italic' : 'normal' }}>
        <textPath href={`#arc-${id}`} startOffset="50%" textAnchor="middle">{texte}</textPath>
      </text>
    </svg>
  )
}
