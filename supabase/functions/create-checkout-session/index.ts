// Crée une session Stripe Checkout pour les pièces du panier.
// Le prix vient TOUJOURS de la base (jamais du client) pour éviter toute manipulation.
import Stripe from 'npm:stripe@17.4.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-11-20.acacia' })
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

// Livraison — garder synchronisé avec src/data/livraison.js (affichage dans le panier)
const EMBALLAGE_MIN_G = 100
const EMBALLAGE_MAX_G = 800
const emballageG = (poidsPiecesG) => Math.min(EMBALLAGE_MAX_G, Math.round(EMBALLAGE_MIN_G + poidsPiecesG * 0.7))
const POIDS_PAR_DEFAUT_G = 500
const SEUIL_LIVRAISON_OFFERTE = 6000 // centimes
const PALIERS_G = [250, 500, 1000, 2000, 3000, 5000]
const TARIFS_LIVRAISON = {
  mondial_relay: { label: 'Mondial Relay — point relais', prix: [450, 550, 650, 750, null, null] }, // centimes
  colissimo: { label: 'Colissimo — livraison à domicile', prix: [600, 860, 1060, 1220, 1430, 1840] },
}
// Petit envoi (bijoux) : jusqu'à 50 g de pièces, enveloppe à bulles comprise sous 100 g
const LETTRE_SUIVIE = { label: 'La Poste — lettre suivie (petit envoi)', poidsPiecesMaxG: 50, prix: 400 }

// Options d'envoi pour un poids de pièces (sans emballage), de la moins chère à la plus chère.
// Tableau vide = envoi en ligne impossible.
function optionsLivraison(poidsPiecesG) {
  const options = []
  if (poidsPiecesG <= LETTRE_SUIVIE.poidsPiecesMaxG) options.push({ label: LETTRE_SUIVIE.label, prix: LETTRE_SUIVIE.prix })
  const poids = poidsPiecesG + emballageG(poidsPiecesG)
  const palier = PALIERS_G.findIndex((max) => poids <= max)
  if (palier !== -1) {
    for (const t of Object.values(TARIFS_LIVRAISON)) {
      if (t.prix[palier] != null) options.push({ label: t.label, prix: t.prix[palier] })
    }
  }
  return options.sort((a, b) => a.prix - b.prix)
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

// URL de retour après paiement : on renvoie le client sur le site d'où il vient
// (prod, preview Vercel ou localhost), sinon sur SITE_URL. Liste blanche stricte.
function urlDuSite(req) {
  const siteUrl = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '')
  const origin = req.headers.get('origin') ?? ''
  const autorise =
    origin === siteUrl ||
    /^http:\/\/localhost:\d+$/.test(origin) ||
    /^https:\/\/atelier-lvy(-[a-z0-9-]+)?\.vercel\.app$/.test(origin)
  return autorise ? origin : siteUrl || 'https://atelier-lvy.vercel.app'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { items } = await req.json()
    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: 'Panier vide.' }, 400)
    }

    // Quantités regroupées par pièce (le client n'envoie que slug + quantité, jamais de prix)
    const quantites = new Map()
    for (const { slug, qte } of items) {
      const n = Math.max(1, Math.floor(Number(qte) || 1))
      quantites.set(slug, (quantites.get(slug) ?? 0) + n)
    }

    const { data: rows, error } = await supabase
      .from('produits')
      .select('slug, nom, prix, stock, visible, images, poids_g')
      .in('slug', [...quantites.keys()])
    if (error) throw error

    const bySlug = new Map(rows.map((r) => [r.slug, r]))
    const siteUrl = urlDuSite(req)

    // Stripe en mode test : paiements refusés depuis le site de production (seuls local et aperçus Vercel passent).
    // Le verrou se lève tout seul quand la clé live (sk_live_…) est en place.
    const modeTest = (Deno.env.get('STRIPE_SECRET_KEY') ?? '').startsWith('sk_test_')
    const origine = req.headers.get('origin') ?? ''
    const siteDeTest = /^http:\/\/localhost:\d+$/.test(origine) || /^https:\/\/atelier-lvy-[a-z0-9-]+\.vercel\.app$/.test(origine)
    if (modeTest && !siteDeTest) {
      return json({ error: 'La vente en ligne ouvre bientôt.' }, 403)
    }
    const indisponibles = []
    const line_items = []
    let poidsPiecesG = 0

    for (const [slug, qte] of quantites) {
      const row = bySlug.get(slug)
      if (!row || !row.visible || row.prix == null || row.stock < qte) {
        indisponibles.push(row?.nom ?? slug)
        continue
      }
      poidsPiecesG += (row.poids_g ?? POIDS_PAR_DEFAUT_G) * qte
      const photo = row.images?.[0]?.thumb
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: row.nom,
            metadata: { slug },
            ...(photo ? { images: [photo.startsWith('http') ? photo : `${siteUrl}${photo}`] } : {}),
          },
          unit_amount: Math.round(Number(row.prix) * 100),
        },
        quantity: qte,
      })
    }

    if (indisponibles.length > 0) {
      return json({ error: 'indisponible', indisponibles }, 409)
    }

    const sousTotal = line_items.reduce((s, li) => s + li.price_data.unit_amount * li.quantity, 0)
    const livraisonOfferte = sousTotal >= SEUIL_LIVRAISON_OFFERTE

    // Options d'envoi selon le poids réel du panier ; au-delà du dernier palier, retrait à l'atelier seulement
    const shipping_options = optionsLivraison(poidsPiecesG).map((option) => ({
      shipping_rate_data: {
        type: 'fixed_amount',
        display_name: livraisonOfferte ? `${option.label} — offerte` : option.label,
        fixed_amount: { amount: livraisonOfferte ? 0 : option.prix, currency: 'eur' }, // déjà en centimes
      },
    }))
    shipping_options.push({
      shipping_rate_data: {
        type: 'fixed_amount',
        display_name: "Retrait à l'atelier (gratuit)",
        fixed_amount: { amount: 0, currency: 'eur' },
      },
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'fr',
      line_items,
      success_url: `${siteUrl}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/boutique`,
      shipping_address_collection: { allowed_countries: ['FR'] },
      phone_number_collection: { enabled: true },
      shipping_options,
      // Mondial Relay : le client indique son point relais directement au paiement
      custom_fields: [
        {
          key: 'point_relais',
          label: { type: 'custom', custom: 'Point relais Mondial Relay (si choisi)' },
          type: 'text',
          text: { maximum_length: 120 },
          optional: true,
        },
      ],
    })

    return json({ url: session.url })
  } catch (err) {
    console.error(err)
    return json({ error: err.message ?? 'Erreur serveur' }, 500)
  }
})
