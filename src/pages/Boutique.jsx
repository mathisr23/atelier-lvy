import useSEO from '../hooks/useSEO'
import { Asterisk, patterns } from '../components/Deco'
import Reveal from '../components/Reveal'

import img1 from '../assets/2.jpg'
import img2 from '../assets/3.jpg'
import img3 from '../assets/4.jpg'
import img4 from '../assets/5.jpg'
import img5 from '../assets/FullSizeRender-1.jpg'
import img6 from '../assets/FullSizeRender-22.jpg'
import img7 from '../assets/FullSizeRender-48.jpg'
import img8 from '../assets/FullSizeRender-52.jpg'

const btn = {
  dark: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] border-2 border-[#2A1506] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  outline: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-transparent text-[#2A1506] border-2 border-[#2A1506] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-all duration-200 whitespace-nowrap',
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200 whitespace-nowrap',
}

const CollectionImage = ({ src, className, style }) => (
  <img src={src} className={`${className} object-cover w-full opacity-0 translate-y-4`} style={style} alt="Pièce de collection" onLoad={(e) => { e.target.classList.remove('opacity-0', 'translate-y-4'); e.target.classList.add('transition-all', 'duration-700', 'ease-out') }} />
)

const steps = [
  { num: '01', title: 'On se contacte', text: "Tu m'envoies un message avec ton idée, tes envies, le contexte. On échange pour bien cerner ce que tu veux.", color: '#E87040' },
  { num: '02', title: 'Devis + croquis', text: "Je te prépare un devis et un premier croquis de ta pièce. On affine ensemble jusqu'à ce que ce soit parfait.", color: '#9BBF90' },
  { num: '03', title: 'Création', text: "Je façonne ta pièce à la main, je la cuis au four. Chaque étape est faite avec soin, ça prend un peu de temps, mais ça vaut le coup.", color: '#F2A0A8' },
  { num: '04', title: 'Livraison', text: "Ta pièce unique arrive chez toi, prête à être utilisée et chérie.", color: '#F5D060' },
]

export default function Boutique() {
  useSEO({
    title: 'Boutique — Léa Céramiste',
    description: 'Explorez mes créations en céramique disponibles à la vente — pièces uniques faites à la main.',
  })

  return (
    <div className="bg-[#FBF5E9] pt-20">

      {/* HERO */}
      <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto relative">
        <Asterisk size={24} color="#E87040" className="absolute top-24 right-8 opacity-25 rotate-12" />
        <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-4">Boutique</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display font-black leading-[0.9] mb-10" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}>
            Mes pièces<span className="text-[#E87040]">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-body text-[#2A1506]/60 text-xl max-w-xl leading-relaxed">
            Des objets faits à la main, en grès, uniques par nature. Chaque pièce est différente, c'est ça qui en fait le charme.
          </p>
        </Reveal>
      </section>

      {/* COLLECTION COMING SOON */}
      <section className="px-6 md:px-16 lg:px-24 py-16 max-w-7xl mx-auto">
        <Reveal>
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Ma collection</h2>
            <span className="font-ui text-xs font-semibold bg-[#F5D060] text-[#2A1506] px-4 py-2 rounded-lg uppercase tracking-widest">Coming soon</span>
          </div>
        </Reveal>
        <Reveal direction="scale" delay={0.1}>
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none opacity-80">
              <CollectionImage src={img1} className="h-64" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />
              <CollectionImage src={img2} className="h-64 md:h-80 md:-mt-8" style={{ borderRadius: '50% 50% 40% 60% / 60% 40% 50% 50%' }} />
              <CollectionImage src={img3} className="h-64" style={{ borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%' }} />
              <CollectionImage src={img4} className="h-64 md:h-80 md:-mt-8" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />
              <CollectionImage src={img5} className="h-48 hidden md:block" style={{ borderRadius: '70% 30% 50% 50% / 30% 50% 70% 50%' }} />
              <CollectionImage src={img6} className="h-48 hidden md:block" style={{ borderRadius: '40% 60% 30% 70% / 60% 40% 50% 50%' }} />
              <CollectionImage src={img7} className="h-48 hidden md:block" style={{ borderRadius: '50% 50% 60% 40% / 40% 50% 60% 50%' }} />
              <CollectionImage src={img8} className="h-48 hidden md:block" style={{ borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%' }} />
            </div>
            <div className="absolute inset-0 backdrop-blur-md bg-[#FBF5E9]/60 rounded-2xl flex flex-col items-center justify-center text-center px-6 gap-6">
              <div className="bg-[#2A1506] text-[#FBF5E9] rounded-lg px-8 py-3">
                <p className="font-ui text-xs uppercase tracking-[0.3em] font-bold">Bientôt disponible</p>
              </div>
              <p className="font-display italic text-3xl md:text-5xl text-[#2A1506] max-w-lg leading-tight">La collection arrive bientôt...</p>
              <p className="font-body text-[#2A1506]/60 text-base max-w-sm">En attendant, tu peux me contacter pour une pièce sur mesure ou suivre mes créations sur Instagram.</p>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={btn.orange}>Suivre sur Instagram</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SUR COMMANDE */}
      <section className="px-6 md:px-16 lg:px-24 py-24 mt-16 relative overflow-hidden" style={{ backgroundColor: '#9BBF90', backgroundImage: 'radial-gradient(circle, rgba(42,21,6,0.1) 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }}>
        <Asterisk size={40} color="rgba(42,21,6,0.1)" className="absolute top-12 right-12 rotate-6" />
        <Asterisk size={22} color="rgba(42,21,6,0.08)" className="absolute bottom-20 left-8 -rotate-12" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/60 mb-4">Création personnalisée</p>
            <h2 className="font-display font-bold text-5xl md:text-6xl text-[#2A1506] leading-tight max-w-xl mb-16">
              Une pièce<br /><span className="italic">rien que pour toi</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map(({ num, title, text, color }, i) => (
              <Reveal key={num} delay={i * 0.08} direction="up">
                <div className="bg-[#FBF5E9] rounded-3xl p-6 flex flex-col gap-4 h-full">
                  <span className="font-display font-black text-4xl" style={{ color }}>{num}</span>
                  <h3 className="font-display font-bold text-xl text-[#2A1506]">{title}</h3>
                  <p className="font-body text-base text-[#2A1506]/60 leading-relaxed flex-1">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[#2A1506] rounded-3xl p-8">
              <div className="flex-1">
                <h3 className="font-display font-bold text-2xl text-[#FBF5E9] mb-2">Tu as une idée en tête ?</h3>
                <p className="font-body text-base text-[#FBF5E9]/60">Dis-moi tout, même une idée vague, on la développe ensemble.</p>
              </div>
              <a href="mailto:lea.ceramique@gmail.com?subject=Commande sur mesure" className={btn.orange}>Faire une demande →</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CUISSONS */}
      <section className="px-6 md:px-16 lg:px-24 py-24 max-w-7xl mx-auto">
        <Reveal>
          <div className="bg-[#F2A0A8]/20 border border-[#F2A0A8]/40 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#D97080] mb-3">Services</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-[#2A1506] mb-4 leading-tight">Cuissons extérieures</h2>
              <p className="font-body text-[#2A1506]/60 text-base leading-relaxed max-w-sm">
                Tu as modelé des pièces ailleurs et tu cherches un four ? Je propose des cuissons pour des projets extérieurs. Contacte-moi pour les tarifs et conditions.
              </p>
            </div>
            <a href="mailto:lea.ceramique@gmail.com?subject=Cuisson extérieure" className={btn.dark}>Me contacter</a>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
