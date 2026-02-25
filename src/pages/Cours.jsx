import { useState } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { Baby } from 'lucide-react'
import { Asterisk, patterns } from '../components/Deco'
import Reveal from '../components/Reveal'

const btn = {
  dark: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] border-2 border-[#E87040] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  outline: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-transparent text-[#E87040] border-2 border-[#E87040] rounded-xl hover:bg-[#E87040] hover:text-[#FBF5E9] transition-all duration-200 whitespace-nowrap',
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-transparent hover:text-[#E87040] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  sage: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#9BBF90] text-[#2A1506] border-2 border-[#9BBF90] rounded-xl hover:bg-[#E87040] hover:text-[#FBF5E9] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  rose: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#F2A0A8] text-[#2A1506] border-2 border-[#F2A0A8] rounded-xl hover:bg-[#E87040] hover:text-[#FBF5E9] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
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
    description: 'Cours réguliers de céramique pour adultes et enfants. Tournage, modelage et émaillage dans un atelier chaleureux.',
  })

  const [selectedJeudi, setSelectedJeudi] = useState(null)
  const [selectedSamedi, setSelectedSamedi] = useState(null)
  const [contactMode, setContactMode] = useState('mail')

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
            Des séances régulières pour progresser à ton rythme. On travaille des techniques de modelage variées pour s’adapter à tes projets, différentes techniques de décors, les engobes, les jeux de texture… Tout ça, en petit groupe, dans une ambiance détendue et chaleureuse.
          </p>
        </Reveal>
      </section>

      {/* DEUX FORMATS */}
      <section className="px-6 md:px-16 lg:px-24 py-24 relative overflow-hidden" style={{ backgroundColor: '#9BBF90', backgroundImage: 'radial-gradient(circle, rgba(42,21,6,0.1) 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }}>
        <div className="max-w-7xl mx-auto">
          <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/50 mb-12">Deux créneaux hebdomadaires</p></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delay={0.05}>
              <div className="bg-[#2A1506] text-[#FBF5E9] rounded-3xl p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 mb-2">Semaine</p>
                    <h2 className="font-display font-black text-5xl">Jeudi</h2>
                    <p className="font-ui text-[#F5D060] text-lg font-medium mt-1">17h – 19h30</p>
                  </div>
                  <span className="font-display italic text-7xl text-[#FBF5E9]/10 select-none">J</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {['Petit groupe (6 pers. max)', 'Tous niveaux bienvenus', 'Matériel fourni', 'Cuissons incluses'].map(item => (
                    <li key={item} className="flex items-center gap-2 font-ui text-sm text-[#FBF5E9]/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5D060] flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <div className="bg-[#FBF5E9]/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-ui text-xs text-[#FBF5E9]/40 uppercase tracking-widest">Tarif (2h30)</p>
                    <p className="font-display font-bold text-2xl text-[#F5D060]">55€ <span className="text-lg font-body font-normal">le cours</span></p>
                    <div className="font-ui text-xs text-[#FBF5E9]/60 mt-1">
                      Forfait 5 séances : 275€ <br />
                      Forfait 10 séances : 550€
                    </div>
                  </div>
                  <a href="#planning-jeudi" className="bg-[#F5D060] text-[#2A1506] border-2 border-[#F5D060] font-ui font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200">
                    Voir les dates →
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-[#FBF5E9] border-2 border-[#2A1506]/10 rounded-3xl p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-ui text-xs uppercase tracking-widest text-[#2A1506]/40 mb-2">Week-end</p>
                    <h2 className="font-display font-black text-5xl text-[#2A1506]">Samedi</h2>
                    <p className="font-ui text-[#E87040] text-lg font-medium mt-1">Matin ou après-midi</p>
                  </div>
                  <span className="font-display italic text-7xl text-[#2A1506]/5 select-none">S</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {['Petit groupe (6 pers. max)', 'Tous niveaux bienvenus', 'Matériel fourni', 'Cuissons incluses'].map(item => (
                    <li key={item} className="flex items-center gap-2 font-ui text-sm text-[#2A1506]/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E87040] flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <div className="bg-[#2A1506]/5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-ui text-xs text-[#2A1506]/40 uppercase tracking-widest">Tarif (Grand Soleil - 2h30)</p>
                    <p className="font-display font-bold text-2xl text-[#2A1506]">65€ <span className="text-lg font-body font-normal text-[#2A1506]/80 lg:whitespace-nowrap">dégressif</span></p>
                    <div className="font-ui text-xs text-[#2A1506]/60 mt-1">
                      Forfait 5 séances : 350€ <br />
                      Forfait 10 séances : 650€
                    </div>
                  </div>
                  <a href="#planning-samedi" className={btn.orange.replace('px-8 py-3.5', 'px-5 py-2.5')}>Voir les dates →</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PLANNING JEUDI */}
      <section id="planning-jeudi" className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto scroll-mt-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Jeudis soir</h2>
            <span className="font-ui text-xs bg-[#F5D060] text-[#2A1506] px-3 py-1 rounded-lg uppercase tracking-widest">17h – 19h30</span>
            <span className="font-ui text-xs text-[#2A1506]/40 bg-[#2A1506]/5 px-3 py-1 rounded-lg">Mars – Avril 2025</span>
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
            <span className="font-ui text-xs bg-[#E87040] text-[#FBF5E9] px-3 py-1 rounded-lg uppercase tracking-widest">Matin & après-midi</span>
            <span className="font-ui text-xs text-[#2A1506]/40 bg-[#2A1506]/5 px-3 py-1 rounded-lg">Mars – Avril 2025</span>
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

      {/* RÉSERVATION */}
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
              Je confirme ta place par mail ou par téléphone, choisis ce qui te convient.
            </p>
            <div className="inline-flex bg-[#FBF5E9]/10 rounded-xl p-1 mb-8">
              {['mail', 'téléphone'].map(mode => (
                <button key={mode} onClick={() => setContactMode(mode)}
                  className={`font-ui text-sm px-6 py-2.5 rounded-lg transition-all duration-200 capitalize ${contactMode === mode ? 'bg-[#FBF5E9] text-[#2A1506] font-semibold shadow' : 'text-[#FBF5E9]/50 hover:text-[#FBF5E9]'}`}
                >
                  Par {mode}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              {contactMode === 'mail'
                ? <Link to={selectedSession ? `/contact?type=cours&date=${selectedSession}` : '/contact?type=cours'} className={btn.sage}>M'inscrire par mail →</Link>
                : <a href="tel:+33600000000" className={btn.rose}>Appeler Léa →</a>
              }
            </div>
          </div>
        </Reveal>
      </section>

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
