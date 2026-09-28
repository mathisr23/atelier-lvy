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
const FRAIS_LIVRAISON = 690 // centimes
const SEUIL_LIVRAISON_OFFERTE = 6000 // centimes

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
      .select('slug, nom, prix, stock, visible, images')
      .in('slug', [...quantites.keys()])
    if (error) throw error

    const bySlug = new Map(rows.map((r) => [r.slug, r]))
    const siteUrl = urlDuSite(req)
    const indisponibles = []
    const line_items = []

    for (const [slug, qte] of quantites) {
      const row = bySlug.get(slug)
      if (!row || !row.visible || row.prix == null || row.stock < qte) {
        indisponibles.push(row?.nom ?? slug)
        continue
      }
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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'fr',
      line_items,
      success_url: `${siteUrl}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/boutique`,
      shipping_address_collection: { allowed_countries: ['FR'] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: livraisonOfferte ? 'Livraison Colissimo — offerte' : 'Livraison Colissimo',
            fixed_amount: { amount: livraisonOfferte ? 0 : FRAIS_LIVRAISON, currency: 'eur' },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: "Retrait à l'atelier (gratuit)",
            fixed_amount: { amount: 0, currency: 'eur' },
          },
        },
      ],
    })

    return json({ url: session.url })
  } catch (err) {
    console.error(err)
    return json({ error: err.message ?? 'Erreur serveur' }, 500)
  }
})
