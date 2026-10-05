// Galerie d'un projet (page À propos) : les photos flottent sur un fond à la couleur du projet,
// on peut les attraper et les déplacer ; un clic en envoie une au centre, les autres filent en rangée en bas.
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion'
import { Etiquette } from './Stickers'

// Emplacements de départ (en % de l'écran) + rotation : éparpillés autour du titre
const PLACES = [
  [6, 14, -8], [64, 9, 6], [38, 56, -3], [72, 52, 9], [10, 60, 5], [40, 6, -6], [84, 26, -4], [24, 34, 7],
]
const FLOTTEMENTS = [[0, -14, 0], [0, 12, 0], [0, -10, 0], [0, 16, 0]]

// Jusqu'où on peut emmener une photo depuis sa place (px) — sans la perdre hors de l'écran
const LIMITES = { top: -260, bottom: 260, left: -360, right: 360 }

function PhotoFlottante({ src, alt, i, place, onChoisir, reduire }) {
  const [x, y, rotation] = place
  const depart = useRef(null)
  return (
    <motion.button
      layoutId={`photo-${i}`}
      // Un vrai clic agrandit la photo ; si on l'a déplacée, on la laisse où elle est
      onTapStart={(_, info) => { depart.current = info.point }}
      onTap={(_, info) => {
        const d = depart.current
        if (!d || Math.hypot(info.point.x - d.x, info.point.y - d.y) < 6) onChoisir()
      }}
      drag
      dragConstraints={LIMITES}
      dragElastic={0.2}
      dragMomentum={false}
      whileDrag={{ scale: 1.08, zIndex: 40, cursor: 'grabbing' }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
      initial={{ opacity: 0, scale: 0.6, rotate: rotation * 2 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ type: 'spring', stiffness: 160, damping: 16, delay: reduire ? 0 : 0.08 * i }}
      className="absolute z-10 cursor-grab touch-none w-[clamp(7.5rem,19vw,15rem)] bg-[#FBF5E9] p-2 pb-6 md:p-2.5 md:pb-8 rounded-sm shadow-[4px_8px_18px_rgba(42,21,6,0.35)]"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`Agrandir : ${alt}`}
    >
      {/* le flottement est porté par l'image pour ne pas gêner le glisser */}
      <motion.img
        src={src}
        alt={alt}
        draggable="false"
        animate={reduire ? undefined : { y: FLOTTEMENTS[i % FLOTTEMENTS.length] }}
        transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
        className="w-full aspect-[4/5] object-cover pointer-events-none select-none"
      />
    </motion.button>
  )
}

export default function GalerieFlottante({ projet, onFermer }) {
  const [focus, setFocus] = useState(null)
  const reduire = useReducedMotion()
  const n = projet.images.length

  useEffect(() => {
    const touche = (e) => {
      if (e.key === 'Escape') (focus !== null ? setFocus(null) : onFermer())
      if (focus === null) return
      if (e.key === 'ArrowRight') setFocus((f) => (f + 1) % n)
      if (e.key === 'ArrowLeft') setFocus((f) => (f - 1 + n) % n)
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [focus, n, onFermer])

  const fleche = (sens) => (
    <button
      onClick={() => setFocus((f) => (f + sens + n) % n)}
      className={`absolute ${sens < 0 ? 'left-3 md:left-8' : 'right-3 md:right-8'} top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#FBF5E9] border-2 border-[#2A1506] shadow-[3px_3px_0_#2A1506] flex items-center justify-center text-xl font-bold hover:-translate-y-[calc(50%+2px)] transition-transform`}
      aria-label={sens < 0 ? 'Photo précédente' : 'Photo suivante'}
    >
      {sens < 0 ? '←' : '→'}
    </button>
  )

  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: reduire ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[80] overflow-hidden"
      style={{ backgroundColor: projet.color, backgroundImage: 'radial-gradient(circle, rgba(42,21,6,0.12) 2px, transparent 2px)', backgroundSize: '26px 26px' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Projet ${projet.name}`}
    >
      {/* Titre géant en fond */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-4 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: focus === null ? 1 : 0.25, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display font-black italic leading-none text-[#2A1506]"
          style={{ fontSize: 'clamp(2.4rem, 13vw, 15rem)' }}
        >
          {projet.name}
        </motion.h3>
      </div>

      {focus === null && projet.subtitle && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="absolute top-5 left-4 md:top-7 md:left-6 z-20 max-w-[70%]">
          <Etiquette fond="#FBF5E9">{projet.subtitle}</Etiquette>
        </motion.div>
      )}

      <button
        onClick={onFermer}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-12 h-12 rounded-full bg-[#2A1506] text-[#FBF5E9] flex items-center justify-center text-xl hover:rotate-90 transition-transform"
        aria-label="Fermer la galerie"
      >
        ✕
      </button>

      <LayoutGroup>
        {focus === null ? (
          <>
            {projet.images.map((src, i) => (
              <PhotoFlottante
                key={i}
                src={src}
                alt={`${projet.name} — photo ${i + 1}`}
                i={i}
                place={PLACES[i % PLACES.length]}
                onChoisir={() => setFocus(i)}
                reduire={reduire}
              />
            ))}
            <p className="absolute bottom-5 inset-x-0 text-center font-main font-bold text-xl md:text-2xl text-[#2A1506]/75 pointer-events-none">
              attrape une photo ✿ clique pour l'agrandir
            </p>
          </>
        ) : (
          <>
            {/* La photo choisie, au centre */}
            <div className="absolute inset-0 flex items-center justify-center px-16 pt-16 pb-36 md:pb-40 pointer-events-none">
              <motion.div
                layoutId={`photo-${focus}`}
                className="pointer-events-auto bg-[#FBF5E9] p-3 pb-10 rounded-sm shadow-[6px_12px_30px_rgba(42,21,6,0.4)] max-h-full"
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              >
                <img src={projet.images[focus]} alt={`${projet.name} — photo ${focus + 1}`} className="max-h-[calc(100vh-15rem)] max-w-[80vw] object-contain" />
                <p className="absolute bottom-2 inset-x-0 text-center font-main font-bold text-xl">{focus + 1} / {n}</p>
              </motion.div>
            </div>
            {n > 1 && fleche(-1)}
            {n > 1 && fleche(1)}
            {/* Les autres, en rangée en bas */}
            <div className="absolute bottom-4 inset-x-0 z-30 flex justify-center gap-2 md:gap-3 px-4 overflow-x-auto">
              {projet.images.map((src, i) => (i === focus ? (
                <span key={i} className="shrink-0 w-14 md:w-20 aspect-[4/5]" aria-hidden="true" />
              ) : (
                <motion.button
                  key={i}
                  layoutId={`photo-${i}`}
                  onClick={() => setFocus(i)}
                  whileHover={{ y: -6, rotate: i % 2 ? 4 : -4 }}
                  className="shrink-0 w-14 md:w-20 bg-[#FBF5E9] p-1 pb-3 rounded-sm shadow-[3px_5px_10px_rgba(42,21,6,0.3)]"
                  aria-label={`Voir la photo ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full aspect-[4/5] object-cover" />
                </motion.button>
              )))}
            </div>
            <button onClick={() => setFocus(null)} className="absolute top-5 left-4 md:top-7 md:left-6 z-50 font-main font-bold text-xl px-4 py-1.5 rounded-full bg-[#FBF5E9] border-2 border-[#2A1506] shadow-[3px_3px_0_#2A1506] -rotate-2">
              ← toutes les photos
            </button>
          </>
        )}
      </LayoutGroup>
    </motion.div>
  )
}

