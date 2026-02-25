import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSEO from '../hooks/useSEO'
import { Squiggle } from '../components/Deco'

export default function NotFound() {
  useSEO({ title: 'Page introuvable — Léa Céramiste' })

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display font-black text-orange/20 leading-none select-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 18rem)' }}
        >
          404
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="-mt-6 relative z-10"
        >
          <Squiggle width={70} color="#E87040" className="mx-auto mb-6 opacity-60" />
          <h1 className="font-display font-bold text-3xl md:text-4xl text-brown mb-4">
            Page introuvable
          </h1>
          <p className="font-ui text-brown/60 text-base leading-relaxed mb-8">
            Cette page n'existe pas ou a été déplacée. Retourne à l'accueil pour continuer.
          </p>
          <Link
            to="/"
            className="inline-block font-ui font-semibold text-sm px-8 py-4 bg-brown text-cream rounded-xl hover:bg-orange transition-colors duration-200"
          >
            Retour à l'accueil →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
