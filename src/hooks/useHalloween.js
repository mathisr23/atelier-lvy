import { useCatalogue } from '../context/CatalogueContext'

// Mise en avant Halloween : la collection « halloween » créée par Léa dans l'admin.
// Active tant qu'elle contient des pièces visibles et jusqu'à FIN_HALLOWEEN ; après, les pièces
// restent en vente comme une collection ordinaire, seules les mises en avant disparaissent.
export const SLUG_HALLOWEEN = 'halloween'
// Orange citrouille de la section : repris sur la page des pièces de la collection
export const COULEUR_HALLOWEEN = '#E87040'
const FIN_HALLOWEEN = new Date('2026-11-03T00:00:00+01:00')
// Évaluée au chargement du site (une visite ouverte avant minuit garde la section jusqu'au rechargement)
const PERIODE_EN_COURS = Date.now() < FIN_HALLOWEEN.getTime()

// Renvoie { collection, pieces } pendant la période, sinon null
export default function useHalloween() {
  const { produits, collectionsActives } = useCatalogue()
  if (!PERIODE_EN_COURS) return null
  const collection = collectionsActives.find((c) => c.slug === SLUG_HALLOWEEN)
  if (!collection) return null
  return { collection, pieces: produits.filter((p) => p.collection_id === collection.id) }
}
