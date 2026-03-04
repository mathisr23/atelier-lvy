import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ADMIN_EMAIL = 'contact.atelierlvy@gmail.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  const { reservationId, action } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', reservationId)
    .single()

  if (error || !reservation) {
    return new Response(JSON.stringify({ error: 'Reservation not found' }), { status: 404 })
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')!

  let to: string
  let subject: string
  let html: string

  if (action === 'notify_admin') {
    to = ADMIN_EMAIL
    const typeLabel: Record<string, string> = { cours: 'Cours réguliers', initiation: 'Initiation', commande: 'Commande sur mesure', autre: 'Autre' }
    subject = `Nouvelle demande — ${typeLabel[reservation.type] || reservation.type} — ${reservation.prenom} ${reservation.nom}`
    html = `
      <h2>Nouvelle demande : ${typeLabel[reservation.type] || reservation.type}</h2>
      <p><strong>Nom :</strong> ${reservation.prenom} ${reservation.nom}</p>
      <p><strong>Email :</strong> ${reservation.email}</p>
      <p><strong>Téléphone :</strong> ${reservation.telephone || '—'}</p>
      ${reservation.date_session ? `<p><strong>Créneau :</strong> ${reservation.date_session}</p>` : ''}
      ${reservation.nb_seances ? `<p><strong>Pack :</strong> ${reservation.nb_seances} séance${reservation.nb_seances > 1 ? 's' : ''}</p>` : ''}
      ${reservation.message ? `<p><strong>Message :</strong> ${reservation.message}</p>` : ''}
      <p style="margin-top:24px"><a href="${Deno.env.get('SITE_URL') || ''}/atelier-gestion-lvy" style="background:#2A1506;color:#FBF5E9;padding:12px 24px;border-radius:8px;text-decoration:none">Voir dans l'admin →</a></p>
    `
  } else if (action === 'accept') {
    to = reservation.email
    subject = `Ta réservation est confirmée ! 🎉`
    html = `
      <h2>Bonjour ${reservation.prenom} !</h2>
      <p>Ta demande de réservation pour le cours de céramique a été <strong>acceptée</strong>.</p>
      <p><strong>Date :</strong> ${reservation.date_session}</p>
      <p><strong>Pack :</strong> ${reservation.nb_seances} séance${reservation.nb_seances > 1 ? 's' : ''}</p>
      <p>Je te recontacte prochainement pour les détails pratiques (adresse, modalités de paiement).</p>
      <p>À très vite !</p>
      <p>Léa — Atelier LVY</p>
    `
  } else if (action === 'refuse') {
    to = reservation.email
    subject = `Concernant ta demande de réservation`
    html = `
      <h2>Bonjour ${reservation.prenom},</h2>
      <p>Je reviens vers toi concernant ta demande pour le cours du <strong>${reservation.date_session}</strong>.</p>
      <p>Malheureusement, je ne suis pas en mesure d'accepter ta réservation pour cette date. La session est peut-être complète ou il y a un conflit de planning.</p>
      <p>N'hésite pas à me recontacter pour trouver une autre date qui nous conviendrait à toutes les deux.</p>
      <p>À bientôt,</p>
      <p>Léa — Atelier LVY</p>
      <p><a href="mailto:${ADMIN_EMAIL}">contact.atelierlvy@gmail.com</a></p>
    `
  } else {
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Atelier LVY <noreply@atelierlvy.fr>',
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return new Response(JSON.stringify({ error: err }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
})
