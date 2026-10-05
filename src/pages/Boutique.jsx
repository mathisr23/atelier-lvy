import { useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { Bandeau, RubanOndule, Festons, BandeRayee, BandeDamier, PhotoForme, Tampon, Soleil, Fleur, rayures } from '../components/Graphique'
import { SEUIL_LIVRAISON_OFFERTE } from '../data/livraison'
import Reveal from '../components/Reveal'
import { useCatalogue } from '../context/CatalogueContext'
import { VENTE_OUVERTE } from '../lib/vente'
import { btn } from '../lib/boutique'
import ProduitCarte from '../components/ProduitCarte'
import photoBoutique1 from '../assets/boutique/boutique1.jpg'
import photoBoutique2 from '../assets/boutique/boutique2-petit.jpg'


const BANDEAU_HAUT = [
  'Pièces uniques & petites séries',
  'Façonnées à la main',
  "Cuites à l'atelier",
  `Livraison offerte dès ${SEUIL_LIVRAISON_OFFERTE} €`,
  "Retrait gratuit à l'atelier",
]
const RUBAN = ['Grès', 'Émaillé à la main', 'Modelé à la main', 'Pièces uniques', 'Fait avec amour']
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
  const { produits, categoriesActives, collectionsActives, categoriesParId, collectionsParId, loading } = useCatalogue()

  const categorieDe = (p) => categoriesParId[p.categorie_id]

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

  // Photos du haut de page : choisies par Léa (src/assets/boutique)
  const photosHero = [photoBoutique1, photoBoutique2]

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
              <PhotoForme forme="nuage" src={photosHero[0]} alt="Pièce en céramique de l'atelier" fond="#9BBF90" ombre="#9BBF90" className="absolute right-0 top-0 w-[80%] aspect-square" />
              <PhotoForme forme="fleur" src={photosHero[1]} alt="" fond="#F3D07A" ombre="#F3D07A" className="absolute left-0 bottom-0 w-[44%] aspect-square" />
              <Tampon taille={112} fond="#F3D07A" className="absolute left-[4%] top-[6%]" />
              <Soleil taille={54} couleur="#E87040" className="absolute right-[2%] bottom-[8%] animate-[spin_22s_linear_infinite]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ruban ondulé */}
      <RubanOndule items={RUBAN} fond="#2A1506" couleur="#F3D07A" fondHaut="#FCE4E1" fondBas="#FBF5E9" defile={false} />

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
            {filtered.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i * 0.04, 0.3)} direction="up">
                <ProduitCarte produit={p} categorie={categorieDe(p)} />
              </Reveal>
            ))}
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

    </div>
  )
}
