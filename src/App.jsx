import { useState, useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SplashScreen from './components/SplashScreen'
import AjoutPanier from './components/AjoutPanier'
import { CartProvider } from './context/CartContext'
import { CatalogueProvider } from './context/CatalogueContext'
import { VENTE_OUVERTE } from './lib/vente'
import Apropos from './pages/Apropos'
import Boutique from './pages/Boutique'
import Initiation from './pages/Initiation'
import Cours from './pages/Cours'
import Contact from './pages/Contact'
import CommandeSucces from './pages/CommandeSucces'
import Panier from './pages/Panier'
import Piece from './pages/Piece'
import NotFound from './pages/NotFound'
import MentionsLegales from './pages/MentionsLegales'
import CGV from './pages/CGV'

// L'admin n'est téléchargée que par Léa : elle sort du fichier JS principal des visiteurs
const Admin = lazy(() => import('./pages/Admin'))

/* ─── Position de défilement ───
   Nouvelle page → en haut. Retour arrière (bouton du téléphone, geste, navigate(-1)) → on revient
   exactement où on était, par ex. au milieu de la grille de la boutique.
   Les positions sont mémorisées par entrée d'historique (location.key). */
const positions = new Map()
let cleActive = null // entrée d'historique de la page affichée
let enPause = true // pendant un changement de page, on n'enregistre rien (le navigateur ramène le scroll à 0 en démontant l'ancienne page)

const defilerInstant = (y) => window.scrollTo({ top: y, behavior: 'instant' }) // html a scroll-behavior: smooth

function MemoireDefilement() {
  const { key, pathname } = useLocation()
  const pagePrecedente = useRef(pathname)

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const enregistrer = () => { if (!enPause && cleActive) positions.set(cleActive, window.scrollY) }
    window.addEventListener('scroll', enregistrer, { passive: true })
    return () => window.removeEventListener('scroll', enregistrer)
  }, [])

  useLayoutEffect(() => {
    if (pathname !== pagePrecedente.current) {
      // Changement de page : PageWrapper replace le scroll une fois la nouvelle page montée
      enPause = true
    } else if (cleActive && cleActive !== key) {
      // Même page, filtres changés (?type=…) : on garde la position sous la nouvelle entrée
      positions.set(key, window.scrollY)
      cleActive = key
    }
    pagePrecedente.current = pathname
  }, [key, pathname])

  return null
}

// Replace le scroll à l'arrivée d'une page ; réessaie quelques instants si la page n'est pas encore assez haute
function useDefilementInitial() {
  const { key } = useLocation()
  const typeNavigation = useNavigationType()
  useLayoutEffect(() => {
    cleActive = key
    const cible = typeNavigation === 'POP' ? positions.get(key) ?? 0 : 0
    const debut = performance.now()
    let minuteur
    const tenter = () => {
      defilerInstant(cible)
      if (Math.abs(window.scrollY - cible) > 2 && performance.now() - debut < 1500) minuteur = setTimeout(tenter, 50)
      else enPause = false
    }
    tenter()
    return () => clearTimeout(minuteur)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- uniquement au montage de la page
}

function PageWrapper({ children }) {
  useDefilementInitial()
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Apropos /></PageWrapper>} />
        <Route path="/boutique" element={<PageWrapper><Boutique /></PageWrapper>} />
        <Route path="/boutique/:slug" element={<PageWrapper><Piece /></PageWrapper>} />
        <Route path="/initiation" element={<PageWrapper><Initiation /></PageWrapper>} />
        <Route path="/cours" element={<PageWrapper><Cours /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        {VENTE_OUVERTE && <Route path="/panier" element={<PageWrapper><Panier /></PageWrapper>} />}
        <Route path="/commande/succes" element={<PageWrapper><CommandeSucces /></PageWrapper>} />
        <Route path="/mentions-legales" element={<PageWrapper><MentionsLegales /></PageWrapper>} />
        <Route path="/cgv" element={<PageWrapper><CGV /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function MainApp() {
  const [splashDone, setSplashDone] = useState(false)
  return (
    <CatalogueProvider>
    <CartProvider>
      <SplashScreen onDone={() => setSplashDone(true)} />
      {splashDone && (
        <>
          <MemoireDefilement />
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
          {VENTE_OUVERTE && <AjoutPanier />}
        </>
      )}
      {/* Mesure d'audience Vercel (sans cookie) : uniquement sur le site public, pas sur l'admin */}
      <Analytics />
    </CartProvider>
    </CatalogueProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/k4w9-lvy-m2r6x" element={<Suspense fallback={null}><Admin /></Suspense>} />
        <Route path="*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
