import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useCatalogue } from '../context/CatalogueContext'
import { supabase } from '../lib/supabase'
import { FRAIS_LIVRAISON, SEUIL_LIVRAISON_OFFERTE } from '../data/livraison'

const formatEuros = (n) => `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })} €`

export default function CartDrawer() {
  const { items, removeItem, setQte, open, setOpen } = useCart()
  const { produitsParSlug } = useCatalogue()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const total = items.reduce((sum, i) => sum + (Number(produitsParSlug[i.slug]?.prix) || 0) * i.qte, 0)
  const livraisonOfferte = total >= SEUIL_LIVRAISON_OFFERTE
  const fraisLivraison = livraisonOfferte ? 0 : FRAIS_LIVRAISON
  const resteAvantOfferte = SEUIL_LIVRAISON_OFFERTE - total
  const estIndisponible = (i) => {
    const p = produitsParSlug[i.slug]
    return !p || p.prix == null || p.stock < i.qte
  }
  const indisponibles = items.filter(estIndisponible)

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
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-[#FBF5E9] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A1506]/10">
              <h2 className="font-display font-bold text-2xl">Panier {items.length > 0 && `(${items.reduce((n, i) => n + i.qte, 0)})`}</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-[#2A1506]/10 hover:bg-[#2A1506]/20 flex items-center justify-center transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="#2A1506" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-display italic text-3xl text-[#2A1506]/15">Panier vide</p>
                  <p className="font-ui text-sm text-[#2A1506]/40 mt-3">Va faire un tour dans la boutique !</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => {
                    const p = produitsParSlug[item.slug]
                    const epuise = !p || p.stock === 0
                    const indispo = estIndisponible(item)
                    return (
                      <div key={item.slug} className={`flex gap-3 items-center rounded-xl p-2 ${indispo ? 'bg-[#F2A0A8]/10' : ''}`}>
                        <img src={p?.images?.[0]?.thumb ?? item.image} alt={p?.nom ?? item.nom} className={`w-16 h-16 rounded-lg object-cover shrink-0 ${epuise ? 'grayscale opacity-60' : ''}`} />
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
                            <div className="inline-flex items-center gap-1 mt-1.5 bg-white rounded-lg border border-[#2A1506]/10">
                              <button onClick={() => setQte(item.slug, item.qte - 1)} className="w-7 h-7 font-ui text-sm text-[#2A1506]/60 hover:text-[#E87040]" aria-label="Retirer un exemplaire">−</button>
                              <span className="font-ui text-xs font-semibold w-5 text-center">{item.qte}</span>
                              <button onClick={() => setQte(item.slug, item.qte + 1)} disabled={item.qte >= p.stock} className="w-7 h-7 font-ui text-sm text-[#2A1506]/60 hover:text-[#E87040] disabled:opacity-30" aria-label="Ajouter un exemplaire">+</button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="font-ui text-xs text-[#2A1506]/30 hover:text-[#F2A0A8] transition-colors px-2 py-1"
                        >
                          Retirer
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#2A1506]/10 px-6 py-5">
                <div className="flex flex-col gap-1.5 mb-4 font-ui text-sm text-[#2A1506]/60">
                  <div className="flex items-center justify-between">
                    <span>Sous-total</span>
                    <span>{formatEuros(total)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Livraison Colissimo</span>
                    <span>{livraisonOfferte ? <span className="text-[#6E9A62] font-semibold">Offerte</span> : formatEuros(FRAIS_LIVRAISON)}</span>
                  </div>
                  <p className="text-xs text-[#2A1506]/40">ou retrait gratuit à l'atelier, au choix lors du paiement</p>
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
                <div className="flex items-center justify-between mb-4 pt-3 border-t border-dashed border-[#2A1506]/15">
                  <span className="font-ui text-sm text-[#2A1506]/60">Total</span>
                  <span className="font-display font-bold text-2xl">{formatEuros(total + fraisLivraison)}</span>
                </div>
                {error && <p className="font-ui text-xs text-[#D97080] mb-3">{error}</p>}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? 'Redirection…' : 'Passer commande →'}
                </button>
                <p className="font-ui text-[0.65rem] text-[#2A1506]/30 text-center mt-3">Paiement sécurisé par Stripe</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
