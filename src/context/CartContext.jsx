import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const CartContext = createContext(null)
const STORAGE_KEY = 'lvy-panier'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)
  const [infosMap, setInfosMap] = useState({})

  const refreshInfos = useCallback(() => {
    supabase.from('produit_prix').select('slug, prix, description, vendu').then(({ data }) => {
      if (data) setInfosMap(Object.fromEntries(data.map((r) => [r.slug, r])))
    })
  }, [])

  useEffect(() => { refreshInfos() }, [refreshInfos])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // stockage indisponible (navigation privée…) — tant pis, le panier ne survivra pas au rechargement
    }
  }, [items])

  const addItem = (produit) => {
    setItems((prev) => (prev.some((i) => i.slug === produit.slug) ? prev : [...prev, produit]))
    setOpen(true)
  }
  const removeItem = (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug))
  const clear = () => setItems([])
  const isInCart = (slug) => items.some((i) => i.slug === slug)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, isInCart, open, setOpen, infosMap, refreshInfos }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook partagé intentionnellement avec le provider
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé à l’intérieur de <CartProvider>')
  return ctx
}
