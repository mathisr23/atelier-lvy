import { useState } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import Reveal from '../components/Reveal'
import PanierIllustre from '../components/PanierIllustre'
import { Soleil, Fleur } from '../components/Graphique'
import { useCart } from '../context/CartContext'
import { useCatalogue } from '../context/CatalogueContext'
import { supabase } from '../lib/supabase'
import { SEUIL_LIVRAISON_OFFERTE, optionsLivraison, poidsPiecesPanier } from '../data/livraison'

const formatEuros = (n) => `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })} €`
const MAX_DANS_LE_PANIER = 12 // au-delà, le dessin devient illisible : la liste reste complète

export default function Panier() {
  useSEO({ title: 'Panier — Léa Artiste céramiste', description: 'Les pièces que vous avez choisies dans la boutique de l’atelier.' })
  const { items, removeItem, setQte } = useCart()
  const { produitsParSlug } = useCatalogue()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const total = items.reduce((sum, i) => sum + (Number(produitsParSlug[i.slug]?.prix) || 0) * i.qte, 0)
  const nbPieces = items.reduce((n, i) => n + i.qte, 0)
  const livraisonOfferte = total >= SEUIL_LIVRAISON_OFFERTE
  const resteAvantOfferte = SEUIL_LIVRAISON_OFFERTE - total
  const estIndisponible = (i) => {
    const p = produitsParSlug[i.slug]
    return !p || p.prix == null || p.stock < i.qte
  }
  const indisponibles = items.filter(estIndisponible)
  // Seules les pièces encore disponibles comptent dans le poids du colis
  const itemsDispo = items.filter((i) => !estIndisponible(i))
  // Options d'envoi selon le poids réel du panier (même grille que le serveur) ; vide = trop lourd pour l'envoi en ligne
  const optionsEnvoi = optionsLivraison(poidsPiecesPanier(itemsDispo, produitsParSlug))

  // Une pièce dessinée par exemplaire : deux tasses identiques = deux tasses dans le panier
  const piecesDessinees = items
    .flatMap((item) => {
      const p = produitsParSlug[item.slug]
      return Array.from({ length: item.qte }, (_, n) => ({
        cle: `${item.slug}-${n}`,
        nom: p?.nom ?? item.nom,
        prix: p?.prix != null ? formatEuros(Number(p.prix)) : null,
        photo: p?.images?.[0]?.thumb ?? item.image,
        detouree: p?.images?.[0]?.detouree ?? null,
      }))
    })
    .slice(0, MAX_DANS_LE_PANIER)

  const handleCheckout = async () => {
    setError(null)
    if (indisponibles.length > 0) {
      setError('Retire les pièces indisponibles du panier avant de continuer.')
      return
    }
    setLoading(true)
    const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
      body: { items: items.map((i) => ({ slug: i.slug, qte: i.qte })) },
    })
    if (fnError || !data?.url) {
      setError("Impossible de lancer le paiement pour l'instant. Réessaie dans un instant.")
      setLoading(false)
      return
    }
    window.location.href = data.url
  }

  return (
    <div className="bg-[#FBF5E9] pt-24 md:pt-28 min-h-screen relative overflow-hidden">
      <Soleil taille={40} couleur="#F3D07A" className="absolute top-28 right-[8%] animate-[spin_24s_linear_infinite]" />
      <Fleur taille={30} couleur="#F2A0A8" className="absolute top-[22rem] left-[3%] hidden md:block" />

      <section className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 pb-24">
        <Reveal>
          <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#D97080] mb-4 inline-flex items-center gap-2">
            <span className="w-6 h-px bg-[#D97080]" /> Le panier de l'atelier
          </p>
          <h1 className="font-display font-black leading-[0.9] mb-10 md:mb-14 text-[#2A1506]" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.2rem)' }}>
            Ton <span className="italic text-[#E87040]">panier</span>
            {nbPieces > 0 && <span className="font-ui font-semibold text-base text-[#2A1506]/40 align-middle ml-4">{nbPieces} pièce{nbPieces > 1 ? 's' : ''}</span>}
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10 lg:gap-12 items-start">
          {/* Le panier dessiné */}
          <div className="relative">
            <PanierIllustre pieces={piecesDessinees} />
            {items.length === 0 && (
              <div className="flex flex-col items-center text-center mt-8">
                <p className="font-display italic text-2xl md:text-3xl text-[#2A1506]/60">Ton panier est vide… pour l'instant</p>
                <Link to="/boutique" className="mt-4 font-ui font-semibold text-sm px-6 py-3 bg-[#2A1506] text-[#FBF5E9] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] transition-colors">
                  Aller remplir le panier →
                </Link>
              </div>
            )}
          </div>

          {/* Le récapitulatif */}
          {items.length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-[#2A1506] shadow-[6px_6px_0_#2A1506] p-6 md:p-7 lg:sticky lg:top-28">
              <div className="flex flex-col gap-3">
                {items.map((item) => {
                  const p = produitsParSlug[item.slug]
                  const epuise = !p || p.stock === 0
                  const indispo = estIndisponible(item)
                  return (
                    <div key={item.slug} className={`flex gap-3 items-center rounded-xl p-2 ${indispo ? 'bg-[#F2A0A8]/15' : ''}`}>
                      <img src={p?.images?.[0]?.thumb ?? item.image} alt="" className={`w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[#FBF5E9] shadow ${epuise ? 'grayscale opacity-60' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm leading-snug truncate">{p?.nom ?? item.nom}</p>
                        <p className="font-ui text-xs text-[#2A1506]/50 mt-0.5">
                          {epuise ? (
                            <span className="text-[#D97080] font-semibold">Vendue entre-temps</span>
                          ) : indispo && p.prix != null ? (
                            <span className="text-[#D97080] font-semibold">Plus que {p.stock} en stock</span>
                          ) : p.prix != null ? (
                            formatEuros(Number(p.prix) * item.qte)
                          ) : (
                            'Prix à venir'
                          )}
                        </p>
                        {/* Quantité — uniquement pour les pièces faites en plusieurs exemplaires */}
                        {!epuise && p.stock > 1 && (
                          <div className="inline-flex items-center gap-1 mt-1.5 bg-[#FBF5E9] rounded-lg border border-[#2A1506]/10">
                            <button onClick={() => setQte(item.slug, item.qte - 1)} className="w-7 h-7 font-ui text-sm text-[#2A1506]/60 hover:text-[#E87040]" aria-label="Retirer un exemplaire">−</button>
                            <span className="font-ui text-xs font-semibold w-5 text-center">{item.qte}</span>
                            <button onClick={() => setQte(item.slug, item.qte + 1)} disabled={item.qte >= p.stock} className="w-7 h-7 font-ui text-sm text-[#2A1506]/60 hover:text-[#E87040] disabled:opacity-30" aria-label="Ajouter un exemplaire">+</button>
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeItem(item.slug)} className="font-ui text-xs text-[#2A1506]/35 hover:text-[#D97080] transition-colors px-2 py-1">
                        Retirer
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="border-t-2 border-dashed border-[#2A1506]/15 mt-5 pt-5">
                <div className="flex flex-col gap-1.5 mb-4 font-ui text-sm text-[#2A1506]/60">
                  <div className="flex items-center justify-between">
                    <span>Sous-total</span>
                    <span>{formatEuros(total)}</span>
                  </div>
                  {itemsDispo.length > 0 && (
                    <>
                      {optionsEnvoi.map((option) => (
                        <div key={option.cle} className="flex items-center justify-between gap-3">
                          <span>{option.label}</span>
                          <span className="shrink-0">{livraisonOfferte ? <span className="text-[#6E9A62] font-semibold">Offerte</span> : formatEuros(option.prix)}</span>
                        </div>
                      ))}
                      <p className="text-xs text-[#2A1506]/40">ou retrait gratuit à l'atelier, au choix lors du paiement</p>
                      {optionsEnvoi.length === 0 && (
                        <p className="text-xs text-[#D97080]">Ce colis est trop lourd pour l'envoi en ligne : retrait à l'atelier, ou écris-moi pour un envoi sur mesure.</p>
                      )}
                    </>
                  )}
                </div>
                {!livraisonOfferte && (
                  <div className="mb-4">
                    <p className="font-ui text-xs text-[#2A1506]/60 mb-1.5">
                      Plus que <strong className="text-[#E87040]">{formatEuros(resteAvantOfferte)}</strong> pour la livraison offerte
                    </p>
                    <div className="h-1.5 rounded-full bg-[#2A1506]/10 overflow-hidden">
                      <div className="h-full bg-[#9BBF90] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (total / SEUIL_LIVRAISON_OFFERTE) * 100)}%` }} />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-ui text-sm text-[#2A1506]/60">Total hors livraison</span>
                  <span className="font-display font-bold text-3xl">{formatEuros(total)}</span>
                </div>
                {error && <p className="font-ui text-xs text-[#D97080] mb-3">{error}</p>}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? 'Redirection…' : 'Passer commande →'}
                </button>
                <p className="font-ui text-[0.65rem] text-[#2A1506]/35 text-center mt-3">Paiement sécurisé par Stripe</p>
                <Link to="/boutique" className="block text-center font-ui text-xs font-semibold text-[#2A1506]/60 hover:text-[#E87040] mt-4">
                  ← Continuer mes achats
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
