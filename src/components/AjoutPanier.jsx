import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

// Petite confirmation après un ajout au panier (remplace l'ancien tiroir latéral)
export default function AjoutPanier() {
  const { dernierAjout, oublierAjout } = useCart()
  const { pathname } = useLocation()
  const visible = dernierAjout && pathname !== '/panier'

  useEffect(() => {
    if (!dernierAjout) return
    const t = setTimeout(oublierAjout, 4000)
    return () => clearTimeout(t)
  }, [dernierAjout, oublierAjout])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={dernierAjout.le}
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          role="status"
          className="fixed z-[80] bottom-4 right-4 left-4 sm:left-auto sm:w-80 bg-[#FBF5E9] border-2 border-[#2A1506] rounded-2xl shadow-[5px_5px_0_#2A1506] p-3 flex items-center gap-3"
        >
          {dernierAjout.image && <img src={dernierAjout.image} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="font-ui text-[0.65rem] uppercase tracking-widest text-[#6E9A62] font-bold">Dans le panier ✓</p>
            <p className="font-display font-bold text-sm truncate">{dernierAjout.nom}</p>
            <Link to="/panier" onClick={oublierAjout} className="font-ui text-xs font-semibold text-[#E87040] hover:text-[#2A1506]">
              Voir le panier →
            </Link>
          </div>
          <button onClick={oublierAjout} aria-label="Fermer" className="self-start w-6 h-6 rounded-full hover:bg-[#2A1506]/10 text-[#2A1506]/50 leading-none">×</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
