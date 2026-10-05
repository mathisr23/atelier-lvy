import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Asterisk, Squiggle, patterns } from '../components/Deco'
import Reveal from '../components/Reveal'
import PeleMele from '../components/PeleMele'
import GalerieFlottante from '../components/GalerieFlottante'
import { PhotoForme, Tampon, Festons } from '../components/Graphique'
import imgEtagere from '../assets/etagere-petite.png'
import { Etoile, Coeur, Nuage, Tasse, Spirale, Fleurette, FriseStickers, Etiquette, TexteArc } from '../components/Stickers'
import imgLea1 from '../assets/lea1.JPG'
import imgLea2 from '../assets/lea2.JPG'
import imgLea3 from '../assets/lea3.JPG'
import logo1 from '../assets/logo1.png'
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
import imgIMG4982 from '../assets/IMG_4982.JPG'
import imgIMG4984 from '../assets/IMG_4984.JPG'
import imgIMG5006 from '../assets/IMG_5006.JPG'

// Classes boutons partagées
const btn = {
  dark: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] border-2 border-[#2A1506] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] hover:border-[#E87040] transition-all duration-200',
  outline: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-transparent text-[#2A1506] border-2 border-[#2A1506] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-all duration-200',
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200',
}

const projects = [
  {
    id: 1,
    name: 'Métamorphose',
    subtitle: 'Porcelaine et déchets plastiques transformés',
    color: '#E87040',
    preview: img3,
    images: [img3, img4, imgFSR22, imgFSR48, imgFSR52],
  },
  {
    id: 2,
    name: 'Corail',
    subtitle: 'Vase réalisé en modelage',
    color: '#F2A0A8',
    preview: imgIMG4854,
    images: [imgIMG4854, imgIMG4862, imgIMG4863, imgIMG4869],
  },
  {
    id: 3,
    name: 'Océan',
    subtitle: 'Pièces modelées à la main',
    color: '#9BBF90',
    preview: imgIMG4948,
    images: [imgIMG4948, imgIMG4959, imgIMG5065],
  },
  {
    id: 4,
    name: 'Sand',
    subtitle: 'Pièces réalisées en modelage',
    color: '#F3D07A',
    preview: imgIMG4982,
    images: [imgIMG4982, imgIMG4984, imgIMG5006],
  },
]

export default function Apropos() {
  useSEO({
    title: 'Léa — Artiste céramiste',
    description: "Créatrice artiste céramiste. Créations en argile faites à la main, ateliers d'initiation et cours réguliers.",
  })

  const [openProject, setOpenProject] = useState(null)
  const [commentaires, setCommentaires] = useState(null)
  const [commentForm, setCommentForm] = useState({ nom: '', texte: '', type: 'initiation' })
  const [commentStatus, setCommentStatus] = useState(null)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)

  useEffect(() => {
    supabase
      .from('commentaires')
      .select('id, nom, texte, type, created_at')
      .eq('statut', 'approuve')
      .order('created_at', { ascending: false })
      .then(({ data }) => setCommentaires(data || []))
  }, [])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentForm.nom.trim() || !commentForm.texte.trim()) return
    setCommentStatus('loading')
    const { error } = await supabase.from('commentaires').insert([{
      nom: commentForm.nom.trim(),
      texte: commentForm.texte.trim(),
      type: commentForm.type,
      statut: 'pending',
    }])
    if (error) {
      setCommentStatus('error')
    } else {
      setCommentStatus('success')
      setCommentForm({ nom: '', texte: '', type: 'initiation' })
    }
  }

  const fermerProjet = useCallback(() => setOpenProject(null), [])

  useEffect(() => {
    document.body.style.overflow = openProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [openProject])

  return (
    <div className="bg-[#FBF5E9] pt-20">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-[#FCE4E1]" style={{ backgroundImage: 'radial-gradient(circle, rgba(217,112,128,0.16) 2px, transparent 2px)', backgroundSize: '26px 26px' }}>
        {/* stickers qui flottent */}
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-10 left-[6%] hidden md:block"><Etoile taille={54} couleur="#C9DE6E" /></motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-24 left-[44%] hidden lg:block"><Coeur taille={46} /></motion.div>
        <Nuage taille={130} className="absolute top-6 right-[38%] hidden lg:block opacity-90" />
        <Nuage taille={90} className="absolute bottom-10 right-4 md:right-10" />
        <Spirale taille={40} className="absolute top-1/3 left-[46%] hidden lg:block" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-6 items-center px-6 md:px-16 lg:px-24 pt-10 pb-20 lg:py-16">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 10, rotate: -12 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.1 }} className="relative z-10 -mb-6">
              <Etiquette fond="#F3D07A">artiste céramiste</Etiquette>
            </motion.div>
            <motion.div
              className="-mb-8 relative z-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <img src={logo1} alt="Léa — Artiste céramiste" className="w-auto" style={{ height: 'clamp(12rem, 32vw, 26rem)' }} />
            </motion.div>
            <motion.p
              className="relative z-10 font-display italic text-[#2A1506]/75 text-xl md:text-2xl leading-relaxed max-w-md mb-8"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
              Avec l’atelier LVY, prenez un moment dans votre quotidien pour partager une passion, apprendre un savoir-faire et vivre une expérience conviviale !
            </motion.p>
            <motion.div className="flex flex-wrap gap-4 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Link to="/boutique" className={`${btn.orange} !border-[#2A1506] shadow-[4px_4px_0_#2A1506]`}>Voir mes créations</Link>
              <Link to="/initiation" className={`${btn.dark} shadow-[4px_4px_0_#E87040]`}>Faire une initiation</Link>
            </motion.div>
            <motion.ul className="flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {[['Initiations', '#9BBF90'], ['Cours hebdo', '#C9B8E8'], ['Pièces uniques', '#F3D07A'], ['Sur mesure', '#FBF5E9']].map(([t, c], i) => (
                <li key={t} className="font-ui text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border-2 border-[#2A1506]" style={{ backgroundColor: c, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>{t}</li>
              ))}
            </motion.ul>
          </div>

          {/* Collage : ses pièces dans des formes douces + stickers */}
          <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-[34rem] aspect-square">
            <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="absolute right-0 top-0 w-[78%] aspect-square">
              <PhotoForme forme="nuage" src={imgIMG4854} alt="Vase Corail, modelé à la main" fond="#E87040" ombre="#E87040" className="w-full h-full" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="absolute left-0 bottom-0 w-[46%] aspect-square">
              <PhotoForme forme="fleur" src={imgIMG4948} alt="Bol Océan" fond="#9BBF90" ombre="#9BBF90" className="w-full h-full" />
            </motion.div>
            <Tampon taille={104} fond="#F3D07A" className="absolute left-[2%] top-[4%]" />
            <Tasse taille={58} couleur="#C9B8E8" className="absolute right-[6%] bottom-[6%] rotate-12" />
            <Etoile taille={44} couleur="#F2A0A8" branches={8} creux={0.55} className="absolute left-[44%] bottom-[30%]" />
          </div>
        </div>
      </section>

      <FriseStickers fond="#FBF5E9" />

      {/* ─── QUI SUIS-JE ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 bg-[#2A1506] text-[#FBF5E9] relative overflow-hidden" style={patterns.grain()}>
        <Asterisk size={48} color="rgba(245,208,96,0.12)" className="absolute top-10 right-20 rotate-12" />
        <Asterisk size={24} color="rgba(242,160,168,0.15)" className="absolute bottom-16 left-1/3" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#F3D07A] mb-4">Qui suis-je ?</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display font-bold text-5xl md:text-6xl leading-tight mb-8">
                Artiste et céramiste<br /><span className="italic text-[#F2A0A8]">passionnée</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-3 text-[#FBF5E9]/70 leading-relaxed font-body text-base">
                <p className="text-[#FBF5E9]/90 font-bold">Je m’appelle Léa, artiste céramiste basée à Boinville-le-Gaillard.</p>
                <p>J’ai découvert ma passion pour le modelage à l’École Boulle, en me formant à la gravure en modelé et à la création de bas-reliefs. Progressivement, je me suis tournée vers la céramique afin de donner plus de volume à mes créations, tasses, sculptures et objets variés.</p>
                <p>Formée grâce à plusieurs divers stages, j’ai ensuite développé mon activité d’auto-entrepreneur afin de produire des commandes pour des ateliers collaborant avec de grandes maisons. Ces expériences m’ont permis de maîtriser les techniques de modelage, de coulage ou encore de décor.</p>
                <p>Aujourd’hui, je crée mes propres pièces en m’inspirant de la nature, de ses formes organiques et la richesse de ses couleurs. J’intègre également des réflexions sociétales et environnementales à mon travail. J’imagine mon atelier comme un laboratoire d’idées, où se mêlent des savoir-faire et une pluralité de matériaux.</p>
                <p>Je transmets ma passion à travers des ateliers découverte et des cours hebdomadaires, pensés comme des espaces de rencontre et de partage où l’on peut libérer notre créativité. J’y crée des moments hors du quotidien, où chacun peut expérimenter, s’exprimer librement et laisser place à son imagination, tout en tissant du lien avec d’autres.</p>
              </div>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.15}>
            <div className="relative h-[520px]">
              {/* Photo 1 — haut gauche */}
              <div className="absolute top-0 left-0 w-64 h-80 bg-[#FBF5E9] p-2.5 pb-10 shadow-xl rotate-[-3deg]">
                <img src={imgLea1} alt="Léa céramiste" className="w-full h-full object-cover object-top" />
              </div>
              {/* Photo 2 — bas droite */}
              <div className="absolute bottom-0 right-0 w-64 h-80 bg-[#FBF5E9] p-2.5 pb-10 shadow-2xl rotate-[3deg] z-10">
                <img src={imgLea2} alt="Léa à l'atelier" className="w-full h-full object-cover object-center" />
              </div>
              <div className="absolute -bottom-10 left-0 w-40 h-40 z-30 rounded-full bg-[#F3D07A] border-[3px] border-[#2A1506] shadow-[5px_5px_0_#E87040] flex flex-col items-center justify-center text-[#2A1506] -rotate-6">
                <Fleurette taille={46} couleur="#F2A0A8" coeur="#FBF5E9" className="absolute -top-4 -right-2 rotate-12" />
                <p className="font-display font-black text-5xl leading-none">5 ans</p>
                <p className="font-main font-bold text-2xl leading-none mt-1">d'expérience</p>
              </div>
              <span className="absolute top-2 right-6 z-20"><Etiquette fond="#F2A0A8" rotation={6}>c'est moi !</Etiquette></span>
              <span className="absolute -top-2 left-20 z-20 w-20 h-6 bg-[#FBF5E9]/70 -rotate-12" aria-hidden="true" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── MES CRÉATIONS ─── */}
      <Festons couleur="#DCE8F4" />
      <section className="relative px-6 md:px-16 lg:px-24 pt-14 pb-20 bg-[#DCE8F4] overflow-hidden">
        <Nuage taille={110} className="absolute top-8 left-[4%] hidden md:block" />
        <Nuage taille={80} className="absolute top-24 right-[6%]" />
        <Etoile taille={40} couleur="#F3D07A" className="absolute bottom-16 left-[3%] hidden md:block" />
        <Coeur taille={36} couleur="#F2A0A8" className="absolute bottom-24 right-[4%] hidden md:block" />
        <div className="max-w-7xl mx-auto relative">
          <Reveal>
            <div className="text-center mb-12">
              <TexteArc texte="modeler · émailler · cuire" largeur={460} courbure={40} taille={30} couleur="#E87040" className="mx-auto w-[min(100%,26rem)] -mb-2" />
              <h2 className="font-display font-black text-5xl md:text-7xl leading-none">Mes <span className="italic">créations</span></h2>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <a href={bookPdf} target="_blank" rel="noopener noreferrer" className={`${btn.dark} !py-2.5 !px-5`}>Feuilleter mon book →</a>
                <Link to="/boutique" className={`${btn.outline} !py-2.5 !px-5 bg-[#FBF5E9]`}>Voir la boutique →</Link>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08} direction="up">
                <button
                  onClick={() => setOpenProject(project)}
                  className="group relative w-full text-left bg-[#FBF5E9] border-2 border-[#2A1506] rounded-[2rem] p-2.5 md:p-3 transition-all duration-300 hover:-translate-y-1.5 hover:-rotate-1 hover:shadow-[6px_6px_0_#2A1506]"
                >
                  <div className="relative aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#2A1506]" style={{ backgroundColor: project.color }}>
                    <img src={project.preview} alt={project.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  {/* fleur « voir » qui déborde */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 md:w-20 md:h-20 transition-transform duration-500 group-hover:rotate-45">
                    <Fleurette taille="100%" couleur={project.color} coeur="#FBF5E9" rayonCoeur={24} className="absolute inset-0 w-full h-full" />
                    <span className="absolute inset-0 flex items-center justify-center font-main font-bold text-base md:text-lg">voir</span>
                  </div>
                  <div className="px-1.5 pt-3 pb-1">
                    <p className="font-display font-bold text-lg md:text-2xl leading-none">{project.name}</p>
                    <p className="font-ui text-[0.65rem] md:text-xs text-[#2A1506]/55 mt-1.5 leading-snug">{project.subtitle}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Festons couleur="#DCE8F4" inverse />

      {/* ─── CE QUE JE VEUX FAIRE ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 relative overflow-hidden" style={{ backgroundColor: 'rgba(242,160,168,0.15)', ...patterns.dots('rgba(217,112,128,0.1)') }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-end justify-between gap-8">
            <div>
              <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#D97080] mb-4">La suite</p></Reveal>
              <Reveal delay={0.1}><h2 className="font-display font-black text-4xl md:text-6xl mb-16 max-w-xl leading-tight">Ce que je veux <span className="italic text-[#E87040]">créer</span></h2></Reveal>
            </div>
            {/* Étagère dessinée par Léa, posée derrière les cartes */}
            <Reveal direction="left" delay={0.15}>
              <img src={imgEtagere} alt="Étagère de céramiques dessinée par Léa" loading="lazy" className="hidden md:block w-52 lg:w-60 -mb-10 mr-4 lg:mr-12 rotate-2 mix-blend-multiply pointer-events-none" />
            </Reveal>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { color: '#E87040', title: 'Un lieu de partage et de rencontre', text: 'De nos jours, il est difficile de faire de nouvelles rencontres. C’est pourquoi, à travers ces initiations, je souhaite créer un espace d’échange, permettant de rencontrer d’autres personnes partageant les mêmes passions.', tag: 'Ateliers' },
              { color: '#9BBF90', title: 'Cours enfants', text: 'Des séances adaptées aux petits, pour leur faire découvrir le plaisir de l\'argile entre leurs mains. Laisser parler leur imagination pour stimuler leur confiance en eux et leur créativité !', tag: 'Sur demande' },
              { color: '#F3D07A', title: 'Prochainement : l\'art thérapie', text: 'Mettre l’art au service de la personne est un de mes objectifs futurs ! Me former à cette pratique me permettrait de créer une bulle pour ceux qui ont besoin d’aide pour mieux se comprendre et s’exprimer.', tag: 'Futur' },
            ].map(({ color, title, text, tag }, i) => (
              <Reveal key={title} delay={i * 0.1} direction="up">
                <div className="relative h-full rounded-[2rem] p-8 border-2 border-[#2A1506] shadow-[5px_5px_0_#2A1506] hover:-translate-y-1 hover:-rotate-1 transition-all duration-200" style={{ background: `linear-gradient(${color}40, ${color}40), #FBF5E9` }}>
                  <span className="absolute -top-6 -right-3">{[<Tasse key="t" taille={56} couleur={color} />, <Coeur key="c" taille={52} couleur={color} />, <Etoile key="e" taille={54} couleur={color} />][i]}</span>
                  <span className="inline-block font-main font-bold text-xl leading-none px-3 py-1 rounded-full border-2 border-[#2A1506] mb-6 -rotate-3" style={{ backgroundColor: color }}>{tag}</span>
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
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#F3D07A] mb-4">Ils témoignent</p>
            <h2 className="relative inline-block font-display font-bold text-5xl md:text-6xl text-[#FBF5E9] leading-tight mb-16">
              Ce qu'ils<br /><span className="italic text-[#F2A0A8]">en disent</span>
              <span className="absolute left-full ml-4 top-2 whitespace-nowrap"><Etiquette fond="#C9DE6E" rotation={8}>merci !</Etiquette></span>
            </h2>
          </Reveal>

          {/* Commentaires — accrochés sur un pêle-mêle, masqué si aucun avis approuvé */}
          {commentaires && commentaires.length > 0 && (
            <div className="mb-16">
              <PeleMele commentaires={commentaires} />
            </div>
          )}

          {/* Formulaire laisser un commentaire */}
          <Reveal delay={0.2}>
            <div className="bg-[#FBF5E9]/5 border border-[#FBF5E9]/10 rounded-3xl p-8">
              <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#F3D07A] mb-3">Votre tour</p>
              <h3 className="font-display font-bold text-2xl text-[#FBF5E9] mb-6">Laisser un témoignage</h3>
              {commentStatus === 'success' ? (
                <div className="text-center py-6">
                  <p className="font-display italic text-2xl text-[#9BBF90] mb-2">Merci !</p>
                  <p className="font-ui text-sm text-[#FBF5E9]/50">Votre témoignage est en cours de validation et apparaîtra prochainement.</p>
                  <button onClick={() => setCommentStatus(null)} className="mt-4 font-ui text-xs text-[#FBF5E9]/30 hover:text-[#FBF5E9]/60 transition-colors underline">
                    Laisser un autre témoignage
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Votre prénom / nom</label>
                      <input
                        type="text"
                        value={commentForm.nom}
                        onChange={e => setCommentForm(f => ({ ...f, nom: e.target.value }))}
                        required
                        maxLength={60}
                        placeholder="Camille R."
                        className="w-full font-ui text-sm bg-[#FBF5E9]/8 border-2 border-[#FBF5E9]/10 focus:border-[#E87040] outline-none rounded-xl px-4 py-2.5 text-[#FBF5E9] placeholder:text-[#FBF5E9]/20 transition-colors"
                      />
                    </div>
                    <div className="sm:w-44 relative">
                      <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Contexte</label>
                      <button
                        type="button"
                        onClick={() => setTypeDropdownOpen(o => !o)}
                        className="w-full font-ui text-sm bg-[#FBF5E9]/8 border-2 border-[#FBF5E9]/10 focus:border-[#E87040] outline-none rounded-xl px-4 py-2.5 text-[#FBF5E9] transition-colors flex items-center justify-between"
                      >
                        <span>{{ initiation: 'Initiation', cours: 'Cours', autre: 'Autre' }[commentForm.type]}</span>
                        <svg className={`w-4 h-4 text-[#FBF5E9]/40 transition-transform duration-200 ${typeDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {typeDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setTypeDropdownOpen(false)} />
                          <div className="absolute top-[110%] left-0 w-full bg-[#2A1506] border-2 border-[#FBF5E9]/10 rounded-xl overflow-hidden z-20 shadow-2xl flex flex-col">
                            {[{ v: 'initiation', l: 'Initiation' }, { v: 'cours', l: 'Cours' }, { v: 'autre', l: 'Autre' }].map(({ v, l }) => (
                              <button key={v} type="button"
                                onClick={() => { setCommentForm(f => ({ ...f, type: v })); setTypeDropdownOpen(false) }}
                                className={`w-full text-left px-4 py-2.5 font-ui text-sm transition-colors ${v === commentForm.type ? 'bg-[#E87040]/15 text-[#E87040] font-semibold' : 'text-[#FBF5E9]/70 hover:bg-[#FBF5E9]/5 hover:text-[#FBF5E9]'}`}>
                                {l}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Votre témoignage</label>
                    <textarea
                      value={commentForm.texte}
                      onChange={e => setCommentForm(f => ({ ...f, texte: e.target.value }))}
                      required
                      maxLength={400}
                      rows={3}
                      placeholder="Partagez votre expérience avec l'atelier…"
                      className="w-full font-ui text-sm bg-[#FBF5E9]/8 border-2 border-[#FBF5E9]/10 focus:border-[#E87040] outline-none rounded-xl px-4 py-2.5 text-[#FBF5E9] placeholder:text-[#FBF5E9]/20 transition-colors resize-none"
                    />
                    <p className="font-ui text-xs text-[#FBF5E9]/20 mt-1 text-right">{commentForm.texte.length}/400</p>
                  </div>
                  {commentStatus === 'error' && (
                    <p className="font-ui text-xs text-[#F2A0A8]">Une erreur est survenue, veuillez réessayer.</p>
                  )}
                  <div className="flex items-center gap-4">
                    <button type="submit" disabled={commentStatus === 'loading'}
                      className="font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] rounded-xl hover:bg-[#FBF5E9] transition-colors disabled:opacity-50">
                      {commentStatus === 'loading' ? 'Envoi…' : 'Envoyer →'}
                    </button>
                    <p className="font-ui text-xs text-[#FBF5E9]/25">Les témoignages sont vérifiés avant publication.</p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── INSTAGRAM ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-3">Instagram</p>
                <h2 className="relative inline-block font-display font-black text-5xl md:text-6xl leading-tight">
                  Sur<br /><span className="italic text-[#9BBF90]">l'atelier</span>
                  <Etoile taille={42} couleur="#F3D07A" className="absolute -top-4 -right-12 rotate-12" />
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
      <section className="px-5 md:px-16 lg:px-24 pt-8 pb-24">
        <Reveal direction="scale">
          <div className="relative max-w-5xl mx-auto text-center bg-[#E87040] border-2 border-[#2A1506] rounded-[3rem] shadow-[8px_8px_0_#2A1506] px-6 py-16 md:py-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(42,21,6,0.1) 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}>
            <Nuage taille={120} className="absolute -top-10 -left-6" />
            <Etoile taille={60} couleur="#C9DE6E" className="absolute -top-7 right-10 rotate-12" />
            <Coeur taille={50} className="absolute -bottom-6 right-[18%]" />
            <Fleurette taille={46} couleur="#FBF5E9" coeur="#F3D07A" className="absolute bottom-8 left-8 hidden md:block" />
            <Etiquette fond="#FBF5E9" className="mb-6">un projet, une question ?</Etiquette>
            <h2 className="font-display font-black leading-[0.95] mb-6 text-[#2A1506]" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
              On travaille<br /><span className="italic text-[#FBF5E9]">ensemble ?</span>
            </h2>
            <p className="font-body text-[#2A1506]/80 text-xl mb-10 max-w-md mx-auto">
              Commande sur mesure, initiation, ou juste une question, je réponds à tout.
            </p>
            <Link to="/contact" className={`${btn.dark} !text-base !px-10 !py-4 shadow-[4px_4px_0_#FBF5E9]`}>
              Me contacter →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ─── GALERIE D'UN PROJET : photos flottantes ─── */}
      <AnimatePresence>
        {openProject && <GalerieFlottante key={openProject.id} projet={openProject} onFermer={fermerProjet} />}
      </AnimatePresence>

    </div>
  )
}
