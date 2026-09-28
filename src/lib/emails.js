// Construction du contenu HTML des mails envoyés via EmailJS.
// Les 2 modèles EmailJS ne sont que des « enveloppes » (style + signature de l'atelier) :
// ils affichent {{sujet}} en objet et {{{contenu}}} au milieu. Tout le texte est écrit ici.
// ⚠ Copie équivalente côté serveur : supabase/functions/stripe-webhook/index.ts (garder le même style).

export const EMAILJS = {
  service_id: 'service_263neen',
  user_id: 'ACjZWpVavc0biX8Y3',
  templateLea: 'template_39831u7',
  templateClient: 'template_apxutah',
}

export const echapper = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const BRUN = '#2A1506'
const ORANGE = '#E87040'

// Ligne label / valeur — ignorée si la valeur est vide. `html: true` si la valeur est déjà du HTML sûr.
export const ligne = (label, valeur, { html = false, fort = false } = {}) => {
  if (valeur === null || valeur === undefined || valeur === '') return ''
  const v = html ? valeur : echapper(valeur)
  return `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(42,21,6,0.06);color:${BRUN};font-size:14px;vertical-align:top"><strong>${echapper(label)}</strong></td><td style="padding:10px 0 10px 16px;border-bottom:1px solid rgba(42,21,6,0.06);color:${BRUN};font-size:14px;text-align:right;vertical-align:top">${fort ? `<strong>${v}</strong>` : v}</td></tr>`
}

export const carte = (titre, lignes) => {
  const contenu = lignes.filter(Boolean).join('')
  if (!contenu) return ''
  return `<div style="background:#FBF5E9;border:1px solid rgba(232,112,64,0.18);border-radius:16px;padding:20px 24px;margin:24px 0">
<p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(42,21,6,0.55)">${echapper(titre)}</p>
<table style="width:100%;border-collapse:collapse">${contenu}</table></div>`
}

export const citation = (titre, texte) =>
  texte
    ? `<p style="margin:24px 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(42,21,6,0.55)">${echapper(titre)}</p>
<div style="background:#FBF5E9;border-radius:12px;padding:16px 20px;font-style:italic;color:${BRUN};font-size:14px;white-space:pre-line">${echapper(texte)}</div>`
    : ''

export const mailHtml = ({ titre, paragraphes = [], blocs = [] }) =>
  `<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;color:${ORANGE}">${echapper(titre)}</h1>
${paragraphes.map((p) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${BRUN}">${echapper(p)}</p>`).join('')}
${blocs.filter(Boolean).join('')}`

export async function envoyerEmail(template_id, template_params) {
  return fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: EMAILJS.service_id, user_id: EMAILJS.user_id, template_id, template_params }),
  })
}
