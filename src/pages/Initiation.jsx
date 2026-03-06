import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { Cake, Wine, Gem, Building2, Palette, Sparkles, Mail } from 'lucide-react'
import { Asterisk } from '../components/Deco'
import Reveal from '../components/Reveal'
import imgOutils from '../assets/outils_marron.png'
import imgTablier2 from '../assets/tablier_2_marron.png'
import { supabase } from '../lib/supabase'

function FaqSection({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto">
      <Reveal>
        <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-3">FAQ</p>
        <h2 className="font-display font-bold text-4xl md:text-5xl mb-10">Questions fréquentes</h2>
      </Reveal>
      <div className="flex flex-col gap-3 max-w-3xl">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left bg-[#FBF5E9] border-2 border-[#2A1506]/10 rounded-2xl px-6 py-5 hover:border-[#E87040]/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-ui font-semibold text-[#2A1506] text-lg">{item.q}</span>
                <span className={`text-[#E87040] text-2xl font-light flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
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
}

const evenements = [
  { icon: Cake, label: 'Anniversaire' },
  { icon: Wine, label: 'Soirée entre amis' },
  { icon: Gem, label: 'EVJF' },
  { icon: Building2, label: 'Team building' },
  { icon: Palette, label: 'Atelier créatif' },
  { icon: Sparkles, label: 'Autre occasion' },
]

const DAYS_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const getOffset = (month, year) => {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()

export default function Initiation() {
  useSEO({
    title: 'Initiation à la céramique — Léa',
    description: "Ateliers d'initiation à la céramique : découvrez le tournage et le modelage le temps d'une session.",
  })

  const now = new Date()
  const [selected, setSelected] = useState(null) // session id
  const [nbPlaces, setNbPlaces] = useState(1)
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [sessions, setSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    setLoadingSessions(true)
    setSelected(null)
    supabase
      .from('sessions')
      .select('*')
      .eq('mois', currentMonth)
      .eq('annee', currentYear)
      .or('type.eq.initiation,type.is.null')
      .order('day', { ascending: true })
      .then(({ data }) => { setSessions(data || []); setLoadingSessions(false) })
  }, [currentMonth, currentYear])

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const selectedSession = sessions.find(s => s.id === selected) || null
  const offset = getOffset(currentMonth, currentYear)
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)

  return (
    <div className="bg-[#FBF5E9] pt-20">

      {/* HERO */}
      <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto">
        <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-4">Initiation</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display font-black leading-[0.9] mb-8" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
            Les mains<br />dans la terre<span className="text-[#9BBF90]">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-ui text-[#2A1506]/60 text-lg max-w-xl leading-relaxed">
            Pas besoin d'expérience ou de talent particulier, juste besoin de curiosité et d'une envie de créer quelque chose avec ses mains ! Je m'occupe du reste.
          </p>
        </Reveal>
      </section>

      {/* FORMAT PILLS */}
      <section className="px-6 md:px-16 lg:px-24 pb-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="#atelier" className="group flex items-center gap-4 bg-[#F2A0A8] text-[#2A1506] border-2 border-[#2A1506] rounded-xl px-4 md:px-8 py-5 shadow-[3px_3px_0px_rgba(42,21,6,0.25)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150">
              <span className="font-display font-black text-3xl">①</span>
              <div>
                <p className="font-ui font-semibold text-base">Dans mon atelier</p>
                <p className="font-ui text-xs opacity-60">Venez pour une initiation au modelage</p>
              </div>
              <span className="ml-auto font-ui text-xl">→</span>
            </a>
            <a href="#domicile" className="group flex items-center gap-4 bg-[#F5D060] text-[#2A1506] border-2 border-[#2A1506] rounded-xl px-4 md:px-8 py-5 shadow-[3px_3px_0px_rgba(42,21,6,0.25)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150">
              <span className="font-display font-black text-3xl">②</span>
              <div>
                <p className="font-ui font-semibold text-base">À domicile</p>
                <p className="font-ui text-xs opacity-60">Vous souhaitez organiser une initiation directement chez vous pour un évènement ? Je viens à vous !</p>
              </div>
              <span className="ml-auto font-ui text-xl">→</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* DANS L'ATELIER */}
      <section
        id="atelier"
        className="px-6 md:px-16 lg:px-24 pt-4 pb-24 mt-4 scroll-mt-20 relative overflow-hidden"
        style={{ backgroundColor: '#F2A0A8', backgroundImage: 'repeating-linear-gradient(-45deg, rgba(42,21,6,0.05) 0, rgba(42,21,6,0.05) 1px, transparent 0, transparent 50%)', backgroundSize: '14px 14px' }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/50 mt-12 mb-4">Format ①</p>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-12 mb-12">
              <h2 className="font-display font-black text-5xl md:text-6xl text-[#2A1506] leading-tight flex-shrink-0">
                Dans<br /><span className="italic">mon atelier</span>
              </h2>
              <div className="font-ui text-[#2A1506]/70 text-base leading-relaxed max-w-xl">
                <p className="mb-3">
                  Venez seul·e ou accompagné·e pour découvrir la céramique pendant une initiation au modelage de 2h. Créez une à deux pièces en grès selon leurs formes et leurs grandeurs, puis, décorez les à l'aide d'engobe coloré ! Je vous guide tout au long du processus pour vous aider à mettre en forme vos idées.
                </p>
                <p className="mb-3">
                  Une fois vos créations finies, il faut encore être un peu patient. Le séchage des pièces et les cuissons peuvent prendre du temps. Dès que vos pièces sortent du four, je vous envoie un message pour venir récupérer vos créations.
                </p>
                <p className="mb-4">
                  Après avoir réservé votre créneau, je reviens vers vous pour confirmer votre inscription en vous demandant de régler un acompte (Lydia, Wero ou espèces).
                </p>
                <p className="text-[#2A1506]/50 text-sm">
                  Acompte non remboursable. Possibilité de replanifier l'initiation si annulation 24h avant la date prévue.
                </p>
                <p className="text-[#2A1506]/40 text-xs mt-2">
                  (6 personnes maximum par session, délai d'un mois minimum après la date de l'initiation avant de récupérer vos œuvres, possibilité de livraison avec des frais supplémentaires)
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { num: '1', label: 'Réservez votre créneau' },
              { num: '2', label: 'Modelez vos pièces' },
              { num: '3', label: "Décorez les à l'engobe" },
              { num: '4', label: "Je m'occupe de la cuisson et vous préviens dès que vos pièces sont disponibles !" },
            ].map(({ num, label }, i) => (
              <Reveal key={num} delay={i * 0.08}>
                <div className="bg-[#FBF5E9]/60 backdrop-blur-sm rounded-2xl p-5 text-center">
                  <p className="font-display font-black text-4xl text-[#D97080] mb-2">{num}</p>
                  <p className="font-ui text-xs text-[#2A1506]/70 leading-snug">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="bg-[#FBF5E9] rounded-3xl p-6 md:p-8">

              {/* Header calendrier */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                <h3 className="font-display font-bold text-2xl text-[#2A1506]">Créneaux disponibles</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-ui text-sm font-semibold bg-[#E87040] text-white px-4 py-1.5 rounded-lg shadow-sm">Initiation 2h = 50€ / pers</span>
                  <div className="flex items-center gap-1 bg-[#2A1506]/10 rounded-xl px-3 py-2">
                    <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#2A1506]/10 transition-colors text-[#2A1506] text-lg font-bold" aria-label="Mois précédent">‹</button>
                    <span className="font-ui text-sm font-bold text-[#2A1506] min-w-[120px] text-center uppercase tracking-wide">
                      {MONTHS[currentMonth]} {currentYear}
                    </span>
                    <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#2A1506]/10 transition-colors text-[#2A1506] text-lg font-bold" aria-label="Mois suivant">›</button>
                  </div>
                </div>
              </div>

              {/* Calendrier compact */}
              <div className="mb-5">
                <div className="grid grid-cols-7 mb-1">
                  {DAYS_LABELS.map((d, i) => (
                    <div key={i} className="text-center font-ui text-xs text-[#2A1506]/40 py-1">{d}</div>
                  ))}
                </div>
                {loadingSessions ? (
                  <div className="h-24 flex items-center justify-center text-[#2A1506]/40 font-ui text-sm italic">Chargement…</div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) => {
                      const day = i - offset + 1
                      if (day < 1 || day > daysInMonth) return <div key={i} className="w-full aspect-square" />
                      const session = sessions.find(s => s.day === day)
                      const isSel = session && selected === session.id
                      const dispo = session && session.places_restantes > 0
                      return (
                        <button
                          key={i}
                          disabled={!session || !dispo}
                          onClick={() => { if (session && dispo) { setSelected(isSel ? null : session.id); setNbPlaces(1) } }}
                          className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-150 text-xs
                            ${!session ? 'cursor-default' : ''}
                            ${session && !dispo ? 'bg-[#2A1506]/10 cursor-not-allowed' : ''}
                            ${session && dispo && !isSel ? 'bg-[#E87040]/20 border border-[#E87040] hover:bg-[#E87040] cursor-pointer' : ''}
                            ${isSel ? 'bg-[#2A1506] scale-110 shadow-md z-10' : ''}
                          `}
                        >
                          <span className={`font-display font-bold text-base md:text-lg leading-none
                            ${!session ? 'text-[#2A1506]/25' : isSel ? 'text-[#FBF5E9]' : dispo ? 'text-[#2A1506]' : 'text-[#2A1506]/35'}`}>
                            {day}
                          </span>
                          {session && (
                            <span className={`text-[0.65rem] md:text-xs leading-none mt-1 font-ui font-semibold
                              ${isSel ? 'text-[#F5D060]' : dispo ? 'text-[#E87040]' : 'text-[#2A1506]/30'}`}>
                              {dispo ? `${session.places_restantes} place${session.places_restantes > 1 ? 's' : ''}` : '✕'}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
                {sessions.length === 0 && !loadingSessions && (
                  <p className="text-center font-ui text-sm text-[#2A1506]/40 italic mt-3">Aucun créneau ce mois-ci.</p>
                )}
                <div className="flex items-center gap-5 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#E87040]/20 border border-[#E87040]" />
                    <span className="font-ui text-xs text-[#2A1506]/50">Disponible</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#2A1506]/10" />
                    <span className="font-ui text-xs text-[#2A1506]/50">Complet</span>
                  </div>
                </div>
              </div>

              {/* Sélection + réservation */}
              <div className="border-t border-[#2A1506]/10 pt-5 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                <div className="flex flex-col gap-2">
                  {selectedSession ? (
                    <>
                      <p className="font-ui text-sm text-[#2A1506] font-semibold">
                        {selectedSession.jour} {selectedSession.date} à {selectedSession.heure}
                      </p>
                      <p className="font-display font-bold text-2xl text-[#E87040]">
                        {selectedSession.places_restantes} place{selectedSession.places_restantes > 1 ? 's' : ''} restante{selectedSession.places_restantes > 1 ? 's' : ''}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-ui text-xs text-[#2A1506]/70">Nombre de places :</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setNbPlaces(n => Math.max(1, n - 1))} className="w-7 h-7 rounded-lg bg-[#2A1506]/10 hover:bg-[#2A1506]/20 flex items-center justify-center font-bold text-[#2A1506] transition-colors">−</button>
                          <span className="font-display font-bold text-xl w-8 text-center text-[#2A1506]">{nbPlaces}</span>
                          <button onClick={() => setNbPlaces(n => Math.min(selectedSession.places_restantes, n + 1))} className="w-7 h-7 rounded-lg bg-[#2A1506]/10 hover:bg-[#2A1506]/20 flex items-center justify-center font-bold text-[#2A1506] transition-colors">+</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="font-ui text-sm text-[#2A1506]/50">Sélectionne un créneau ci-dessus</p>
                  )}
                  <p className="font-ui text-xs text-[#2A1506]/40 mt-1">Un acompte est demandé pour confirmer (Lydia, Wero ou espèces). Acompte non remboursable.</p>
                </div>
                <Link
                  to={selectedSession
                    ? `/contact?type=initiation&date=${selectedSession.jour} ${selectedSession.date} à ${selectedSession.heure}&places=${nbPlaces}&session_id=${selectedSession.id}`
                    : '/contact?type=initiation'}
                  className={btn.dark}
                >
                  Réserver ce créneau →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* À DOMICILE */}
      <section
        id="domicile"
        className="px-6 md:px-16 lg:px-24 py-24 scroll-mt-20 relative overflow-hidden"
        style={{ backgroundColor: '#F5D060', backgroundImage: 'linear-gradient(rgba(42,21,6,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,21,6,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      >
        <Asterisk size={36} color="rgba(42,21,6,0.1)" className="absolute top-10 right-16 rotate-6" />
        <Asterisk size={20} color="rgba(42,21,6,0.08)" className="absolute bottom-12 left-6 -rotate-12" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/50 mb-4">Format ②</p></Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display font-black text-5xl md:text-6xl text-[#2A1506] leading-tight mb-6">
                  Un événement<br /><span className="italic">à domicile</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-body text-[#2A1506]/70 text-lg leading-relaxed mb-8 max-w-md">
                  Je viens animer un atelier de modelage chez vous — 2 heures de modelage, de rires, de créativité et de partage. Idéal pour une occasion un peu spéciale ! Faites moi part de vos inspirations pour que j'adapte le matériel à vos besoins. <em>Frais de déplacement applicables selon la distance.</em>
                </p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {evenements.map(({ icon: Icon, label }) => (
                    <span key={label} className="font-ui text-sm bg-[#2A1506]/10 text-[#2A1506] px-4 py-2 rounded-lg flex items-center gap-2">
                      <Icon size={16} strokeWidth={2} className="text-[#E87040]" /> {label}
                    </span>
                  ))}
                </div>
                <div className="bg-[#2A1506] rounded-3xl p-6 mb-6">
                  <p className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 mb-3">Ce que ça comprend</p>
                  <ul className="space-y-2">
                    {['Matériel/Argile/Engobe fournis', "Encadrement tout au long de l'atelier", 'Cuisson des pièces incluse (première cuisson, émaillage + deuxième cuisson)', "Récupération des créations 1 mois minimum après l'initiation (livraison possible sur devis)"].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[#FBF5E9]/80 font-ui text-sm">
                        <span className="text-[#F5D060] mt-0.5">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-ui text-sm text-[#2A1506]/70 mb-6">
                  Des frais de déplacement s'appliquent selon la distance et le lieu.
                </p>
                <Link to="/contact?type=initiation" className={btn.dark}>Faire une demande →</Link>
              </Reveal>
            </div>
            <Reveal direction="left" delay={0.15}>
              <div className="relative h-[42rem] hidden lg:block">
                <img src={imgTablier2} alt="Tablier de céramiste" className="absolute top-0 right-0 w-96 h-96 rotate-3 object-contain mix-blend-multiply contrast-[1.1]" style={{ imageRendering: '-webkit-optimize-contrast' }} />
                <img src={imgOutils} alt="Outils de céramiste" className="absolute bottom-4 left-0 w-80 h-80 -rotate-2 object-contain mix-blend-multiply contrast-[1.1]" style={{ imageRendering: '-webkit-optimize-contrast' }} />
                <div className="absolute bottom-6 right-0 bg-[#FBF5E9] rounded-2xl p-4 shadow-lg">
                  <p className="font-display font-bold text-2xl text-[#2A1506]">2 – 10</p>
                  <p className="font-ui text-xs text-[#2A1506]/60">participants</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* INITIATION PONCTUELLE */}
      <section className="px-6 md:px-16 lg:px-24 py-16 max-w-7xl mx-auto">
        <Reveal>
          <div className="bg-[#F5D060]/30 border border-[#F5D060]/50 rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <span className="inline-block font-ui text-xs uppercase tracking-widest bg-[#F5D060] text-[#2A1506] px-3 py-1 rounded-lg mb-4">Offre spéciale</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-[#2A1506] mb-3">Initiation parent / enfant</h3>
              <p className="font-ui text-[#2A1506]/60 text-sm leading-relaxed max-w-md mb-4">
                Un moment unique à partager en famille ! Venez créer ensemble pendant 2 heures de modelage, pour les enfants à partir de 3 ans.
              </p>
              <div className="bg-[#FBF5E9] rounded-2xl p-5 inline-block">
                <p className="font-display font-bold text-3xl text-[#2A1506] mb-1">70 €</p>
                <p className="font-ui text-sm text-[#2A1506]/60">pour 1 adulte + 1 enfant (dès 3 ans)</p>
                <p className="font-ui text-sm text-[#E87040] font-semibold mt-2">+ 20 € par enfant supplémentaire</p>
              </div>
            </div>
            <div className="self-center">
              <Link to="/contact?type=initiation" className={btn.dark}>Réserver →</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <FaqSection
        items={[
          { q: "Faut-il avoir de l'expérience ?", a: "Aucune ! Les initiations sont faites pour les débutants, même ceux qui n'ont pas l'habitude des activités manuelles. Tu seras guidé(e) tout au long du cours pour que tu puisses réaliser tes envies." },
          { q: "Qu'est-ce qu'on repart avec ?", a: "Malheureusement pas tout de suite : les pièces ont besoin de temps pour sécher avant de pouvoir passer en première cuisson. Ensuite, je m'occupe de les émailler pour qu'elles puissent être étanches après la deuxième cuisson. Il faut au moins compter 1 mois après la date de l'initiation avant de pouvoir venir les récupérer." },
          { q: "Que faut-il apporter ?", a: "Rien du tout, sauf des vêtements confortables que tu ne crains pas de salir. L'argile, les outils et les tabliers sont fournis." },
          { q: "C'est possible en cadeau ?", a: "Oui, les initiations font des cadeaux très originaux. Contacte-moi pour recevoir un bon cadeau personnalisé à offrir." },
          { q: "Combien de personnes par session ?", a: "6 personnes maximum. Les groupes restent petits pour que chacun avance à son rythme." },
        ]}
      />

      {/* NOTE CONFIRMATION */}
      <section className="px-6 md:px-16 lg:px-24 py-16 max-w-7xl mx-auto">
        <Reveal>
          <div className="bg-[#9BBF90]/20 border border-[#9BBF90]/40 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="text-[#6A9960] bg-[#FBF5E9] p-4 rounded-full shadow-sm">
              <Mail size={40} strokeWidth={1.5} />
            </div>
            <p className="font-ui text-[#2A1506]/70 text-sm leading-relaxed flex-1">
              Pour toute demande ou réservation, je confirme uniquement par <strong className="text-[#2A1506]">mail</strong> à l'adresse{' '}
              <a href="mailto:contact.atelierlvy@gmail.com" className="text-[#2A1506] underline underline-offset-2">contact.atelierlvy@gmail.com</a>
            </p>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
