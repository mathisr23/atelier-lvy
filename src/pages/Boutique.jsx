import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { motion, AnimatePresence } from 'framer-motion'
import { Asterisk } from '../components/Deco'
import Reveal from '../components/Reveal'
import { useCatalogue } from '../context/CatalogueContext'
import { useCart } from '../context/CartContext'
import imgFourMarron from '../assets/four_marron.png'
import imgVase1 from '../assets/vase1.png'
import imgVerre from '../assets/verre.png'
import imgTasse from '../assets/tasse1.png'
import imgVas3 from '../assets/vas3.png'

const btn = {
  dark: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] border-2 border-[#2A1506] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  outline: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-transparent text-[#2A1506] border-2 border-[#2A1506] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-all duration-200 whitespace-nowrap',
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200 whitespace-nowrap',
}

const defaultDescriptions = {
  'porte-bijoux': "Un joli rangement pour poser bagues et bijoux du quotidien — pièce unique en grès, façonnée et émaillée à la main.",
  'bols-vases': "Une pièce en grès façonnée à la main, entre objet du quotidien et petite sculpture.",
  'cuilleres': "Une cuillère en grès façonnée et peinte à la main, pour twister sa vaisselle du quotidien.",
  'art-de-la-table': "Une pièce en grès façonnée à la main, pour twister sa table ou son intérieur.",
  'figurines': "Une petite pièce en grès modelée à la main, pleine de caractère.",
}
function defaultDescription(categorieSlug) {
  return defaultDescriptions[categorieSlug] ?? 'Pièce unique façonnée à la main dans mon atelier, en grès.'
}

const formatPrix = (n) => `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2 })} €`

const steps = [
  { num: '01', title: 'Contacte moi', text: "Raconte-moi ton idée et tes envies, tu peux aussi me faire un croquis et m’envoyer des inspirations. Ensuite je te recontacte pour qu’on puisse échanger ensemble et bien cerner ce que tu souhaites.", color: '#E87040' },
  { num: '02', title: 'Devis et croquis', text: "Je te prépare un devis et un premier croquis de ta pièce. On affine ensemble jusqu'à ce que ce soit parfait. Sur certains projets, un acompte peut être demandé.", color: '#9BBF90' },
  { num: '03', title: 'Création', text: "Une fois le devis validé, je façonne ta pièce à la main, la colore si besoin puis la cuit et l’émail. Chaque étape est faite avec soin, ça prend un peu de temps, mais ça vaut le coup !", color: '#F2A0A8' },
]

