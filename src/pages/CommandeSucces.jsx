import { Link, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import useSEO from '../hooks/useSEO'
import { Asterisk } from '../components/Deco'
import Reveal from '../components/Reveal'
import { useCart } from '../context/CartContext'
import { useCatalogue } from '../context/CatalogueContext'

export default function CommandeSucces() {
  useSEO({ title: 'Commande confirmée — Léa Artiste céramiste', description: 'Merci pour votre commande.' })
  const { clear } = useCart()
  const { refresh } = useCatalogue()
  const [params] = useSearchParams()

  useEffect(() => {
    // On ne vide le panier que si l'on revient réellement d'un paiement Stripe
    if (params.get('session_id')) clear()
    refresh() // stocks à jour après l'achat
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-[#FBF5E9] pt-20 min-h-screen flex items-center">
      <section className="px-6 md:px-16 lg:px-24 py-24 max-w-3xl mx-auto text-center relative">
        <Asterisk size={28} color="#9BBF90" className="absolute top-8 left-8 opacity-30 rotate-12" />
        <Asterisk size={20} color="#E87040" className="absolute bottom-8 right-12 opacity-30 -rotate-12" />
        <Reveal direction="scale">
          <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#9BBF90] mb-4">Commande confirmée</p>
          <h1 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
            Merci <span className="italic text-[#E87040]">beaucoup</span> !
          </h1>
          <p className="font-body text-[#2A1506]/60 text-lg mb-10 max-w-md mx-auto">
            Votre paiement a bien été reçu. Un reçu vous a été envoyé par e-mail. Léa emballe votre pièce avec soin et vous recontacte très vite pour l'expédition ou le retrait à l'atelier.
          </p>
          <Link to="/boutique" className="inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200">
            Retour à la boutique
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
