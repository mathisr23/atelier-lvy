// Webhook Stripe : à la confirmation d'un paiement, marque les pièces comme vendues
// et envoie un mail à Léa + une confirmation au client. Appelé directement par Stripe (pas de JWT Supabase).
import Stripe from 'npm:stripe@17.4.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-11-20.acacia' })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

const echapper = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const euros = (centimes) => `${((centimes ?? 0) / 100).toFixed(2).replace('.', ',')} €`

// Construction des mails — même style que src/lib/emails.js (formulaire de contact).
// Les modèles EmailJS sont des « enveloppes » : objet {{sujet}}, corps {{{contenu}}}.
const BRUN = '#2A1506'
const ORANGE = '#E87040'
const ligne = (label, valeur, { html = false, fort = false } = {}) => {
  if (valeur === null || valeur === undefined || valeur === '') return ''
  const v = html ? valeur : echapper(valeur)
  return `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(42,21,6,0.06);color:${BRUN};font-size:14px;vertical-align:top"><strong>${echapper(label)}</strong></td><td style="padding:10px 0 10px 16px;border-bottom:1px solid rgba(42,21,6,0.06);color:${BRUN};font-size:14px;text-align:right;vertical-align:top">${fort ? `<strong>${v}</strong>` : v}</td></tr>`
}
const carte = (titre, lignes) => {
  const contenu = lignes.filter(Boolean).join('')
  if (!contenu) return ''
  return `<div style="background:#FBF5E9;border:1px solid rgba(232,112,64,0.18);border-radius:16px;padding:20px 24px;margin:24px 0">
<p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(42,21,6,0.55)">${echapper(titre)}</p>
<table style="width:100%;border-collapse:collapse">${contenu}</table></div>`
}
const mailHtml = ({ titre, paragraphes = [], blocs = [] }) =>
  `<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;color:${ORANGE}">${echapper(titre)}</h1>
${paragraphes.map((p) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${BRUN}">${echapper(p)}</p>`).join('')}
${blocs.filter(Boolean).join('')}`

// Mails envoyés via EmailJS (même service Gmail et mêmes modèles que le formulaire de contact).
// Côté EmailJS : Account → Security → « Allow EmailJS API for non-browser applications » doit être activé.
const EMAILJS = {
  service_id: Deno.env.get('EMAILJS_SERVICE_ID') ?? 'service_263neen',
  user_id: Deno.env.get('EMAILJS_PUBLIC_KEY') ?? 'ACjZWpVavc0biX8Y3',
  accessToken: Deno.env.get('EMAILJS_PRIVATE_KEY') ?? undefined,
  templateLea: Deno.env.get('EMAILJS_TEMPLATE_LEA') ?? 'template_39831u7',
  templateClient: Deno.env.get('EMAILJS_TEMPLATE_CLIENT') ?? 'template_apxutah',
}

async function envoyerEmail(template_id, template_params) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS.service_id,
      user_id: EMAILJS.user_id,
      accessToken: EMAILJS.accessToken,
      template_id,
      template_params,
    }),
  })
  if (!res.ok) console.error(`Erreur EmailJS (${template_id}):`, res.status, await res.text())
}

async function envoyerMailsCommande(sessionId) {
  // Session complète : pièces achetées + mode de livraison choisi
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'shipping_cost.shipping_rate'],
  })

  const client = session.customer_details
  const nom = client?.name ?? ''
  const adresse = session.shipping_details?.address
  const livraison = session.shipping_cost?.shipping_rate?.display_name ?? 'Livraison'
  const retrait = /retrait/i.test(livraison)
  const adresseHtml = adresse
    ? [session.shipping_details?.name, adresse.line1, adresse.line2, `${adresse.postal_code ?? ''} ${adresse.city ?? ''}`]
        .filter(Boolean)
        .map(echapper)
        .join('<br>')
    : ''

  const lignesCommande = [
    ...(session.line_items?.data ?? []).map((li) => ligne(li.description, euros(li.amount_total))),
    ligne(livraison.replace(/ — offerte$/, ''), session.shipping_cost?.amount_total ? euros(session.shipping_cost.amount_total) : 'Offerte'),
    ligne('Total payé', euros(session.amount_total), { fort: true }),
  ]
  const carteLivraison = retrait
    ? carte('Retrait', [ligne('Mode', "Retrait à l'atelier")])
    : carte('Livraison', [ligne('Adresse', adresseHtml, { html: true })])

  // 1. Notification pour Léa
  await envoyerEmail(EMAILJS.templateLea, {
    sujet: `Nouvelle commande — ${euros(session.amount_total)} — ${nom}`,
    user_email: client?.email ?? '',
    reply_to: client?.email ?? '',
    contenu: mailHtml({
      titre: 'Nouvelle commande boutique ✿',
      paragraphes: [
        retrait
          ? "Le client a choisi le retrait à l'atelier : réponds-lui pour convenir d'un moment."
          : 'Paiement reçu : la pièce est à emballer et à expédier en Colissimo.',
      ],
      blocs: [
        carte('Commande', lignesCommande),
        carte('Client', [ligne('Nom', nom), ligne('Email', client?.email), ligne('Téléphone', client?.phone)]),
        carteLivraison,
      ],
    }),
  })

  // 2. Confirmation pour le client
  if (client?.email) {
    await envoyerEmail(EMAILJS.templateClient, {
      sujet: 'Ta commande Atelier LVY est confirmée ✿',
      user_email: client.email,
      reply_to: 'contact.atelierlvy@gmail.com',
      contenu: mailHtml({
        titre: nom ? `Merci ${nom} !` : 'Merci pour ta commande !',
        paragraphes: [
          'Ton paiement a bien été reçu, ta commande est confirmée.',
          retrait
            ? "Je te recontacte très vite pour convenir d'un moment où venir récupérer ta pièce à l'atelier."
            : "J'emballe ta pièce avec soin et je te préviens dès qu'elle part en Colissimo.",
          'Une question ? Réponds simplement à ce mail.',
        ],
        blocs: [carte('Ta commande', lignesCommande), carteLivraison],
      }),
    })
  }
}

Deno.serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature ?? '', webhookSecret)
  } catch (err) {
    console.error('Signature webhook invalide:', err.message)
    return new Response(`Signature invalide: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const slugs = (session.metadata?.slugs ?? '').split(',').filter(Boolean)

    if (slugs.length > 0) {
      const { error } = await supabase.from('produit_prix').update({ vendu: true }).in('slug', slugs)
      if (error) console.error('Erreur mise à jour vendu:', error)
    }

    // Un échec d'email ne doit pas faire échouer le webhook (Stripe le renverrait en boucle)
    await envoyerMailsCommande(session.id).catch((err) => console.error('Erreur envoi email:', err))
  }

  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })
})
