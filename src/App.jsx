import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SplashScreen from './components/SplashScreen'
import Apropos from './pages/Apropos'
import Boutique from './pages/Boutique'
import Initiation from './pages/Initiation'
import Cours from './pages/Cours'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

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
        <Route path="/initiation" element={<PageWrapper><Initiation /></PageWrapper>} />
        <Route path="/cours" element={<PageWrapper><Cours /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <>
      <SplashScreen onDone={() => setSplashDone(true)} />
      {splashDone && (
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </BrowserRouter>
      )}
    </>
  )
}

export default App
