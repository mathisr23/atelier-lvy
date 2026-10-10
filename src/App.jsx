import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import MentionsLegales from './pages/MentionsLegales'
import CGV from './pages/CGV'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageWrapper({ children }) {
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
          <ScrollToTop />
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
          {VENTE_OUVERTE && <AjoutPanier />}
        </>
      )}
    </CartProvider>
    </CatalogueProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/k4w9-lvy-m2r6x" element={<Admin />} />
        <Route path="*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