export default function Boutique() {
  useSEO({
    title: 'Boutique — Léa Artiste céramiste',
    description: 'Explorez mes créations en céramique disponibles à la vente — pièces uniques faites à la main.',
  })

  // Filtres dans l'URL (/boutique?collection=corail&type=cuilleres) : partageables et utilisés par le menu
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const typeActif = params.get('type')
  const collectionActive = params.get('collection')
  const [openProduit, setOpenProduit] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const { addItem, qteDansPanier, setOpen: ouvrirPanier } = useCart()
  const { produits, categoriesActives, collectionsActives, categoriesParId, collectionsParId, loading } = useCatalogue()

  const categorieDe = (p) => categoriesParId[p.categorie_id]
  const catLabel = (p) => categorieDe(p)?.label ?? ''
  const catColor = (p) => categorieDe(p)?.couleur ?? '#2A1506'

  const filtered = produits.filter(p =>
    (!typeActif || categoriesParId[p.categorie_id]?.slug === typeActif) &&
    (!collectionActive || collectionsParId[p.collection_id]?.slug === collectionActive)
  )

  const setFiltre = (cle, valeur) => {
    const suivants = new URLSearchParams(params)
    if (valeur && suivants.get(cle) !== valeur) suivants.set(cle, valeur)
    else suivants.delete(cle)
    setParams(suivants, { replace: true, preventScrollReset: true })
  }
  const toutVoir = () => setParams({}, { replace: true, preventScrollReset: true })

  const allerAuxPieces = () => document.getElementById('mes-pieces')?.scrollIntoView({ behavior: 'smooth' })

  // Arrivée depuis le menu (Collections / Objets) : on descend directement sur les pièces
  useEffect(() => {
    if (!location.state?.versPieces) return
    const t = setTimeout(allerAuxPieces, 400) // après la transition de page
    return () => clearTimeout(t)
  }, [location.key, location.state])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null)
        else setOpenProduit(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex])

  useEffect(() => {
    document.body.style.overflow = openProduit ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [openProduit])

  return (
    <div className="bg-[#FBF5E9] pt-20">

      {/* HERO */}
      <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto relative">
        <Asterisk size={24} color="#E87040" className="absolute top-24 right-8 opacity-25 rotate-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-4">Boutique</p></Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display font-black leading-[0.9] mb-10" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
                Ce que je<br /><span className="text-[#E87040]">propose.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-body text-[#2A1506]/60 text-xl max-w-xl leading-relaxed mb-8">
                Venez découvrir mes créations ou bien faites moi part de vos idées les plus folles pour créer des objets sur mesures répondant à vos gouts et besoins !
              </p>
              <div className="flex gap-4 flex-wrap">
                <a href="#mes-pieces" className={btn.orange}>Mes pièces</a>
                <a href="#sur-mesure" className={btn.dark}>Création sur mesure</a>
              </div>
            </Reveal>
          </div>

          {/* 4 illustrations en quinquonce */}
          <Reveal direction="left" delay={0.15}>
            <div className="relative h-[40rem] hidden lg:block">
              <img src={imgVase1} alt="Vase en céramique" className="absolute -top-10 -right-20 w-96 h-96 -rotate-16 object-contain mix-blend-multiply contrast-[1.1] pointer-events-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
              <img src={imgTasse} alt="Tasse en céramique" className="absolute top-30 left-0 w-96 h-96 rotate-8 object-contain mix-blend-multiply contrast-[1.1] pointer-events-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
              <img src={imgVas3} alt="Vase sculpté" className="absolute bottom-0 -right-40 w-96 h-96 rotate-4 object-contain mix-blend-multiply contrast-[1.1] pointer-events-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
              <img src={imgVerre} alt="Verre en céramique" className="absolute -bottom-30 left-8 w-96 h-96 -rotate-16 object-contain mix-blend-multiply contrast-[1.1] pointer-events-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* COLLECTIONS */}
      {collectionsActives.length > 0 && (
        <section className="px-6 md:px-16 lg:px-24 pb-8">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-6">Les collections</p>
            </Reveal>
            <div className={`grid grid-cols-1 gap-5 ${collectionsActives.length === 2 ? 'md:grid-cols-2' : collectionsActives.length >= 3 ? 'md:grid-cols-3' : ''}`}>
              {collectionsActives.map((c, i) => {
                const pieces = produits.filter(p => p.collection_id === c.id)
                const photos = pieces.flatMap(p => p.images.slice(0, 1)).slice(0, 3)
                const active = collectionActive === c.slug
                return (
                  <Reveal key={c.id} delay={i * 0.08} direction="up">
                    <button
                      onClick={() => { setFiltre('collection', c.slug); allerAuxPieces() }}
                      className={`group relative w-full text-left rounded-3xl overflow-hidden p-5 pb-6 transition-all duration-300 hover:-translate-y-1 ${active ? 'ring-4 ring-offset-4 ring-offset-[#FBF5E9]' : ''}`}
                      style={{ backgroundColor: `${c.couleur}33`, '--tw-ring-color': c.couleur }}
                    >
                      <div className="flex gap-2 h-44 md:h-52 mb-5">
                        {photos.map((img, j) => (
                          <div key={j} className={`rounded-2xl overflow-hidden bg-white ${j === 0 ? 'flex-[1.4]' : 'flex-1'}`}>
                            <img src={img.thumb} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-[#2A1506]/50 mb-1">Collection</p>
                          <h3 className="font-display font-black text-3xl md:text-4xl leading-none" style={{ color: c.couleur }}>{c.label}</h3>
                        </div>
                        <span className="font-ui text-xs font-semibold text-[#2A1506]/60 whitespace-nowrap">
                          {pieces.length} pièce{pieces.length > 1 ? 's' : ''} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </button>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* MES PIÈCES */}
      <section id="mes-pieces" className="px-6 md:px-16 lg:px-24 py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-4">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Mes pièces</h2>
            <p className="font-body text-[#2A1506]/70 text-lg max-w-2xl">
              Des créations faites à la main en grès, pièces uniques ou en petites séries.
            </p>
          </div>
        </Reveal>


        {/* Filtres : collection (univers) × type d'objet — combinables */}
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-4 mb-12">
            {[
              { titre: 'Collections', cle: 'collection', items: collectionsActives, actif: collectionActive },
              { titre: 'Objets', cle: 'type', items: categoriesActives, actif: typeActif },
            ].filter(r => r.items.length > 0).map(({ titre, cle, items, actif }) => (
              <div key={cle} className="flex flex-wrap items-center gap-2">
                <span className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-[#2A1506]/40 w-24 shrink-0">{titre}</span>
                {items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFiltre(cle, c.slug)}
                    className={`font-ui text-sm font-semibold px-4 py-2 rounded-xl border-2 transition-all duration-150 inline-flex items-center gap-2 ${actif === c.slug ? 'text-[#2A1506]' : 'bg-white border-[#2A1506]/10 text-[#2A1506]/70 hover:border-[#2A1506]/25'}`}
                    style={actif === c.slug ? { backgroundColor: c.couleur, borderColor: c.couleur } : undefined}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: actif === c.slug ? 'currentColor' : c.couleur }} />
                    {c.label}
                    {actif === c.slug && <span aria-hidden="true" className="-mr-1 opacity-60">✕</span>}
                  </button>
                ))}
              </div>
            ))}
            {(typeActif || collectionActive) && (
              <p className="font-ui text-sm text-[#2A1506]/60">
                {filtered.length} pièce{filtered.length > 1 ? 's' : ''}
                <button onClick={toutVoir} className="ml-3 font-semibold text-[#E87040] underline underline-offset-2 hover:text-[#2A1506]">Tout voir</button>
              </p>
            )}
          </div>
        </Reveal>

        {/* Grille produits */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-16 md:gap-y-20">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-2xl bg-[#2A1506]/5 mb-4" />
              <div className="h-4 w-2/3 rounded bg-[#2A1506]/5" />
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="font-display italic text-3xl text-[#2A1506]/20 mb-4">Rien pour l'instant ici…</p>
              <button onClick={toutVoir} className={btn.outline}>Voir toutes les pièces</button>
            </div>
          )}
          {filtered.map((p, i) => {
            const vendu = p.stock === 0
            return (
            <Reveal key={p.slug} delay={Math.min(i * 0.04, 0.3)} direction="up">
              <button onClick={() => setOpenProduit(p)} className="group text-left w-full">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white mb-4 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={p.images[0]?.thumb}
                    alt={p.nom}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${vendu ? 'grayscale opacity-70' : ''}`}
                    loading="lazy"
                  />
                  {vendu && (
                    <span className="absolute top-3 left-3 font-ui text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-[#2A1506] text-[#FBF5E9]">
                      Vendu
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-bold text-base md:text-lg leading-snug">{p.nom}</p>
                    <p className="font-ui text-xs uppercase tracking-wider mt-1" style={{ color: catColor(p) }}>
                      {catLabel(p)}
                    </p>
                  </div>
                  {vendu ? (
                    <span className="font-ui text-xs font-bold shrink-0 text-[#2A1506]/40">Vendu</span>
                  ) : p.prix != null && (
                    <span className="font-ui text-sm font-bold shrink-0">{formatPrix(p.prix)}</span>
                  )}
                </div>
              </button>
            </Reveal>
            )
          })}
        </div>
        </div>
      </section>

      {/* SUR COMMANDE */}
      <section id="sur-mesure" className="px-6 md:px-16 lg:px-24 py-24 mt-16 relative" style={{ backgroundColor: '#9BBF90', backgroundImage: 'radial-gradient(circle, rgba(42,21,6,0.1) 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }}>
        <Asterisk size={40} color="rgba(42,21,6,0.1)" className="absolute top-12 right-12 rotate-6" />
        <Asterisk size={22} color="rgba(42,21,6,0.08)" className="absolute bottom-20 left-8 -rotate-12" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/60 mb-4">Création personnalisée</p>
            <h2 className="font-display font-bold text-5xl md:text-6xl text-[#2A1506] leading-tight max-w-xl mb-16">
              Une pièce<br /><span className="italic">rien que pour toi</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {steps.map(({ num, title, text, color }, i) => (
              <Reveal key={num} delay={i * 0.08} direction="up">
                <div className="bg-[#FBF5E9] rounded-3xl p-6 flex flex-col gap-4 h-full">
                  <span className="font-display font-black text-4xl" style={{ color }}>{num}</span>
                  <h3 className="font-display font-bold text-xl text-[#2A1506]">{title}</h3>
                  <p className="font-body text-base text-[#2A1506]/60 leading-relaxed flex-1">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[#2A1506] rounded-3xl p-8">
              <div className="flex-1">
                <h3 className="font-display font-bold text-2xl text-[#FBF5E9] mb-2">Tu as une idée en tête ?</h3>
                <p className="font-body text-base text-[#FBF5E9]/60">Dis-moi tout, même une idée vague, on la développe ensemble.</p>
              </div>
              <a href="mailto:contact.atelierlvy@gmail.com?subject=Commande sur mesure" className={btn.orange}>Faire une demande →</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CUISSONS */}
      <section className="py-16">
        <div className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
          <Reveal>
            <div className="bg-[#F2A0A8]/20 border border-[#F2A0A8]/40 rounded-3xl px-6 py-3 md:px-8 md:py-2 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#D97080] mb-3">Services</p>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-[#2A1506] mb-4 leading-tight">Cuissons extérieures</h2>
                <p className="font-body text-[#2A1506]/60 text-base leading-relaxed max-w-sm">
                  Tu as modelé des pièces ailleurs et tu cherches un four ? Je propose des cuissons pour des projets extérieurs. Contacte-moi pour les tarifs et conditions.
                </p>
              </div>
              <img
                src={imgFourMarron}
                alt="Illustration d'un four de céramiste"
                className="w-72 object-contain mix-blend-multiply contrast-[1.1] shrink-0 pointer-events-none"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
              <a href="mailto:contact.atelierlvy@gmail.com?subject=Cuisson extérieure" className={`${btn.dark} shrink-0`}>Me contacter</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MODAL PRODUIT */}
      <AnimatePresence>
        {openProduit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setLightboxIndex(null); setOpenProduit(null) }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FBF5E9] rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Galerie — centrée verticalement pour éviter le vide en bas quand il y a peu de photos */}
              <div className="flex items-center justify-center bg-white p-3">
                <div className={`grid gap-2 w-full ${openProduit.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {openProduit.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className={`overflow-hidden rounded-xl group ${openProduit.images.length === 1 ? 'aspect-[4/5]' : i === 0 && openProduit.images.length % 2 !== 0 ? 'col-span-2 aspect-[8/5]' : 'aspect-square'}`}
                    >
                      <img
                        src={img.thumb}
                        alt={`${openProduit.nom} — ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Infos */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <span className="font-ui text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-lg" style={{ backgroundColor: `${catColor(openProduit)}25`, color: catColor(openProduit) }}>
                    {catLabel(openProduit)}
                  </span>
                  {collectionsParId[openProduit.collection_id] && (
                    <span className="font-ui text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-lg mr-auto" style={{ backgroundColor: `${collectionsParId[openProduit.collection_id].couleur}25`, color: collectionsParId[openProduit.collection_id].couleur }}>
                      Collection {collectionsParId[openProduit.collection_id].label}
                    </span>
                  )}
                  <button
                    onClick={() => setOpenProduit(null)}
                    className="w-9 h-9 rounded-full bg-[#2A1506]/10 hover:bg-[#2A1506]/20 flex items-center justify-center transition-colors shrink-0"
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="#2A1506" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-display font-bold text-3xl mt-3 mb-2">{openProduit.nom}</h3>
                {openProduit.stock === 0 ? (
                  <p className="font-ui font-bold text-sm uppercase tracking-widest mb-5 inline-flex items-center gap-2 text-[#2A1506]/50">
                    <span className="w-2 h-2 rounded-full bg-[#F2A0A8]" /> Pièce vendue
                  </p>
                ) : (
                  <p className="font-display font-bold text-2xl mb-5" style={{ color: catColor(openProduit) }}>
                    {openProduit.prix != null ? formatPrix(openProduit.prix) : 'Prix à venir'}
                    {openProduit.stock > 1 && <span className="font-ui font-semibold text-xs text-[#2A1506]/40 ml-3 align-middle">{openProduit.stock} disponibles</span>}
                  </p>
                )}
                <p className="font-body leading-relaxed mb-8 text-[#2A1506]/70">
                  {openProduit.description || defaultDescription(categorieDe(openProduit)?.slug)}
                </p>
                <div className="mt-auto">
                  {openProduit.stock === 0 ? null : openProduit.prix == null ? (
                    <a
                      href={`mailto:contact.atelierlvy@gmail.com?subject=${encodeURIComponent(`À propos de « ${openProduit.nom} »`)}`}
                      className={`${btn.outline} w-full text-center`}
                    >
                      Écrivez-moi pour cette pièce →
                    </a>
                  ) : qteDansPanier(openProduit.slug) >= openProduit.stock ? (
                    <button
                      onClick={() => { setOpenProduit(null); ouvrirPanier(true) }}
                      className="w-full font-ui font-semibold text-sm px-8 py-3.5 bg-[#9BBF90]/20 text-[#2A1506] border-2 border-[#9BBF90] rounded-xl hover:bg-[#9BBF90]/40 transition-all duration-200"
                    >
                      ✓ Dans le panier — voir le panier
                    </button>
                  ) : (
                    <button
                      onClick={() => addItem({ slug: openProduit.slug, nom: openProduit.nom, image: openProduit.images[0]?.thumb })}
                      className={`${btn.orange} w-full text-center`}
                    >
                      {qteDansPanier(openProduit.slug) > 0 ? `Ajouter un autre exemplaire (${qteDansPanier(openProduit.slug)} dans le panier)` : 'Ajouter au panier →'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && openProduit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {openProduit.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => Math.max(0, i - 1)) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={openProduit.images[lightboxIndex].full}
              alt={`${openProduit.nom} — ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {openProduit.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => Math.min(openProduit.images.length - 1, i + 1)) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {openProduit.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {openProduit.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                    className={`w-2 h-2 rounded-full transition-all ${i === lightboxIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
