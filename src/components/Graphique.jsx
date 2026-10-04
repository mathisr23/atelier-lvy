// Éléments graphiques de la boutique : bandeaux, vagues, festons, formes fleurs, tampons, rayures.
// Inspirés des références de Léa (hello chooki, zestwax) — tout en SVG/CSS, sans image.
import { useId, useRef, useState, useEffect } from 'react'

// Identifiant utilisable dans url(#…) — useId peut contenir « : » ou « « »
const useIdSvg = () => useId().replace(/[^a-zA-Z0-9_-]/g, '')
// « relative » par défaut, sauf si l'appelant positionne déjà l'élément
const positionner = (className) => (/(^|\s)(absolute|fixed)(\s|$)/.test(className) ? className : `relative ${className}`)

/* ─── Bandeau défilant ─── */
export function Bandeau({ items, fond = '#2A1506', couleur = '#FBF5E9', vitesse = 35, className = '', separateur = '✺' }) {
  const ligne = items.flatMap((t, i) => [
    <span key={`t${i}`} className="whitespace-nowrap">{t}</span>,
    <span key={`s${i}`} aria-hidden="true" className="opacity-70">{separateur}</span>,
  ])
  return (
    <div className={`overflow-hidden ${className}`} style={{ backgroundColor: fond, color: couleur }}>
      <div className="flex w-max animate-defilement" style={{ animationDuration: `${vitesse}s` }}>
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center gap-6 pr-6 py-2.5 font-ui text-[0.7rem] md:text-xs font-bold uppercase tracking-[0.25em]">
            {ligne}{ligne}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Ruban ondulé : bords parallèles, texte qui glisse le long de la vague ─── */
// Dessiné au pixel près selon la largeur réelle (pas de déformation du texte), recalculé au redimensionnement.
const RUBAN = { epaisseur: 46, amplitude: 7, periode: 320, cycle: 1300, vitesse: 45 } // cycle = longueur d'une répétition du texte (px)

export function RubanOndule({ items, fond = '#2A1506', couleur = '#F3D07A', fondHaut = '#FBF5E9', fondBas = '#FBF5E9', separateur = '✿', defile = true }) {
  const id = useIdSvg()
  const ref = useRef(null)
  const [largeur, setLargeur] = useState(0)
  const [mouvementOk] = useState(() => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const animer = defile && mouvementOk // defile={false} : texte immobile dans la vague

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new ResizeObserver(([e]) => setLargeur(Math.round(e.contentRect.width)))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const { epaisseur, amplitude, periode, cycle, vitesse } = RUBAN
  const hauteur = epaisseur + amplitude * 2 + 8
  const milieu = hauteur / 2
  const y = (x) => milieu + amplitude * Math.sin((2 * Math.PI * x) / periode)

  // Courbes échantillonnées tous les 8 px, débordant de chaque côté pour que le texte entre/sorte hors champ
  const xs = []
  for (let x = -cycle; x <= largeur + 40; x += 8) xs.push(x)
  const haut = xs.map((x) => `${x},${(y(x) - epaisseur / 2).toFixed(1)}`)
  const bas = xs.map((x) => `${x},${(y(x) + epaisseur / 2).toFixed(1)}`).reverse()
  const centre = `M ${xs.map((x) => `${x},${y(x).toFixed(1)}`).join(' L ')}`

  // Assez de répétitions pour couvrir l'écran même pendant le défilement
  const repetitions = Math.ceil((largeur + 2 * cycle) / cycle) + 1
  const unite = items.map((t) => `${t}  ${separateur}  `).join('')

  return (
    <div ref={ref} className="w-full" style={{ background: `linear-gradient(${fondHaut} 50%, ${fondBas} 50%)` }} aria-label={items.join(', ')} role="img">
      {largeur > 0 && (
        <svg width={largeur} height={hauteur} viewBox={`0 0 ${largeur} ${hauteur}`} className="block" aria-hidden="true">
          <rect width={largeur} height={milieu} fill={fondHaut} />
          <rect y={milieu} width={largeur} height={milieu} fill={fondBas} />
          <polygon points={[...haut, ...bas].join(' ')} fill={fond} />
          <defs><path id={`ruban-${id}`} d={centre} /></defs>
          <text
            fill={couleur}
            dominantBaseline="central"
            style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}
          >
            <textPath href={`#ruban-${id}`} textLength={cycle * repetitions} lengthAdjust="spacing" startOffset={0}>
              {unite.repeat(repetitions)}
              {animer && <animate attributeName="startOffset" from="0" to={-cycle} dur={`${cycle / vitesse}s`} repeatCount="indefinite" />}
            </textPath>
          </text>
        </svg>
      )}
    </div>
  )
}

/* ─── Vague (séparateur) ─── */
export function Vague({ couleur = '#2A1506', inverse = false, className = '', hauteur = 28 }) {
  return (
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className={`block w-full ${inverse ? 'rotate-180' : ''} ${className}`} style={{ height: hauteur }} aria-hidden="true">
      <path d="M0 40 V20 Q 25 0 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 T 450 20 T 500 20 T 550 20 T 600 20 T 650 20 T 700 20 T 750 20 T 800 20 T 850 20 T 900 20 T 950 20 T 1000 20 T 1050 20 T 1100 20 T 1150 20 T 1200 20 V40 Z" fill={couleur} />
    </svg>
  )
}

/* ─── Festons (bord en demi-cercles) ─── */
export function Festons({ couleur = '#F3D07A', inverse = false, className = '', taille = 36 }) {
  const id = useIdSvg()
  return (
    <svg className={`block w-full ${inverse ? 'rotate-180' : ''} ${className}`} style={{ height: taille / 2 }} aria-hidden="true">
      <defs>
        <pattern id={id} width={taille} height={taille / 2} patternUnits="userSpaceOnUse">
          <circle cx={taille / 2} cy={taille / 2} r={taille / 2} fill={couleur} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/* ─── Rayures & damier (fonds CSS) ─── */
// eslint-disable-next-line react-refresh/only-export-components -- styles de fond partagés
export const rayures = (a = '#F2A0A8', b = '#FBF5E9', largeur = 22) => ({
  backgroundImage: `repeating-linear-gradient(90deg, ${a} 0 ${largeur}px, ${b} ${largeur}px ${largeur * 2}px)`,
})
// eslint-disable-next-line react-refresh/only-export-components
export const damier = (a = '#C9B8E8', b = '#FBF5E9', taille = 14) => ({
  backgroundImage: `conic-gradient(${a} 25%, ${b} 0 50%, ${a} 0 75%, ${b} 0)`,
  backgroundSize: `${taille * 2}px ${taille * 2}px`,
})

export function BandeRayee({ a = '#F3D07A', b = '#FBF5E9', hauteur = 22, className = '' }) {
  return <div className={className} style={{ height: hauteur, ...rayures(a, b, 14) }} aria-hidden="true" />
}
export function BandeDamier({ a = '#C9B8E8', b = '#FBF5E9', taille = 11, rangs = 2, className = '' }) {
  return <div className={className} style={{ height: taille * rangs, ...damier(a, b, taille) }} aria-hidden="true" />
}

/* ─── Photo découpée en fleur / nuage ─── */
const FORMES = {
  // 4 lobes, comme les photos « nuage » de zestwax
  nuage: [[0.3, 0.3, 0.3], [0.7, 0.3, 0.3], [0.3, 0.7, 0.3], [0.7, 0.7, 0.3], [0.5, 0.5, 0.32]],
  // 8 pétales autour d'un cœur
  fleur: [
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return [0.5 + Math.cos(a) * 0.3, 0.5 + Math.sin(a) * 0.3, 0.2]
    }),
    [0.5, 0.5, 0.34],
  ],
}

// `ombre` : même forme en aplat de couleur, décalée derrière la photo
export function PhotoForme({ src, alt = '', forme = 'fleur', fond, ombre, className = '', imgClassName = '' }) {
  const id = useIdSvg()
  return (
    <div className={positionner(className)}>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id={`forme-${id}`} clipPathUnits="objectBoundingBox">
            {FORMES[forme].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}
          </clipPath>
        </defs>
      </svg>
      {ombre && <div className="absolute inset-0 translate-x-[7%] translate-y-[5%] rotate-6" style={{ clipPath: `url(#forme-${id})`, backgroundColor: ombre }} />}
      <div className="absolute inset-0" style={{ clipPath: `url(#forme-${id})`, backgroundColor: fond }}>
        {src && <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} loading="lazy" />}
      </div>
    </div>
  )
}

/* ─── Tampon rond qui tourne ─── */
export function Tampon({ texte = 'fait main ✺ atelier LVY ✺ grès & émail ✺ ', taille = 120, fond = '#F2A0A8', couleur = '#2A1506', className = '' }) {
  const id = useIdSvg()
  return (
    <div className={positionner(className)} style={{ width: taille, height: taille }} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="absolute inset-0 animate-[spin_18s_linear_infinite]">
        <circle cx="60" cy="60" r="58" fill={fond} />
        <circle cx="60" cy="60" r="56" fill="none" stroke={couleur} strokeWidth="0.8" strokeDasharray="2 3" />
        <defs>
          <path id={`cercle-${id}`} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
        </defs>
        <text fill={couleur} style={{ fontFamily: 'Syne, sans-serif', fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          {/* textLength = périmètre du cercle : le texte fait exactement le tour, quelle que soit sa longueur */}
          <textPath href={`#cercle-${id}`} textLength={276} lengthAdjust="spacingAndGlyphs">{texte}</textPath>
        </text>
      </svg>
      <Soleil className="absolute inset-0 m-auto" taille={taille * 0.34} couleur={couleur} />
    </div>
  )
}

/* ─── Soleil / étincelle ─── */
export function Soleil({ taille = 60, couleur = '#F3D07A', rayons = 16, className = '' }) {
  const pts = Array.from({ length: rayons * 2 }, (_, i) => {
    const a = (i / (rayons * 2)) * Math.PI * 2
    const r = i % 2 === 0 ? 50 : 24
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" width={taille} height={taille} className={className} aria-hidden="true">
      <polygon points={pts} fill={couleur} />
    </svg>
  )
}

/* ─── Fleur pleine (décor) ─── */
export function Fleur({ taille = 48, couleur = '#F2A0A8', coeur = '#F3D07A', className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={taille} height={taille} className={className} aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        return <circle key={i} cx={50 + Math.cos(a) * 26} cy={50 + Math.sin(a) * 26} r="22" fill={couleur} />
      })}
      <circle cx="50" cy="50" r="17" fill={coeur} />
    </svg>
  )
}
