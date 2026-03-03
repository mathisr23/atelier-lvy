import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Asterisk } from './Deco'
import logo1 from '../assets/logo1.png'

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] bg-[#2A1506] flex flex-col items-center justify-center overflow-hidden"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Asterisques décoratifs */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute top-12 left-12 opacity-30"
          >
            <Asterisk size={28} color="#F5D060" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-16 right-16 opacity-20"
          >
            <Asterisk size={40} color="#F2A0A8" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/3 right-12 opacity-15"
          >
            <Asterisk size={20} color="#9BBF90" />
          </motion.div>

          {/* Logo */}
          <div className="text-center relative z-10">
            <motion.img
              src={logo1}
              alt="Léa — Artiste céramiste"
              className="w-auto brightness-0 invert mx-auto"
              style={{ height: 'clamp(12rem, 30vw, 22rem)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />

            <motion.p
              className="font-ui text-[#FBF5E9]/40 text-xs uppercase tracking-[0.5em] mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Céramiste
            </motion.p>
          </div>

          {/* Barre de chargement */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-[#FBF5E9]/15 overflow-hidden">
            <motion.div
              className="h-full bg-[#E87040]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
