import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { motion, AnimatePresence } from 'framer-motion'
import { Asterisk, Squiggle, patterns } from '../components/Deco'
import Reveal from '../components/Reveal'
import imgLea from '../assets/lea.png'
import bookPdf from '../assets/book.pdf'
import img3 from '../assets/3.jpg'
import img4 from '../assets/4.jpg'
import imgFSR22 from '../assets/FullSizeRender-22.jpg'
import imgFSR48 from '../assets/FullSizeRender-48.jpg'
import imgFSR52 from '../assets/FullSizeRender-52.jpg'
import imgIMG4854 from '../assets/IMG_4854.JPG'
import imgIMG4862 from '../assets/IMG_4862.JPG'
import imgIMG4863 from '../assets/IMG_4863.JPG'
import imgIMG4869 from '../assets/IMG_4869.JPG'
import imgIMG4948 from '../assets/IMG_4948.JPG'
import imgIMG4959 from '../assets/IMG_4959.JPG'
import imgIMG5065 from '../assets/IMG_5065.JPG'
import imgIMG5071 from '../assets/IMG_5071.JPG'
import imgIMG4982 from '../assets/IMG_4982.JPG'
import imgIMG4984 from '../assets/IMG_4984.JPG'
import imgIMG5006 from '../assets/IMG_5006.JPG'
import imgIMG5020 from '../assets/IMG_5020.JPG'
import imgIMG5029 from '../assets/IMG_5029.JPG'

