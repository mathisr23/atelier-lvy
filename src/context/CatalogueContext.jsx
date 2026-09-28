import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

// Catalogue boutique (produits, catégories, collections) — géré par Léa depuis l'admin.
const CatalogueContext = createContext(null)

export function CatalogueProvider({ children }) {
  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() =>
    Promise.all([
      supabase.from('produits').select('*').order('ordre').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('ordre'),
      supabase.from('collections').select('*').order('ordre'),
    ]).then(([p, c, co]) => {
      // Une admin connectée voit aussi les brouillons via RLS : la boutique ne montre que les pièces visibles
      setProduits((p.data ?? []).filter((x) => x.visible))
      setCategories(c.data ?? [])
      setCollections(co.data ?? [])
      setLoading(false)
    }), [])

  useEffect(() => { refresh() }, [refresh])

  const value = useMemo(() => {
    const produitsParSlug = Object.fromEntries(produits.map((p) => [p.slug, p]))
    const categoriesParId = Object.fromEntries(categories.map((c) => [c.id, c]))
    const collectionsParId = Object.fromEntries(collections.map((c) => [c.id, c]))
    // Pour la navigation : uniquement ce qui contient au moins une pièce visible
    const categoriesActives = categories.filter((c) => produits.some((p) => p.categorie_id === c.id))
    const collectionsActives = collections.filter((c) => produits.some((p) => p.collection_id === c.id))
    return {
      produits, categories, collections, produitsParSlug, categoriesParId, collectionsParId,
      categoriesActives, collectionsActives, loading, refresh,
    }
  }, [produits, categories, collections, loading, refresh])

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>
}

// Lien vers la boutique filtrée — ex. lienBoutique({ collection: 'corail', type: 'cuilleres' })
// eslint-disable-next-line react-refresh/only-export-components
export function lienBoutique({ type, collection } = {}) {
  const params = new URLSearchParams()
  if (collection) params.set('collection', collection)
  if (type) params.set('type', type)
  const qs = params.toString()
  return `/boutique${qs ? `?${qs}` : ''}`
}

// eslint-disable-next-line react-refresh/only-export-components -- hook partagé intentionnellement avec le provider
export function useCatalogue() {
  const ctx = useContext(CatalogueContext)
  if (!ctx) throw new Error('useCatalogue doit être utilisé à l’intérieur de <CatalogueProvider>')
  return ctx
}
