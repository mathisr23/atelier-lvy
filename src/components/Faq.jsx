import { useState } from 'react'
import Reveal from './Reveal'
import { Etiquette, Nuage, Etoile } from './Stickers'

// Questions fréquentes (Initiation, Cours) : bulles façon sticker, une couleur par question
const COULEURS = ['#F2A0A8', '#F3D07A', '#9BBF90', '#C9B8E8', '#DCE8F4']

export default function Faq({ items }) {
  const [ouverte, setOuverte] = useState(null)
  return (
    <section className="relative px-6 md:px-16 lg:px-24 py-20 overflow-hidden">
      <Nuage taille={110} couleur="#DCE8F4" className="absolute top-10 right-[6%] hidden md:block" />
      <Etoile taille={44} couleur="#C9DE6E" className="absolute bottom-16 left-[8%] hidden lg:block rotate-12" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr] gap-10 lg:gap-16 items-start">
        <Reveal>
          <div className="lg:sticky lg:top-32">
            <Etiquette fond="#F3D07A" className="mb-5">une question ?</Etiquette>
            <h2 className="font-display font-black text-4xl md:text-6xl leading-[0.95]">Questions <span className="italic text-[#E87040]">fréquentes</span></h2>
          </div>
        </Reveal>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const active = ouverte === i
            const couleur = COULEURS[i % COULEURS.length]
            return (
              <Reveal key={i} delay={i * 0.05}>
                <button
                  onClick={() => setOuverte(active ? null : i)}
                  aria-expanded={active}
                  className={`w-full text-left border-2 border-[#2A1506] rounded-2xl px-6 py-5 transition-all duration-200 ${active ? 'shadow-[5px_5px_0_#2A1506] -rotate-[0.5deg]' : 'bg-[#FBF5E9] hover:shadow-[3px_3px_0_#2A1506]'}`}
                  style={active ? { backgroundColor: couleur } : undefined}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-ui font-semibold text-[#2A1506] text-lg">{item.q}</span>
                    <span className={`w-8 h-8 shrink-0 rounded-full border-2 border-[#2A1506] flex items-center justify-center text-xl leading-none transition-transform duration-300 ${active ? 'rotate-45 bg-[#FBF5E9]' : ''}`} style={active ? undefined : { backgroundColor: couleur }}>+</span>
                  </div>
                  <div className={`grid transition-all duration-300 ease-in-out ${active ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="font-body text-[#2A1506]/80 text-lg leading-relaxed pr-8">{item.a}</p>
                    </div>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
