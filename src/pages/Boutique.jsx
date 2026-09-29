import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { motion, AnimatePresence } from 'framer-motion'
import { Bandeau, RubanOndule, Festons, BandeRayee, BandeDamier, PhotoForme, Tampon, Soleil, Fleur, rayures } from '../components/Graphique'
import { SEUIL_LIVRAISON_OFFERTE } from '../data/livraison'
import Reveal from '../components/Reveal'
import { useCatalogue } from '../context/CatalogueContext'
import { useCart } from '../context/CartContext'
import { VENTE_OUVERTE } from '../lib/vente'

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

const BANDEAU_HAUT = [
  'Pièces uniques & petites séries',
  'Façonnées à la main',
  "Cuites à l'atelier",
  `Livraison offerte dès ${SEUIL_LIVRAISON_OFFERTE} €`,
  "Retrait gratuit à l'atelier",
]
const RUBAN = ['Grès', 'Émaillé à la main', 'Tourné & modelé', 'Pièces uniques', 'Fait avec amour']
const FORMES_COLLECTIONS = ['fleur', 'nuage']

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

  // Photos du haut de page : de vraies pièces du catalogue (disponibles de préférence)
  const photosHero = [...produits.filter(p => p.stock > 0), ...produits]
    .filter(p => p.images?.[0])
    .slice(0, 2)
    .map(p => p.images[0])

  return (
    <div className="bg-[#FBF5E9] pt-[65px] md:pt-[113px] overflow-x-hidden">
      <Bandeau items={BANDEAU_HAUT} fond="#F2A0A8" couleur="#2A1506" />

      {/* HERO */}
      <section className="relative bg-[#FCE4E1]">
        <Fleur taille={46} couleur="#F3D07A" coeur="#E87040" className="absolute top-10 left-[46%] hidden lg:block" />
        <Soleil taille={30} couleur="#9BBF90" className="absolute bottom-16 left-8 md:left-16" />
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 pt-12 pb-16 md:pt-16 md:pb-20 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <Reveal>
              <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#D97080] mb-5 inline-flex items-center gap-2">
                <span className="w-6 h-px bg-[#D97080]" /> La boutique de l'atelier
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display font-black leading-[0.88] mb-8 text-[#2A1506]" style={{ fontSize: 'clamp(3.4rem, 9vw, 6.8rem)' }}>
                Ce que je<br />
                <span className="relative inline-block italic text-[#E87040]">
                  propose.
                  <svg viewBox="0 0 300 20" className="absolute -bottom-3 left-0 w-full" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M4 14 Q 40 2 80 12 T 160 12 T 240 10 T 296 8" stroke="#9BBF90" strokeWidth="5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-body text-[#2A1506]/70 text-xl max-w-lg leading-relaxed mb-9">
                Venez découvrir mes créations ou bien faites moi part de vos idées les plus folles pour créer des objets sur mesures répondant à vos gouts et besoins !
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="#mes-pieces" className={btn.orange}>Mes pièces</a>
                <a href="#sur-mesure" className={btn.dark}>Création sur mesure</a>
              </div>
            </Reveal>
          </div>

          {/* Photos découpées façon fleur / nuage */}
          <Reveal direction="left" delay={0.15} className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-[30rem] aspect-square">
              <PhotoForme forme="nuage" src={photosHero[0]?.full} alt="Pièce en céramique de l'atelier" fond="#9BBF90" ombre="#9BBF90" className="absolute right-0 top-0 w-[80%] aspect-square" />
              <PhotoForme forme="fleur" src={photosHero[1]?.thumb} alt="" fond="#F3D07A" ombre="#F3D07A" className="absolute left-0 bottom-0 w-[44%] aspect-square" />
              <Tampon taille={112} fond="#F3D07A" className="absolute left-[4%] top-[6%]" />
              <Soleil taille={54} couleur="#E87040" className="absolute right-[2%] bottom-[8%] animate-[spin_22s_linear_infinite]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ruban ondulé */}
      <RubanOndule items={RUBAN} fond="#2A1506" couleur="#F3D07A" fondHaut="#FCE4E1" fondBas="#FBF5E9" />

      {/* COLLECTIONS */}
      {VENTE_OUVERTE && collectionsActives.length > 0 && (
        <section className="relative px-6 md:px-16 lg:px-24 pt-16 pb-20">
          <Fleur taille={34} couleur="#C9B8E8" coeur="#FBF5E9" className="absolute top-12 right-8 md:right-24" />
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-3">Trouver son univers</p>
                <h2 className="font-display font-black text-4xl md:text-6xl leading-none">Les <span className="italic text-[#D97080]">collections</span></h2>
              </div>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 md:gap-x-14">
              {collectionsActives.map((c, i) => {
                const pieces = produits.filter(p => p.collection_id === c.id)
                const active = collectionActive === c.slug
                return (
                  <Reveal key={c.id} delay={i * 0.08} direction="up">
                    <button
                      onClick={() => { setFiltre('collection', c.slug); allerAuxPieces() }}
                      className="group flex flex-col items-center gap-4 w-40 md:w-56"
                    >
                      <div className="relative w-full aspect-square transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                        <PhotoForme forme={FORMES_COLLECTIONS[i % FORMES_COLLECTIONS.length]} src={pieces[0]?.images?.[0]?.thumb} alt={`Collection ${c.label}`} fond={c.couleur} ombre={c.couleur} className="w-full h-full" />
                        {active && <Soleil taille={40} couleur={c.couleur} className="absolute -top-2 -right-2 animate-[spin_12s_linear_infinite]" />}
                      </div>
                      <span className="font-display font-bold text-2xl md:text-3xl leading-none underline decoration-[3px] underline-offset-[6px]" style={{ textDecorationColor: c.couleur }}>
                        {c.label}
                      </span>
                      <span className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-[#2A1506]/50 -mt-2">
                        {pieces.length} pièce{pieces.length > 1 ? 's' : ''} →
                      </span>
                    </button>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <BandeRayee a="#F3D07A" />

      {/* MES PIÈCES — fond rayé, cartes en arche */}
      <section id="mes-pieces" className="relative px-4 md:px-12 lg:px-20 py-16 md:py-20 scroll-mt-24" style={rayures('#DCE8F4', '#FBF5E9', 26)}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="relative bg-[#FBF5E9] border-2 border-[#2A1506] rounded-[2rem] px-6 py-7 md:px-10 md:py-9 mb-12 shadow-[6px_6px_0_#2A1506]">
              <Tampon taille={92} fond="#E87040" texte="nouvelles pièces ✺ fait main ✺ " className="absolute -top-10 -right-3 md:-right-8 hidden sm:block" />
              <h2 className="font-display font-black text-4xl md:text-5xl mb-2">Mes pièces</h2>
              <p className="font-body text-[#2A1506]/70 text-lg max-w-2xl mb-7">
                Des créations faites à la main en grès, pièces uniques ou en petites séries.
              </p>

              {/* Filtres : collection (univers) × type d'objet — combinables (masqués tant que la vente est fermée) */}
              <div className={`flex flex-col gap-3 ${VENTE_OUVERTE ? '' : 'hidden'}`}>
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
                        className={`font-ui text-sm font-semibold px-4 py-1.5 rounded-full border-2 transition-all duration-150 inline-flex items-center gap-2 ${actif === c.slug ? 'border-[#2A1506] text-[#2A1506] -rotate-2' : 'bg-white border-[#2A1506]/15 text-[#2A1506]/70 hover:border-[#2A1506] hover:-rotate-1'}`}
                        style={actif === c.slug ? { backgroundColor: c.couleur } : undefined}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: actif === c.slug ? '#2A1506' : c.couleur }} />
                        {c.label}
                        {actif === c.slug && <span aria-hidden="true" className="-mr-1 opacity-60">✕</span>}
                      </button>
                    ))}
                  </div>
                ))}
                {(typeActif || collectionActive) && (
                  <p className="font-ui text-sm text-[#2A1506]/60 mt-1">
                    {filtered.length} pièce{filtered.length > 1 ? 's' : ''}
                    <button onClick={toutVoir} className="ml-3 font-semibold text-[#E87040] underline underline-offset-2 hover:text-[#2A1506]">Tout voir</button>
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          {/* Vente fermée : aperçu flouté des pièces + encart « bientôt » */}
          {!VENTE_OUVERTE && (
            <div className="relative z-10 flex justify-center">
              <div className="absolute top-8 md:top-16 mx-4 max-w-lg w-[calc(100%-2rem)] bg-[#FBF5E9] border-2 border-[#2A1506] rounded-[2rem] px-6 py-9 md:px-10 md:py-12 text-center shadow-[6px_6px_0_#2A1506]">
                <Tampon taille={96} fond="#F3D07A" texte="bientôt ✺ boutique en ligne ✺ " className="absolute -top-12 left-1/2 -translate-x-1/2" />
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mt-6 mb-3">Encore un peu de patience</p>
                <h3 className="font-display font-black text-3xl md:text-4xl leading-tight mb-4">
                  La boutique en ligne <span className="italic text-[#D97080]">ouvre bientôt</span>
                </h3>
                <p className="font-body text-lg text-[#2A1506]/70 mb-7">
                  Les pièces sont en train de sortir du four ! En attendant, une création te plaît ? Écris-moi, on s'arrange ensemble.
                </p>
                <a href="mailto:contact.atelierlvy@gmail.com?subject=Une pièce de la boutique" className={btn.orange}>Écris-moi →</a>
              </div>
            </div>
          )}

          {/* Grille produits */}
          <div
            className={`grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 ${VENTE_OUVERTE ? '' : 'blur-[6px] opacity-70 pointer-events-none select-none max-h-[46rem] md:max-h-[52rem] overflow-hidden'}`}
            aria-hidden={!VENTE_OUVERTE}
          >
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#FBF5E9] rounded-[2rem] p-3">
                <div className="aspect-[4/5] rounded-t-full rounded-b-2xl bg-[#2A1506]/5 mb-4" />
                <div className="h-4 w-2/3 rounded bg-[#2A1506]/5" />
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full text-center py-16 bg-[#FBF5E9] rounded-[2rem] border-2 border-[#2A1506]">
                <p className="font-display italic text-3xl text-[#2A1506]/30 mb-4">Rien pour l'instant ici…</p>
                <button onClick={toutVoir} className={btn.outline}>Voir toutes les pièces</button>
              </div>
            )}
            {filtered.map((p, i) => {
              const vendu = p.stock === 0
              return (
                <Reveal key={p.slug} delay={Math.min(i * 0.04, 0.3)} direction="up">
                  <button
                    onClick={() => setOpenProduit(p)}
                    className="group text-left w-full bg-[#FBF5E9] border-2 border-[#2A1506] rounded-[2rem] p-2.5 md:p-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[6px_6px_0_#2A1506]"
                  >
                    <div className="relative aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden mb-3 md:mb-4" style={{ backgroundColor: `${catColor(p)}40` }}>
                      <img
                        src={p.images[0]?.thumb}
                        alt={p.nom}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${vendu ? 'grayscale opacity-70' : ''}`}
                        loading="lazy"
                      />
                      {vendu && (
                        <span className="absolute bottom-3 right-3 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F2A0A8] border-2 border-[#2A1506] flex items-center justify-center rotate-12 font-ui text-[0.6rem] md:text-xs font-bold uppercase tracking-widest text-[#2A1506]">
                          Vendu
                        </span>
                      )}
                      {!vendu && p.stock === 1 && (
                        <span className="absolute top-[18%] left-3 font-ui text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-[#FBF5E9] border border-[#2A1506] -rotate-6">
                          Pièce unique
                        </span>
                      )}
                    </div>
                    <div className="px-1.5 md:px-2 pb-1">
                      <p className="font-ui text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] mb-1" style={{ color: catColor(p) }}>
                        {catLabel(p)}
                      </p>
                      <div className="flex flex-col items-start gap-1.5 md:flex-row md:items-end md:justify-between md:gap-2">
                        <p className="font-display font-bold text-sm md:text-lg leading-snug">{p.nom}</p>
                        {vendu ? (
                          <span className="font-ui text-xs font-bold shrink-0 text-[#2A1506]/40">Vendu</span>
                        ) : p.prix != null && (
                          <span className="font-ui text-xs md:text-sm font-bold shrink-0 bg-[#F3D07A] rounded-full px-2.5 py-1">{formatPrix(p.prix)}</span>
                        )}
                      </div>
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <BandeDamier a="#C9B8E8" />

      {/* SUR COMMANDE */}
      <div className="pt-16"><Festons couleur="#9BBF90" /></div>
      <section id="sur-mesure" className="px-6 md:px-16 lg:px-24 py-20 relative scroll-mt-24" style={{ backgroundColor: '#9BBF90', backgroundImage: 'radial-gradient(circle, rgba(42,21,6,0.1) 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }}>
        <Soleil taille={64} couleur="#F3D07A" className="absolute top-10 right-8 md:right-16 animate-[spin_30s_linear_infinite]" />
        <Fleur taille={40} couleur="#FBF5E9" coeur="#E87040" className="absolute bottom-16 left-6" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/60 mb-4">Création personnalisée</p>
            <h2 className="font-display font-black text-5xl md:text-6xl text-[#2A1506] leading-[0.95] max-w-xl mb-14">
              Une pièce<br /><span className="italic">rien que pour toi</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {steps.map(({ num, title, text, color }, i) => (
              <Reveal key={num} delay={i * 0.08} direction="up">
                <div className="bg-[#FBF5E9] border-2 border-[#2A1506] rounded-[2rem] p-6 pt-8 flex flex-col gap-4 h-full relative shadow-[5px_5px_0_#2A1506]">
                  <div className="relative w-16 h-16">
                    <Fleur taille={64} couleur={color} coeur={color} className="absolute inset-0" />
                    <span className="absolute inset-0 flex items-center justify-center font-display font-black text-xl text-[#2A1506]">{num}</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[#2A1506]">{title}</h3>
                  <p className="font-body text-lg text-[#2A1506]/70 leading-relaxed flex-1">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="relative flex flex-col md:flex-row items-center gap-6 bg-[#2A1506] rounded-[2rem] p-8 md:p-10 overflow-hidden">
              <div className="absolute inset-y-0 right-0 w-24 hidden md:block opacity-90" style={rayures('#E87040', '#2A1506', 10)} aria-hidden="true" />
              <div className="flex-1 relative">
                <h3 className="font-display font-bold text-3xl text-[#FBF5E9] mb-2">Tu as une idée en tête ?</h3>
                <p className="font-body text-lg text-[#FBF5E9]/60">Dis-moi tout, même une idée vague, on la développe ensemble.</p>
              </div>
              <a href="mailto:contact.atelierlvy@gmail.com?subject=Commande sur mesure" className={`${btn.orange} relative md:mr-24`}>Faire une demande →</a>
            </div>
          </Reveal>
        </div>
      </section>
      <Festons couleur="#9BBF90" inverse />

      {/* CUISSONS */}
      <section className="py-16 md:py-20">
        <div className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
          <Reveal>
            <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-8 bg-[#F8CDB8] border-2 border-[#2A1506] rounded-[2rem] overflow-hidden">
              <div className="self-stretch min-h-24 md:w-40" style={rayures('#C9B8E8', '#FBF5E9', 12)} aria-hidden="true" />
              <div className="px-6 md:px-0">
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#D97080] mb-3">Services</p>
                <h2 className="font-display font-black text-3xl md:text-5xl text-[#2A1506] mb-4 leading-none">Cuissons extérieures</h2>
                <p className="font-body text-[#2A1506]/70 text-lg leading-relaxed max-w-md">
                  Tu as modelé des pièces ailleurs et tu cherches un four ? Je propose des cuissons pour des projets extérieurs. Contacte-moi pour les tarifs et conditions.
                </p>
              </div>
              <div className="flex flex-col items-center gap-5 px-6 pb-8 md:py-8 md:pr-10">
                <Tampon taille={104} fond="#FBF5E9" texte="cuissons ✺ four à céramique ✺ " />
                <a href="mailto:contact.atelierlvy@gmail.com?subject=Cuisson extérieure" className={`${btn.dark} shrink-0`}>Me contacter</a>
              </div>
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
                  {openProduit.stock === 0 ? null : openProduit.prix == null || !VENTE_OUVERTE ? (
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