// Classes boutons partagées
const btn = {
  dark: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] border-2 border-[#2A1506] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] hover:border-[#E87040] transition-all duration-200',
  outline: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-transparent text-[#2A1506] border-2 border-[#2A1506] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-all duration-200',
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200',
}

// ✏️ Remplacer par de vrais témoignages
const testimonials = [
  {
    name: 'Camille R.',
    text: "Une expérience magique ! Léa met tellement à l'aise que même les moins manuels créent quelque chose dont ils sont fiers. Je recommande les yeux fermés.",
    type: 'initiation',
  },
  {
    name: 'Sophie & Marc',
    text: "On a offert une initiation à notre fille pour son anniversaire. Elle en parle encore des mois après. Léa est pédagogue, patiente et passionnée.",
    type: 'initiation',
  },
  {
    name: 'Julie T.',
    text: "J'ai commandé un bol sur mesure pour offrir. Léa a parfaitement compris ce que je voulais et le résultat est au-delà de mes attentes. Une vraie artiste.",
    type: 'creation',
  },
]

const projects = [
  {
    id: 1,
    name: 'Métamorphose',
    subtitle: 'Porcelaine et plastique',
    color: '#E87040',
    preview: img3,
    images: [img3, img4, imgFSR22, imgFSR48, imgFSR52],
  },
  {
    id: 2,
    name: 'Corail',
    description: 'Déchets plastiques transformés',
    subtitle: 'Pièces réalisées en tournage/modelage',
    color: '#F2A0A8',
    preview: imgIMG4854,
    images: [imgIMG4854, imgIMG4862, imgIMG4863, imgIMG4869],
  },
  {
    id: 3,
    name: 'Océane',
    subtitle: 'Pièces réalisées en tournage/modelage',
    color: '#9BBF90',
    preview: imgIMG4948,
    images: [imgIMG4948, imgIMG4959, imgIMG5065, imgIMG5071],
  },
  {
    id: 4,
    name: 'Yolenda',
    subtitle: 'Pièces réalisées en tournage/modelage',
    color: '#F5D060',
    preview: imgIMG4982,
    images: [imgIMG4982, imgIMG4984, imgIMG5006, imgIMG5020, imgIMG5029],
  },
]

export default function Apropos() {
  useSEO({
    title: 'Léa — Artiste céramiste',
    description: "Créatrice artiste céramiste. Créations en argile faites à la main, ateliers d'initiation et cours réguliers.",
  })

  const [openProject, setOpenProject] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null)
        else setOpenProject(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex])

  useEffect(() => {
    document.body.style.overflow = openProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [openProject])

  return (
    <div className="bg-[#FBF5E9] pt-20">

      {/* ─── HERO ─── */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#F2A0A8]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-[#9BBF90]/20 blur-3xl pointer-events-none" />

        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute top-32 left-1/4 opacity-30">
          <Asterisk size={26} color="#E87040" />
        </motion.div>
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} className="absolute bottom-40 right-1/3 opacity-40">
          <Asterisk size={18} color="#9BBF90" />
        </motion.div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} className="absolute top-1/2 right-16 opacity-25">
          <Asterisk size={34} color="#F5D060" />
        </motion.div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          <div className="relative z-10">
            <motion.p
              className="font-ui text-sm uppercase tracking-[0.3em] text-[#E87040] mb-4"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              Artiste céramiste
            </motion.p>
            <motion.h1
              className="font-display font-black leading-[0.9] mb-6 flex"
              style={{ fontSize: 'clamp(5rem, 15vw, 12rem)' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12, delayChildren: 0.2 }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {['l', 'é', 'a'].map((letter, i) => (
                <motion.span key={i} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
                  {letter}
                </motion.span>
              ))}
              <motion.span className="text-[#E87040]" variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'backOut' } } }}>
                .
              </motion.span>
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Squiggle width={90} color="#E87040" className="mb-6 opacity-60" />
            </motion.div>
            <motion.p
              className="font-display italic text-[#2A1506]/60 text-xl md:text-2xl leading-relaxed max-w-md mb-10"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
              Avec l’atelier LVY, prenez un moment dans votre quotidien pour partager une passion, apprendre un savoir-faire et vivre une expérience conviviale !
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Link to="/boutique" className={btn.orange}>Voir mes créations</Link>
              <Link to="/initiation" className={btn.dark}>Faire une initiation</Link>
            </motion.div>
          </div>

          {/* Collage photos */}
          <div className="relative h-[500px] hidden lg:block group">
            <motion.div initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 3 }} transition={{ delay: 0.3, duration: 0.6 }} className="absolute top-0 right-8 w-56 h-64 overflow-hidden shadow-xl" style={{ backgroundColor: '#E87040', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />
            <motion.div initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: -6 }} transition={{ delay: 0.4, duration: 0.6 }} className="absolute top-16 left-0 w-44 h-44 overflow-hidden shadow-xl" style={{ backgroundColor: '#9BBF90', borderRadius: '50% 50% 40% 60% / 60% 40% 50% 50%' }} />
            <motion.div initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: -2 }} transition={{ delay: 0.5, duration: 0.6 }} className="absolute bottom-0 right-0 w-48 h-56 overflow-hidden shadow-xl" style={{ backgroundColor: '#F2A0A8', borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%' }} />
            <motion.div initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 6 }} transition={{ delay: 0.6, duration: 0.6 }} className="absolute bottom-8 left-12 w-36 h-36 overflow-hidden shadow-xl" style={{ backgroundColor: '#F5D060', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FBF5E9] border border-[#2A1506]/20 rounded-full w-28 h-28 flex items-center justify-center rotate-12 shadow-2xl z-10 hover:scale-110 transition-transform duration-300">
              <span className="font-display text-center text-[#2A1506] text-xs font-bold leading-tight">fait<br />à la<br />main</span>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#2A1506]/40">
          <span className="font-ui text-xs uppercase tracking-widest">Découvrir</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-px h-10 bg-[#2A1506]/20" />
        </div>
      </section>

      {/* ─── QUI SUIS-JE ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 bg-[#2A1506] text-[#FBF5E9] relative overflow-hidden" style={patterns.grain()}>
        <Asterisk size={48} color="rgba(245,208,96,0.12)" className="absolute top-10 right-20 rotate-12" />
        <Asterisk size={24} color="rgba(242,160,168,0.15)" className="absolute bottom-16 left-1/3" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#F5D060] mb-4">Qui suis-je ?</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display font-bold text-5xl md:text-6xl leading-tight mb-8">
                Artiste et céramiste<br /><span className="italic text-[#F2A0A8]">passionnée</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-3 text-[#FBF5E9]/70 leading-relaxed font-body text-base">
                <p>Formée à l’école Boulle, j’ai découvert le modelage par la gravure en relief avant de plonger dans la céramique, pour donner du volume à mes créations.</p>
                <p>J’ai forgé mon savoir-faire à travers de nombreux stages, puis en produisant pour de grandes maisons, maîtrisant tournage, coulage et modelage avec des exigences élevées en finitions.</p>
                <p>Aujourd’hui, je crée mes propres pièces et partage ma passion via des ateliers et cours. Ma victoire au concours <em>Yes You Can</em> et les initiations organisées avec des femmes battues à Rambouillet ont renforcé mon envie de transmission.</p>
                <p>Inspirée par la nature et ses formes organiques, j’explore des matières variées, du noble aux déchets réinventés, dans un atelier que je vis comme un laboratoire d’idées.</p>
              </div>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.15}>
            <div className="relative h-105 md:h-130">
              <img src={imgLea} alt="Léa artiste céramiste" className="absolute inset-0 w-full h-full object-cover object-center rounded-3xl" />
              <div className="absolute -bottom-6 -right-4 bg-[#F5D060] text-[#2A1506] rounded-2xl p-4 max-w-[160px] shadow-xl">
                <p className="font-display font-bold text-2xl">5 ans</p>
                <p className="font-ui text-xs">de pratique céramique</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── MES CRÉATIONS ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-3">Portfolio</p>
                <h2 className="font-display font-bold text-5xl md:text-7xl leading-tight">Mes<br /><span className="italic">créations</span></h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 self-start md:self-auto">
                <a
                  href={bookPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-b-2 border-orange pb-1 font-ui text-sm font-semibold text-orange hover:text-brown hover:border-brown transition-colors"
                >
                  Voir mon book →
                </a>
                <Link to="/boutique" className="inline-block border-b-2 border-brown pb-1 font-ui text-sm font-semibold hover:text-orange hover:border-orange transition-colors">
                  Voir la boutique →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} direction="scale">
            <div className="grid grid-cols-2 gap-10">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setOpenProject(project)}
                  className="group relative rounded-2xl cursor-pointer h-72"
                >
                  {/* Image avec overflow-hidden isolé pour que la fleur puisse déborder */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <img
                      src={project.preview}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Fleur badge — déborde en coin bas-droit */}
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 transition-transform duration-500 ease-out group-hover:rotate-12 origin-center">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
                      {/* 6 pétales uniformes à 60° d'intervalle + cœur central */}
                      <circle cx="50" cy="19" r="19" fill={project.color} />
                      <circle cx="75" cy="34" r="19" fill={project.color} />
                      <circle cx="75" cy="66" r="19" fill={project.color} />
                      <circle cx="50" cy="81" r="19" fill={project.color} />
                      <circle cx="25" cy="66" r="19" fill={project.color} />
                      <circle cx="25" cy="34" r="19" fill={project.color} />
                      <circle cx="50" cy="50" r="22" fill={project.color} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg text-brown">
                      voir
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CE QUE JE VEUX FAIRE ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 relative overflow-hidden" style={{ backgroundColor: 'rgba(242,160,168,0.15)', ...patterns.dots('rgba(217,112,128,0.1)') }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#D97080] mb-4">La suite</p></Reveal>
          <Reveal delay={0.1}><h2 className="font-display font-bold text-4xl md:text-5xl mb-16 max-w-xl leading-tight">Ce que je veux créer</h2></Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { color: '#E87040', title: 'Un lieu de partage et de rencontre', text: 'De nos jours, il est difficile de faire de nouvelles rencontres. C’est pourquoi, à travers ces initiations, je souhaite créer un espace d’échange, permettant de rencontrer d’autres personnes partageant les mêmes passions.', tag: 'Ateliers' },
              { color: '#9BBF90', title: 'Cours enfants', text: 'Des séances adaptées aux petits, pour leur faire découvrir le plaisir de l\'argile entre leurs mains. Laisser parler leur imagination pour stimuler leur confiance en eux et leur créativité !', tag: 'Futur' },
              { color: '#F5D060', title: 'Prochainement : l\'art thérapie', text: 'Mettre l’art au service de la personne est un de mes objectifs futurs ! Me former à cette pratique me permettrait de créer une bulle pour ceux qui ont besoin d’aide pour mieux se comprendre et s’exprimer.', tag: 'Futur' },
            ].map(({ color, title, text, tag }, i) => (
              <Reveal key={title} delay={i * 0.1} direction="up">
                <div className="bg-[#FBF5E9] rounded-3xl p-8 border border-[#2A1506]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <span className="inline-block font-ui text-xs font-semibold px-3 py-1 rounded-lg mb-6 text-[#FBF5E9]" style={{ backgroundColor: color }}>{tag}</span>
                  <h3 className="font-display font-bold text-2xl mb-3">{title}</h3>
                  <p className="text-[#2A1506]/60 font-body text-base leading-relaxed">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TÉMOIGNAGES ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 bg-[#2A1506]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#F5D060] mb-4">Ils témoignent</p>
            <h2 className="font-display font-bold text-5xl md:text-6xl text-[#FBF5E9] leading-tight mb-16">
              Ce qu'ils<br /><span className="italic text-[#F2A0A8]">en disent</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, text, type }, i) => (
              <Reveal key={name} delay={i * 0.1} direction="up">
                <div className={`rounded-3xl p-8 flex flex-col gap-6 h-full ${i === 1 ? 'bg-[#E87040]' : 'bg-[#FBF5E9]/5 border border-[#FBF5E9]/10'}`}>
                  <span className="font-display text-5xl leading-none select-none opacity-40" style={{ color: i === 1 ? '#2A1506' : '#F5D060' }}>"</span>
                  <p className={`font-body text-base leading-relaxed flex-1 ${i === 1 ? 'text-[#2A1506]' : 'text-[#FBF5E9]/80'}`}>{text}</p>
                  <div className="flex items-center justify-between">
                    <p className={`font-ui font-semibold text-sm ${i === 1 ? 'text-[#2A1506]' : 'text-[#FBF5E9]'}`}>{name}</p>
                    <span className={`font-ui text-xs px-3 py-1 rounded-lg ${i === 1 ? 'bg-[#2A1506]/15 text-[#2A1506]' : type === 'initiation' ? 'bg-[#9BBF90]/20 text-[#9BBF90]' : 'bg-[#F5D060]/20 text-[#F5D060]'}`}>
                      {type === 'initiation' ? 'Initiation' : 'Création'}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-3">Instagram</p>
                <h2 className="font-display font-bold text-5xl md:text-6xl leading-tight">
                  Sur<br /><span className="italic">l'atelier</span>
                </h2>
              </div>
              <a
                href="https://instagram.com/atelier_lvy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-b-2 border-[#2A1506] pb-1 font-ui text-sm font-semibold hover:text-[#E87040] hover:border-[#E87040] transition-colors self-start md:self-auto"
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @atelier_lvy →
              </a>
            </div>
          </Reveal>
          {/* 🔑 Widget Behold.so — remplacer FEED_ID_ICI après config sur behold.so */}
          <Reveal delay={0.1}>
            <behold-widget feed-id="kMu6VSYj0oujYewf9wCI"></behold-widget>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA CONTACT ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 relative overflow-hidden">
        <Asterisk size={22} color="#E87040" className="absolute top-12 left-12 opacity-25 rotate-12" />
        <Asterisk size={16} color="#9BBF90" className="absolute bottom-12 right-20 opacity-35 -rotate-15" />
        <Reveal direction="scale">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
              On travaille<br /><span className="italic text-[#E87040]">ensemble ?</span>
            </h2>
            <p className="font-body text-[#2A1506]/60 text-lg mb-10 max-w-md mx-auto">
              Commande sur mesure, initiation, ou juste une question, je réponds à tout.
            </p>
            <Link to="/contact" className={`${btn.orange} !text-base !px-10 !py-4`}>
              Me contacter
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ─── MODAL PROJET ─── */}
      <AnimatePresence>
        {openProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setLightboxIndex(null); setOpenProject(null) }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FBF5E9] rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-3xl">{openProject.name}</h3>
                  {openProject.description && (
                    <p className="font-ui text-sm font-semibold mt-1" style={{ color: openProject.color }}>{openProject.description}</p>
                  )}
                  {openProject.subtitle && (
                    <p className="font-ui text-xs text-[#2A1506]/50 mt-0.5">{openProject.subtitle}</p>
                  )}
                </div>
                <button
                  onClick={() => setOpenProject(null)}
                  className="w-10 h-10 rounded-full bg-[#2A1506]/10 hover:bg-[#2A1506]/20 flex items-center justify-center transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke="#2A1506" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {openProject.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className="aspect-square overflow-hidden rounded-xl group"
                  >
                    <img
                      src={img}
                      alt={`${openProject.name} — ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── LIGHTBOX ─── */}
      <AnimatePresence>
        {lightboxIndex !== null && openProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => Math.max(0, i - 1)) }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={openProject.images[lightboxIndex]}
              alt={`${openProject.name} — ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => Math.min(openProject.images.length - 1, i + 1)) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {openProject.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  className={`w-2 h-2 rounded-full transition-all ${i === lightboxIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
