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
    return { produits, categories, collections, produitsParSlug, categoriesParId, collectionsParId, loading, refresh }
  }, [produits, categories, collections, loading, refresh])

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook partagé intentionnellement avec le provider
export function useCatalogue() {
  const ctx = useContext(CatalogueContext)
  if (!ctx) throw new Error('useCatalogue doit être utilisé à l’intérieur de <CatalogueProvider>')
  return ctx
}
