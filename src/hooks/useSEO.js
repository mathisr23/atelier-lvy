import { useEffect } from 'react'

const DEFAULT_DESCRIPTION =
  "Léa — Céramiste. Créations en argile faites à la main, ateliers d'initiation et cours réguliers à Paris."

export default function useSEO({ title, description = DEFAULT_DESCRIPTION }) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [title, description])
}
