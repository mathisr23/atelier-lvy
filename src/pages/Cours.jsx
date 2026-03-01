import { useState } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { Baby } from 'lucide-react'
import { Asterisk, patterns } from '../components/Deco'
import Reveal from '../components/Reveal'

function FaqSection({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto">
      <Reveal>
        <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#9BBF90] mb-3">FAQ</p>
        <h2 className="font-display font-bold text-4xl md:text-5xl mb-10">Questions fréquentes</h2>
      </Reveal>
      <div className="flex flex-col gap-3 max-w-3xl">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left bg-[#FBF5E9] border-2 border-[#2A1506]/10 rounded-2xl px-6 py-5 hover:border-[#9BBF90]/60 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-ui font-semibold text-[#2A1506] text-lg">{item.q}</span>
                <span className={`text-[#9BBF90] text-2xl font-light flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </div>
              <div className={`grid transition-all duration-300 ease-in-out ${open === i ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="font-body text-[#2A1506]/65 text-base leading-relaxed pr-8">{item.a}</p>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const btn = {
  dark: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] border-2 border-[#E87040] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  outline: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-transparent text-[#E87040] border-2 border-[#E87040] rounded-xl hover:bg-[#E87040] hover:text-[#FBF5E9] transition-all duration-200 whitespace-nowrap',
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-transparent hover:text-[#E87040] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  sage: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#9BBF90] text-[#2A1506] border-2 border-[#9BBF90] rounded-xl hover:bg-[#E87040] hover:text-[#FBF5E9] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
}

const coursJeudi = [
  { date: '5 mars', heure: '17h – 19h30', places: 5, dispo: true },
  { date: '12 mars', heure: '17h – 19h30', places: 3, dispo: true },
  { date: '26 mars', heure: '17h – 19h30', places: 6, dispo: true },
  { date: '2 avril', heure: '17h – 19h30', places: 0, dispo: false },
  { date: '9 avril', heure: '17h – 19h30', places: 4, dispo: true },
  { date: '16 avril', heure: '17h – 19h30', places: 6, dispo: true },
]

const coursSamedi = [
  { date: '8 mars', heure: '10h – 12h30', places: 4, dispo: true },
  { date: '15 mars', heure: '14h – 16h30', places: 2, dispo: true },
  { date: '22 mars', heure: '10h – 12h30', places: 0, dispo: false },
  { date: '5 avril', heure: '10h – 12h30', places: 5, dispo: true },
  { date: '12 avril', heure: '14h – 16h30', places: 6, dispo: true },
  { date: '26 avril', heure: '10h – 12h30', places: 3, dispo: true },
]

function SessionCard({ c, selected, onClick }) {
  return (
    <button
      disabled={!c.dispo}
      onClick={onClick}
      className={`rounded-xl p-4 text-left transition-all duration-150 border-2 w-full ${!c.dispo
        ? 'opacity-40 cursor-not-allowed bg-[#2A1506]/5 border-transparent'
        : selected
          ? 'bg-[#2A1506] border-[#2A1506] text-[#FBF5E9] translate-x-[2px] translate-y-[2px]'
          : 'bg-[#FBF5E9] border-[#2A1506]/15 shadow-[2px_2px_0px_rgba(42,21,6,0.15)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
        }`}
    >
      <p className={`font-display font-bold text-lg ${selected ? 'text-[#FBF5E9]' : 'text-[#2A1506]'}`}>{c.date}</p>
      <p className={`font-ui text-sm ${selected ? 'text-[#FBF5E9]/70' : 'text-[#2A1506]/60'}`}>{c.heure}</p>
      <p className={`font-ui text-xs mt-2 ${selected ? 'text-[#9BBF90]' : 'text-[#2A1506]/40'}`}>
        {c.dispo ? `${c.places} place${c.places > 1 ? 's' : ''} restante${c.places > 1 ? 's' : ''}` : 'Complet'}
      </p>
    </button>
  )
}

export default function Cours() {
  useSEO({
    title: 'Cours de céramique — Léa',
    description: "Cours réguliers de céramique proposés en packs. Progressez semaine après semaine dans un petit groupe chaleureux.",
  })

  const [selectedJeudi, setSelectedJeudi] = useState(null)
  const [selectedSamedi, setSelectedSamedi] = useState(null)

  const selectedSession =
    selectedJeudi !== null ? `Jeudi ${coursJeudi[selectedJeudi].date}`
      : selectedSamedi !== null ? `Samedi ${coursSamedi[selectedSamedi].date}`
        : null

  return (
    <div className="bg-[#FBF5E9] pt-20">

      {/* HERO */}
      <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto">
        <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#9BBF90] mb-4">Cours réguliers</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display font-black leading-[0.9] mb-8" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
            Apprendre,<br /><span className="italic text-[#9BBF90]">semaine</span><br />après semaine<span className="text-[#E87040]">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-ui text-[#2A1506]/60 text-lg max-w-xl leading-relaxed">
            Les cours réguliers, ce n'est pas une initiation. C'est un engagement dans la durée pour vraiment progresser, explorer des techniques variées et trouver ton propre style dans l'argile.
          </p>
        </Reveal>
      </section>

      {/* CONCEPT PACKS */}
      <section className="px-6 md:px-16 lg:px-24 py-24 relative overflow-hidden" style={{ backgroundColor: '#9BBF90', backgroundImage: 'radial-gradient(circle, rgba(42,21,6,0.1) 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/50 mb-4">Comment ça marche</p>
                <h2 className="font-display font-black text-4xl md:text-5xl text-[#2A1506] leading-tight mb-6">
                  Un cours seul,<br /><span className="italic">ça ne suffit pas.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="font-ui text-[#2A1506]/70 text-base leading-relaxed mb-6">
                  Une seule séance, c'est une initiation. Les cours réguliers sont faits pour progresser vraiment : apprendre les techniques de modelage, de tournage et de décoration, séance après séance, dans un petit groupe soudé.
                </p>
                <p className="font-ui text-[#2A1506]/70 text-base leading-relaxed mb-8">
                  C'est pourquoi les cours sont proposés en packs de 5 ou 10 séances. Tu choisis ton créneau et tu t'y retrouves à chaque fois.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="flex flex-wrap gap-3">
                  {['Petit groupe (6 pers. max)', 'Tous niveaux bienvenus', 'Matériel fourni', 'Cuissons incluses'].map(item => (
                    <span key={item} className="font-ui text-sm bg-[#2A1506]/10 text-[#2A1506] px-4 py-2 rounded-xl">
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Les deux créneaux */}
            <div className="flex flex-col gap-4">
              <Reveal delay={0.05}>
                <div className="bg-[#2A1506] text-[#FBF5E9] rounded-3xl p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 mb-1">En semaine</p>
                      <h3 className="font-display font-black text-4xl">Jeudi soir</h3>
                      <p className="font-ui text-[#F5D060] text-base font-medium mt-1">17h – 19h30</p>
                    </div>
                    <span className="font-display italic text-6xl text-[#FBF5E9]/10 select-none leading-none">J</span>
                  </div>
                  <div className="bg-[#FBF5E9]/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="font-ui text-sm text-[#FBF5E9]/70">
                      <p className="text-[#FBF5E9] font-semibold mb-1">Pack 5 séances : 275€</p>
                      <p>Pack 10 séances : 550€</p>
                      <p className="text-[#F5D060]/80 text-xs mt-1.5">Présence à chaque jeudi requise.</p>
                    </div>
                    <a href="#planning-jeudi" className="bg-[#F5D060] text-[#2A1506] border-2 border-[#F5D060] font-ui font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200 whitespace-nowrap">
                      Voir les dates →
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="bg-[#FBF5E9] border-2 border-[#2A1506]/10 rounded-3xl p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-ui text-xs uppercase tracking-widest text-[#2A1506]/40 mb-1">Week-end</p>
                      <h3 className="font-display font-black text-4xl text-[#2A1506]">Samedi</h3>
                      <p className="font-ui text-[#E87040] text-base font-medium mt-1">Matin ou après-midi</p>
                    </div>
                    <span className="font-display italic text-6xl text-[#2A1506]/5 select-none leading-none">S</span>
                  </div>
                  <div className="bg-[#2A1506]/5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="font-ui text-sm text-[#2A1506]/70">
                      <p className="text-[#2A1506] font-semibold mb-1">Pack 5 séances : 350€</p>
                      <p>Pack 10 séances : 650€</p>
                    </div>
                    <a href="#planning-samedi" className={btn.orange.replace('px-8 py-3.5', 'px-5 py-2.5')}>Voir les dates →</a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PLANNING JEUDI */}
      <section id="planning-jeudi" className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto scroll-mt-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Jeudis soir</h2>
            <span className="font-ui text-xs bg-[#F5D060] text-[#2A1506] px-3 py-1 rounded-lg uppercase tracking-widest">17h – 19h30</span>
            <span className="font-ui text-xs text-[#2A1506]/40 bg-[#2A1506]/5 px-3 py-1 rounded-lg">Mars – Avril 2026</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {coursJeudi.map((c, i) => (
              <SessionCard key={i} c={c} selected={selectedJeudi === i} onClick={() => { setSelectedJeudi(selectedJeudi === i ? null : i); setSelectedSamedi(null) }} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* PLANNING SAMEDI */}
      <section id="planning-samedi" className="px-6 md:px-16 lg:px-24 pb-20 max-w-7xl mx-auto scroll-mt-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Samedis</h2>
            <span className="font-ui text-xs bg-[#E87040] text-[#FBF5E9] px-3 py-1 rounded-lg uppercase tracking-widest">Matin &amp; après-midi</span>
            <span className="font-ui text-xs text-[#2A1506]/40 bg-[#2A1506]/5 px-3 py-1 rounded-lg">Mars – Avril 2026</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {coursSamedi.map((c, i) => (
              <SessionCard key={i} c={c} selected={selectedSamedi === i} onClick={() => { setSelectedSamedi(selectedSamedi === i ? null : i); setSelectedJeudi(null) }} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* RESERVATION */}
      <section className="px-6 md:px-16 lg:px-24 py-20 relative overflow-hidden" style={{ backgroundColor: '#2A1506', backgroundImage: 'radial-gradient(circle, rgba(251,245,233,0.04) 1px, transparent 1px)', backgroundSize: '6px 6px' }}>
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#FBF5E9]/40 mb-4">Inscription</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[#FBF5E9] mb-4 leading-tight">
              {selectedSession
                ? <>Tu as choisi : <span className="italic text-[#F5D060]">{selectedSession}</span></>
                : <>Choisis une <span className="italic text-[#9BBF90]">date</span></>}
            </h2>
            <p className="font-ui text-[#FBF5E9]/50 text-sm mb-10">
              Je confirme ta place uniquement par mail à{' '}
              <a href="mailto:contact.atelierlevy@gmail.com" className="text-[#9BBF90] underline underline-offset-2">contact.atelierlevy@gmail.com</a>.
            </p>
            <div className="flex justify-center">
              <Link to={selectedSession ? `/contact?type=cours&date=${selectedSession}` : '/contact?type=cours'} className={btn.sage}>M'inscrire par mail →</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <FaqSection
        items={[
          { q: "Peut-on commencer sans expérience ?", a: "Oui, les cours sont ouverts à tous les niveaux. Si tu n'as jamais touché l'argile, une initiation avant de prendre un pack est une bonne façon de démarrer." },
          { q: "Que se passe-t-il si je rate une séance ?", a: "Le pack est valable sur la saison en cours. En cas d'absence, la séance n'est pas automatiquement reportée, mais contacte-moi directement et on s'arrange selon les disponibilités." },
          { q: "Les cuissons sont-elles vraiment incluses ?", a: "Oui, les deux cuissons (biscuit et émaillage) sont comprises dans le prix du pack. Aucun frais supplémentaire." },
          { q: "Peut-on rejoindre un pack en cours de saison ?", a: "Oui, tu peux rejoindre le groupe dès qu'une place se libère, quelle que soit la date dans la saison. Le tarif est ajusté au prorata des séances restantes." },
          { q: "Combien de temps pour récupérer ses pièces ?", a: "Les pièces sont cuites en lot à intervalles réguliers. Compte généralement 2 à 4 semaines après chaque séance pour les récupérer à l'atelier." },
        ]}
      />

      {/* COURS ENFANTS */}
      <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto">
        <Reveal>
          <div className="bg-[#F2A0A8]/20 border border-[#F2A0A8]/40 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-8">
            <div className="text-[#D97080] bg-[#FBF5E9] p-4 rounded-full shadow-sm">
              <Baby size={48} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <span className="inline-block font-ui text-xs uppercase tracking-widest bg-[#F2A0A8] text-[#2A1506] px-3 py-1 rounded-lg mb-3">Bientôt</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-[#2A1506] mb-3">Cours enfants</h3>
              <p className="font-ui text-[#2A1506]/60 text-sm leading-relaxed max-w-md">
                Des séances adaptées aux petits curieux, pour découvrir la céramique en s'amusant. Planning en cours de construction, reste connecté·e !
              </p>
            </div>
            <Link to="/contact?type=cours" className={btn.outline}>Me prévenir</Link>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
