import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'framer-motion'
import { formatPrix, lienPiece } from '../lib/boutique'

// Carte d'une pièce : fond pastel de sa catégorie, photo en arche, étiquette et prix façon sticker.
// retourBoutique : nombre de pas d'historique pour revenir à la boutique (le « ← Boutique » de la pièce fait alors un vrai retour).
export default function ProduitCarte({ produit: p, categorie, className = '', retourBoutique }) {
  const vendu = p.stock === 0
  const couleur = categorie?.couleur ?? '#F3D07A'
  // La photo se charge ~1,5 écran avant d'arriver (le loading="lazy" de Safari attend le dernier moment)
  const ref = useRef(null)
  const proche = useInView(ref, { once: true, margin: '1200px 0px' })
  return (
    <Link
      ref={ref}
      to={lienPiece(p.slug)}
      state={retourBoutique ? { retourBoutique } : undefined}
      className={`group flex flex-col h-full text-left w-full border-2 border-[#2A1506] rounded-[2rem] p-2.5 md:p-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:-rotate-1 hover:shadow-[6px_6px_0_#2A1506] ${className}`}
      style={{ background: `linear-gradient(${couleur}55, ${couleur}55), #FBF5E9` }}
    >
      <div className="relative aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden mb-3 md:mb-4 border-2 border-[#2A1506] bg-[#FBF5E9]">
        {proche && <img
          src={p.images[0]?.thumb}
          alt={p.nom}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${vendu ? 'grayscale opacity-70' : ''}`}
          decoding="async"
        />}
        {vendu && (
          <span className="absolute bottom-3 right-3 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F2A0A8] border-2 border-[#2A1506] flex items-center justify-center rotate-12 font-ui text-[0.6rem] md:text-xs font-bold uppercase tracking-widest text-[#2A1506]">
            Vendu
          </span>
        )}
        {!vendu && p.stock === 1 && (
          <span className="absolute top-[18%] left-3 font-main font-bold text-base md:text-lg leading-none px-2.5 py-1 rounded-full bg-[#FBF5E9] border-2 border-[#2A1506] -rotate-6">
            pièce unique
          </span>
        )}
      </div>
      {/* flex-1 : cartes d'une même rangée à la même hauteur, prix calé en bas même si le nom tient sur 2 lignes */}
      <div className="flex-1 flex flex-col px-1.5 md:px-2 pb-1">
        {categorie && (
          <span className="inline-block font-ui text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-[#FBF5E9] border border-[#2A1506]/20 mb-1.5">
            {categorie.label}
          </span>
        )}
        <div className="flex-1 flex flex-col items-start justify-between gap-1.5 md:flex-row md:items-end md:gap-2">
          <p className="font-display font-bold text-sm md:text-lg leading-snug">{p.nom}</p>
          {vendu ? (
            <span className="font-ui text-xs font-bold shrink-0 text-[#2A1506]/40">Vendu</span>
          ) : p.prix != null && (
            <span className="font-ui text-xs md:text-sm font-bold shrink-0 bg-[#2A1506] text-[#FBF5E9] rounded-full px-3 py-1 group-hover:bg-[#E87040] group-hover:text-[#2A1506] transition-colors">{formatPrix(p.prix)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
