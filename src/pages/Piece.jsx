import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, Package, Store } from 'lucide-react'
import useSEO from '../hooks/useSEO'
import Reveal from '../components/Reveal'
import ProduitCarte from '../components/ProduitCarte'
import { Festons, Tampon, Soleil, Fleur, Bandeau } from '../components/Graphique'
import { useCatalogue, lienBoutique } from '../context/CatalogueContext'
import { useCart } from '../context/CartContext'
import { VENTE_OUVERTE } from '../lib/vente'
import { btn, defaultDescription, formatPrix } from '../lib/boutique'
import { FRAIS_LIVRAISON, SEUIL_LIVRAISON_OFFERTE } from '../data/livraison'

const ONGLETS = [
  { cle: 'details', label: 'La pièce' },
  { cle: 'entretien', label: 'Entretien' },
  { cle: 'livraison', label: 'Livraison & retrait' },
]

const BANDEAU = ['Modelé à la main', 'Grès émaillé', 'Cuit deux fois', 'Pièce de l’atelier']

/* ─── Galerie : grande photo + miniatures sur le côté ─── */
function Galerie({ produit, couleur, onAgrandir }) {
  const [active, setActive] = useState(0)
  const images = produit.images
  const image = images[active] ?? images[0]

  return (
    <div className="relative max-w-xl mx-auto lg:max-w-none rounded-[2.5rem] border-2 border-[#2A1506] p-3 md:p-5 shadow-[6px_6px_0_#2A1506]"
      style={{ backgroundColor: couleur, backgroundImage: 'radial-gradient(circle, rgba(42,21,6,0.09) 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}>
      <Soleil taille={52} couleur="#F3D07A" className="absolute -top-5 -left-4 z-10 animate-[spin_24s_linear_infinite]" />
      <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
        {/* miniatures : en colonne sur ordinateur, en ligne sur mobile */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible md:w-20 shrink-0 pb-1 md:pb-0">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Photo ${i + 1}`}
                aria-pressed={i === active}
                className={`shrink-0 w-16 md:w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all ${i === active ? 'border-[#2A1506] -rotate-3 shadow-[3px_3px_0_#2A1506]' : 'border-[#FBF5E9] opacity-80 hover:opacity-100'}`}
              >
                <img src={img.thumb} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
        {/* grande photo en arche */}
        <button onClick={() => onAgrandir(active)} className="relative flex-1 aspect-[4/5] rounded-t-full rounded-b-[2rem] overflow-hidden border-2 border-[#2A1506] bg-[#FBF5E9] cursor-zoom-in group" aria-label="Agrandir la photo">
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={image?.full ?? image?.thumb}
              alt={produit.nom}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
          </AnimatePresence>
          {produit.stock === 0 && (
            <span className="absolute bottom-5 right-5 w-24 h-24 rounded-full bg-[#F2A0A8] border-2 border-[#2A1506] flex items-center justify-center rotate-12 font-ui text-sm font-bold uppercase tracking-widest">Vendu</span>
          )}
        </button>
      </div>
    </div>
  )
}

/* ─── Agrandissement plein écran ─── */
function Lightbox({ images, index, setIndex, nom }) {
  useEffect(() => {
    if (index === null) return
    const touche = (e) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(images.length - 1, i + 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1))
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [index, images.length, setIndex])

  const fleche = (sens) => (
    <button
      onClick={(e) => { e.stopPropagation(); setIndex((i) => Math.min(images.length - 1, Math.max(0, i + sens))) }}
      className={`absolute ${sens < 0 ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl`}
      aria-label={sens < 0 ? 'Photo précédente' : 'Photo suivante'}
    >
      {sens < 0 ? '←' : '→'}
    </button>
  )

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center p-4" onClick={() => setIndex(null)}>
          {images.length > 1 && fleche(-1)}
          <motion.img key={index} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
            src={images[index].full ?? images[index].thumb} alt={`${nom} — ${index + 1}`}
            className="max-h-[88vh] max-w-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && fleche(1)}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Piece() {
  const { slug } = useParams()
  const naviguer = useNavigate()
  const { produitsParSlug, produits, categoriesParId, collectionsParId, loading } = useCatalogue()
  const { addItem, qteDansPanier } = useCart()
  const [onglet, setOnglet] = useState('details')
  const [agrandie, setAgrandie] = useState(null)

  const p = produitsParSlug[slug]
  const categorie = p && categoriesParId[p.categorie_id]
  const collection = p && collectionsParId[p.collection_id]
  const couleur = categorie?.couleur ?? '#F3D07A'

  useSEO({
    title: p ? `${p.nom} — Léa Artiste céramiste` : 'Pièce — Léa Artiste céramiste',
    description: p ? (p.description || defaultDescription(categorie?.slug)).slice(0, 155) : undefined,
  })

  if (loading) {
    return <div className="bg-[#FBF5E9] min-h-screen pt-32 px-6"><div className="max-w-6xl mx-auto h-[60vh] rounded-[2.5rem] bg-[#2A1506]/5 animate-pulse" /></div>
  }

  if (!p) {
    return (
      <div className="bg-[#FBF5E9] min-h-screen pt-40 px-6 text-center">
        <Fleur taille={60} className="mx-auto mb-6" />
        <h1 className="font-display font-black text-4xl md:text-5xl mb-4">Cette pièce a <span className="italic text-[#E87040]">filé</span></h1>
        <p className="font-body text-lg text-[#2A1506]/60 mb-8">Elle n'est plus en boutique, ou le lien est incorrect.</p>
        <Link to="/boutique" className={btn.orange}>Voir les pièces disponibles →</Link>
      </div>
    )
  }

  // Suggestions : même collection d'abord, puis même type d'objet
  const suggestions = [
    ...produits.filter((x) => x.id !== p.id && p.collection_id && x.collection_id === p.collection_id),
    ...produits.filter((x) => x.id !== p.id && x.categorie_id === p.categorie_id && x.collection_id !== p.collection_id),
  ].filter((x) => x.stock !== 0).slice(0, 4)

  const dansLePanier = qteDansPanier(p.slug)
  const description = p.description || defaultDescription(categorie?.slug)

  return (
    <div className="bg-[#FBF5E9] pt-[65px] md:pt-[113px] overflow-x-hidden">
      <Bandeau items={BANDEAU} fond={couleur} couleur="#2A1506" />

      <section className="relative max-w-7xl mx-auto px-5 md:px-12 lg:px-20 pt-8 md:pt-12 pb-20">
        <Fleur taille={36} couleur="#C9B8E8" coeur="#FBF5E9" className="absolute top-10 right-6 hidden md:block" />

        {/* fil d'Ariane */}
        <nav className="flex flex-wrap items-center gap-2 font-ui text-xs font-semibold mb-6 md:mb-8" aria-label="Fil d'Ariane">
          <Link to="/boutique" className="px-3 py-1 rounded-full border-2 border-[#2A1506]/15 hover:border-[#2A1506] transition-colors">← Boutique</Link>
          {collection && <Link to={lienBoutique({ collection: collection.slug })} className="px-3 py-1 rounded-full border-2 border-[#2A1506]/15 hover:border-[#2A1506] transition-colors">{collection.label}</Link>}
          {categorie && <Link to={lienBoutique({ type: categorie.slug })} className="px-3 py-1 rounded-full border-2 border-[#2A1506]/15 hover:border-[#2A1506] transition-colors">{categorie.label}</Link>}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-start">
          <Reveal direction="left">
            <Galerie key={p.id} produit={p} couleur={couleur} onAgrandir={setAgrandie} />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-32">
              <div className="flex flex-wrap gap-2 mb-4">
                {categorie && <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border-2 border-[#2A1506]" style={{ backgroundColor: couleur }}>{categorie.label}</span>}
                {collection && <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border-2 border-[#2A1506] bg-[#FBF5E9]">Collection {collection.label}</span>}
              </div>

              <h1 className="font-display font-black leading-[0.95] mb-5" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>{p.nom}</h1>

              <div className="flex items-center gap-4 mb-6">
                {p.stock === 0 ? (
                  <span className="font-ui font-bold text-sm uppercase tracking-widest text-[#2A1506]/50">Pièce vendue</span>
                ) : (
                  <>
                    <span className="font-display font-black text-3xl px-5 py-2 rounded-full bg-[#F3D07A] border-2 border-[#2A1506] -rotate-2 shadow-[3px_3px_0_#2A1506]">
                      {p.prix != null ? formatPrix(p.prix) : 'Prix à venir'}
                    </span>
                    <span className="font-main font-bold text-2xl text-[#D97080] -rotate-3">
                      {p.stock === 1 ? 'pièce unique !' : `${p.stock} disponibles`}
                    </span>
                  </>
                )}
              </div>

              <p className="font-body text-xl leading-relaxed text-[#2A1506]/75 mb-8">{description}</p>

              {/* Achat */}
              <div className="mb-8">
                {p.stock === 0 ? (
                  <Link to={lienBoutique(collection ? { collection: collection.slug } : {})} className={`${btn.outline} w-full text-center`}>Voir des pièces similaires →</Link>
                ) : p.prix == null || !VENTE_OUVERTE ? (
                  <a href={`mailto:contact.atelierlvy@gmail.com?subject=${encodeURIComponent(`À propos de « ${p.nom} »`)}`} className={`${btn.dark} w-full text-center`}>
                    Écris-moi pour cette pièce →
                  </a>
                ) : dansLePanier >= p.stock ? (
                  <button onClick={() => naviguer('/panier')}
                    className="w-full font-ui font-semibold text-sm px-8 py-4 bg-[#9BBF90] text-[#2A1506] border-2 border-[#2A1506] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-all duration-200">
                    ✓ Dans le panier — voir le panier
                  </button>
                ) : (
                  <button onClick={() => addItem({ slug: p.slug, nom: p.nom, image: p.images[0]?.thumb })}
                    className="w-full font-ui font-semibold text-base px-8 py-4 bg-[#E87040] text-[#2A1506] border-2 border-[#2A1506] rounded-xl shadow-[4px_4px_0_#2A1506] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#2A1506] transition-all duration-150">
                    {dansLePanier > 0 ? `Ajouter un autre exemplaire (${dansLePanier} dans le panier)` : 'Ajouter au panier →'}
                  </button>
                )}
              </div>

              {/* petites promesses */}
              <ul className="grid grid-cols-3 gap-2 mb-8">
                {[
                  { Icone: Hand, texte: 'Fait main à l’atelier' },
                  { Icone: Package, texte: 'Emballé avec soin' },
                  { Icone: Store, texte: 'Retrait gratuit possible' },
                ].map(({ Icone, texte }) => (
                  <li key={texte} className="flex flex-col items-center text-center gap-1 rounded-2xl bg-white/70 border border-[#2A1506]/10 px-2 py-3">
                    <Icone size={20} strokeWidth={1.8} className="text-[#E87040]" aria-hidden="true" />
                    <span className="font-ui text-[0.65rem] font-semibold leading-tight text-[#2A1506]/70">{texte}</span>
                  </li>
                ))}
              </ul>

              {/* onglets */}
              <div className="border-t-2 border-[#2A1506]">
                <div className="flex gap-1 -mt-px" role="tablist">
                  {ONGLETS.map(({ cle, label }) => (
                    <button key={cle} role="tab" aria-selected={onglet === cle} onClick={() => setOnglet(cle)}
                      className={`font-ui text-xs font-bold uppercase tracking-widest px-3 py-3 border-t-[3px] transition-colors ${onglet === cle ? 'border-[#E87040] text-[#2A1506]' : 'border-transparent text-[#2A1506]/40 hover:text-[#2A1506]'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="font-body text-lg leading-relaxed text-[#2A1506]/75 pt-3" role="tabpanel">
                  {onglet === 'details' && (
                    <p>Chaque pièce est modelée à la main dans mon atelier, en grès, puis cuite deux fois : une première cuisson (le biscuit), puis l'émaillage. Les petites variations de forme et de couleur font tout son charme : aucune n'est exactement identique.</p>
                  )}
                  {onglet === 'entretien' && (
                    <p>Lavage à la main conseillé pour préserver l'émail le plus longtemps possible. Évite les chocs thermiques brusques (passer du très froid au très chaud). Les pièces décoratives se dépoussièrent simplement avec un chiffon doux.</p>
                  )}
                  {onglet === 'livraison' && (
                    <p>Envoi en Colissimo ({formatPrix(FRAIS_LIVRAISON)}, offert dès {formatPrix(SEUIL_LIVRAISON_OFFERTE)} d'achat), soigneusement emballé. Tu peux aussi choisir le retrait gratuit à l'atelier au moment du paiement.</p>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <>
          <Festons couleur={couleur} />
          <section className="relative px-5 md:px-12 lg:px-20 py-14 md:py-20" style={{ backgroundColor: couleur }}>
            <Tampon taille={96} fond="#FBF5E9" texte="fait main ✺ atelier LVY ✺ " className="absolute -top-14 right-6 md:right-20 hidden sm:block" />
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-10">
                Elles vont <span className="italic">bien ensemble</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {suggestions.map((s) => <ProduitCarte key={s.id} produit={s} categorie={categoriesParId[s.categorie_id]} />)}
              </div>
            </div>
          </section>
          <Festons couleur={couleur} inverse />
        </>
      )}

      <Lightbox images={p.images} index={agrandie} setIndex={setAgrandie} nom={p.nom} />
    </div>
  )
}
