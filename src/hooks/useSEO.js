import { useEffect } from 'react'

const SITE = 'https://atelier-lvy.vercel.app'

const DEFAULT_DESCRIPTION =
  "Atelier LVY — céramiques modelées à la main par Léa, initiations et cours de modelage à Boinville-le-Gaillard (Yvelines)."

export default function useSEO({ title, description = DEFAULT_DESCRIPTION }) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
    // URL canonique de la page (sans paramètres), toujours sur le domaine de production
    let canonique = document.querySelector('link[rel="canonical"]')
    if (!canonique) {
      canonique = document.createElement('link')
      canonique.setAttribute('rel', 'canonical')
      document.head.appendChild(canonique)
    }
    canonique.setAttribute('href', `${SITE}${window.location.pathname}`)
  }, [title, description])
}
