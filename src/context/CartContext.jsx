import { createContext, useContext, useEffect, useState } from 'react'
import { useCatalogue } from './CatalogueContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'lvy-panier'

// Le panier ne stocke que slug + quantité (+ nom/photo pour l'affichage) :
// prix et stock sont toujours relus depuis le catalogue.
export function CartProvider({ children }) {
  const { produitsParSlug } = useCatalogue()
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return parsed.map((i) => ({ ...i, qte: i.qte ?? 1 })) // anciens paniers sans quantité
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // stockage indisponible (navigation privée…) — tant pis, le panier ne survivra pas au rechargement
    }
  }, [items])

  const stockDe = (slug) => produitsParSlug[slug]?.stock ?? Infinity

  const addItem = (produit) => {
    setItems((prev) => {
      const existant = prev.find((i) => i.slug === produit.slug)
      if (!existant) return [...prev, { ...produit, qte: 1 }]
      return prev.map((i) => (i.slug === produit.slug ? { ...i, qte: Math.min(i.qte + 1, stockDe(i.slug)) } : i))
    })
    setOpen(true)
  }
  const setQte = (slug, qte) => {
    if (qte <= 0) return removeItem(slug)
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qte: Math.min(qte, stockDe(slug)) } : i)))
  }
  const removeItem = (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug))
  const clear = () => setItems([])
  const qteDansPanier = (slug) => items.find((i) => i.slug === slug)?.qte ?? 0
  const isInCart = (slug) => qteDansPanier(slug) > 0

  return (
    <CartContext.Provider value={{ items, addItem, setQte, removeItem, clear, isInCart, qteDansPanier, open, setOpen }}>
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
