import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { Baby } from 'lucide-react'
import Reveal from '../components/Reveal'
import { supabase } from '../lib/supabase'
import imgPince from '../assets/pince_marron.png'
import imgTablier from '../assets/tablier.png'

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

const packPrices = { 1: '60€', 5: '275€', 10: '500€' }

function SessionCard({ c, selected, onClick, maxReached }) {
  const disabled = !c.dispo || (maxReached && !selected)
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl p-4 text-left transition-all duration-150 border-2 w-full ${
        !c.dispo
          ? 'opacity-40 cursor-not-allowed bg-[#2A1506]/5 border-transparent'
          : disabled
            ? 'opacity-25 cursor-not-allowed bg-[#2A1506]/5 border-transparent'
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

  // [{key: 'Mardi 25 mars', jour: 'Mardi', date: '25 mars', heure: '18h30 – 21h'}]
  const [selectedSessions, setSelectedSessions] = useState([])
  const [nbSeances, setNbSeances] = useState(5)
  const [nbPlaces, setNbPlaces] = useState(1)

  const [dbMardi, setDbMardi] = useState([])
  const [dbJeudi, setDbJeudi] = useState([])
  const [dbSamedi, setDbSamedi] = useState([])
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    supabase
      .from('reservations')
      .select('date_session, nb_places, nb_seances')
      .eq('type', 'cours')
      .eq('status', 'accepted')
      .then(({ data }) => setReservations(data || []))

    supabase
      .from('sessions')
      .select('*')
      .eq('type', 'cours')
      .order('annee').order('mois').order('day')
      .then(({ data }) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const sorted = (data || []).filter(s => new Date(s.annee, s.mois, s.day) >= today)
        setDbMardi(sorted.filter(s => s.jour.toLowerCase() === 'mardi'))
        setDbJeudi(sorted.filter(s => s.jour.toLowerCase() === 'jeudi'))
        setDbSamedi(sorted.filter(s => s.jour.toLowerCase() === 'samedi'))
      })
  }, [])

  // Si on réduit le pack, on retire les séances en trop
  useEffect(() => {
    if (selectedSessions.length > nbSeances) {
      setSelectedSessions(prev => prev.slice(0, nbSeances))
    }
  }, [nbSeances])

  const computePlaces = (baseArray, jourLabel) => {
    return baseArray.map((c) => {
      let reserved = 0
      reservations.forEach(r => {
        if (!r.date_session) return
        let dates = []
        try {
          const parsed = JSON.parse(r.date_session)
          if (Array.isArray(parsed)) {
            dates = parsed
          }
        } catch {
          // Ancien format : "Mardi 25 mars" avec nb_seances consécutives (rétrocompatibilité)
          if (r.date_session.toLowerCase().startsWith(jourLabel.toLowerCase())) {
            const startDate = r.date_session.replace(new RegExp(`^${jourLabel} `, 'i'), '')
            const startIndex = baseArray.findIndex(x => x.date === startDate)
            if (startIndex !== -1) {
              const idx = baseArray.findIndex(x => x.date === c.date)
              if (idx >= startIndex && idx < startIndex + (r.nb_seances || 5)) {
                reserved += r.nb_places || 1
              }
            }
          }
          return
        }
        if (dates.includes(`${jourLabel} ${c.date}`)) {
          reserved += r.nb_places || 1
        }
      })
      const places_restantes = Math.max(0, c.places_total - reserved)
      return { ...c, places: places_restantes, dispo: places_restantes > 0 }
    })
  }

  const coursMardi = computePlaces(dbMardi, 'Mardi')
  const coursJeudi = computePlaces(dbJeudi, 'Jeudi')
  const coursSamedi = computePlaces(dbSamedi, 'Samedi')

  const toggleSession = (jour, session) => {
    const key = `${jour} ${session.date}`
    const exists = selectedSessions.find(s => s.key === key)
    if (exists) {
      setSelectedSessions(prev => prev.filter(s => s.key !== key))
    } else if (selectedSessions.length < nbSeances) {
      setSelectedSessions(prev => [...prev, { key, jour, date: session.date, heure: session.heure }])
    }
  }

  const maxReached = selectedSessions.length >= nbSeances
  const isSelected = (jour, date) => selectedSessions.some(s => s.key === `${jour} ${date}`)

  // Places max = minimum disponible parmi les séances sélectionnées
  const minAvailablePlaces = selectedSessions.length > 0
    ? Math.min(...selectedSessions.map(s => {
        const arr = s.jour === 'Mardi' ? coursMardi : s.jour === 'Jeudi' ? coursJeudi : coursSamedi
        return arr.find(c => c.date === s.date)?.places || 1
      }))
    : 1

  const datesForContact = encodeURIComponent(selectedSessions.map(s => s.key).join(','))
  const ready = selectedSessions.length === nbSeances
  const contactUrl = ready
    ? `/contact?type=cours&dates=${datesForContact}&seances=${nbSeances}&places=${nbPlaces}`
    : '/contact?type=cours'

  return (
    <div className="bg-[#FBF5E9] pt-20">

      {/* HERO */}
      <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
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
          </div>
          <Reveal direction="left" delay={0.15}>
            <div className="relative h-[36rem] hidden lg:block">
              <img src={imgTablier} alt="Tablier de céramiste" className="absolute inset-0 m-auto w-[36rem] h-[36rem] top-72 rotate-12 object-contain mix-blend-multiply contrast-[1.1] pointer-events-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
              <img src={imgPince} alt="Pince de céramiste" className="absolute top-0 -right-20 w-72 h-72 -rotate-60 object-contain mix-blend-multiply contrast-[1.1] pointer-events-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
            </div>
          </Reveal>
        </div>
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
                <div className="font-ui text-[#2A1506]/70 text-base leading-relaxed mb-6 space-y-3">
                  <p>Vous souhaitez aller plus loin dans l'apprentissage du modelage ? Les cours réguliers sont la meilleure solution ! Vous pouvez réaliser des projets plus complexes qui demandent plus de technique et de temps, séance après séance, dans un petit groupe soudé.</p>
                  <p>C'est pourquoi les cours sont proposés en packs de 5 ou 10 séances. Tu peux créer différentes pièces avec plus de liberté dans leurs formats <span className="text-[#2A1506]/50 text-sm">(dans la limite de 10 kg par personne)</span>.</p>
                  <p>Achète ton pack et réserve tes créneaux en fonction des dates disponibles ci-dessous ! L'idéal est de venir 1 fois par semaine (pour pas que ta pièce ne tombe dans l'oubli 😄)</p>
                </div>
                <div className="bg-[#2A1506]/10 rounded-2xl p-5 font-ui text-sm text-[#2A1506]/70 mb-8">
                  <p className="font-semibold text-[#2A1506] mb-2">Inclus :</p>
                  <ul className="space-y-1">
                    <li>• 10 kg maximum de terre par personne</li>
                    <li>• Engobes, outils et matériel fournis</li>
                    <li>• Cuissons + émaillage inclus</li>
                    <li>• Groupe de 4 personnes maximum</li>
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="flex flex-wrap gap-3">
                  {['Petit groupe (4 pers. max)', 'Tous niveaux bienvenus', 'Matériel fourni', 'Cuissons incluses'].map(item => (
                    <span key={item} className="font-ui text-sm bg-[#2A1506]/10 text-[#2A1506] px-4 py-2 rounded-xl">
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Les packs */}
            <div className="flex flex-col gap-4">
              <Reveal delay={0.02}>
                <div className="bg-[#FBF5E9] border-2 border-[#2A1506]/10 rounded-3xl p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-ui text-xs uppercase tracking-widest text-[#2A1506]/40 mb-1">Pour tester</p>
                      <h3 className="font-display font-black text-4xl text-[#2A1506]">1 séance</h3>
                      <p className="font-ui text-[#E87040] text-base font-semibold mt-1">60 €</p>
                    </div>
                    <span className="font-display italic text-6xl text-[#2A1506]/5 select-none leading-none">1</span>
                  </div>
                  <div className="bg-[#2A1506]/5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="font-ui text-sm text-[#2A1506]/60">Idéal pour découvrir les cours avant de s'engager sur un pack.</p>
                    <a href="#choix-pack" className={btn.orange.replace('px-8 py-3.5', 'px-5 py-2.5')}>Choisir →</a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="bg-[#E87040] text-[#2A1506] rounded-3xl p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-ui text-xs uppercase tracking-widest text-[#2A1506]/50 mb-1">Le plus populaire</p>
                      <h3 className="font-display font-black text-4xl">Pack 5 séances</h3>
                      <p className="font-ui text-[#2A1506] text-base font-semibold mt-1">275 € <span className="font-normal text-[#2A1506]/60 text-sm">— 55 €/séance</span></p>
                    </div>
                    <span className="font-display italic text-6xl text-[#2A1506]/10 select-none leading-none">5</span>
                  </div>
                  <div className="bg-[#2A1506]/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="font-ui text-sm text-[#2A1506]/70">5 séances à réserver librement selon les disponibilités.</p>
                    <a href="#choix-pack" className="bg-[#2A1506] text-[#FBF5E9] border-2 border-[#2A1506] font-ui font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#FBF5E9] hover:text-[#2A1506] transition-all duration-200 whitespace-nowrap">
                      Choisir →
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="bg-[#2A1506] text-[#FBF5E9] rounded-3xl p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 mb-1">Meilleure valeur</p>
                      <h3 className="font-display font-black text-4xl">Pack 10 séances</h3>
                      <p className="font-ui text-[#F3D07A] text-base font-semibold mt-1">500 € <span className="font-normal text-[#FBF5E9]/50 text-sm">— 50 €/séance</span></p>
                    </div>
                    <span className="font-display italic text-6xl text-[#FBF5E9]/10 select-none leading-none">10</span>
                  </div>
                  <div className="bg-[#FBF5E9]/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="font-ui text-sm text-[#FBF5E9]/60">10 séances pour s'investir vraiment dans la céramique.</p>
                    <a href="#choix-pack" className="bg-[#F3D07A] text-[#2A1506] border-2 border-[#F3D07A] font-ui font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200 whitespace-nowrap">
                      Choisir →
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CHOIX DU PACK */}
      <section id="choix-pack" className="px-6 md:px-16 lg:px-24 pt-20 pb-4 max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col items-center text-center mb-10">
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#9BBF90] mb-3">Étape 1</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Choisis ton pack</h2>
            <p className="font-ui text-[#2A1506]/50 text-sm">Ensuite, sélectionne exactement {nbSeances} date{nbSeances > 1 ? 's' : ''} dans le planning ci-dessous — tous jours confondus.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 5, 10].map(n => (
              <button
                key={n}
                onClick={() => setNbSeances(n)}
                className={`font-ui font-semibold px-10 py-5 rounded-2xl border-2 transition-all duration-150 flex flex-col items-center min-w-[9rem] ${
                  nbSeances === n
                    ? 'bg-[#2A1506] border-[#2A1506] text-[#FBF5E9]'
                    : 'bg-[#FBF5E9] border-[#2A1506]/15 shadow-[2px_2px_0px_rgba(42,21,6,0.15)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-[#2A1506]'
                }`}
              >
                <span className="text-2xl font-black font-display">{n === 1 ? '1 cours' : `Pack ${n}`}</span>
                <span className={`text-sm font-normal mt-1 ${nbSeances === n ? 'text-[#FBF5E9]/60' : 'text-[#2A1506]/50'}`}>{packPrices[n]}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* COMPTEUR */}
      <div className="px-6 md:px-16 lg:px-24 py-6 max-w-7xl mx-auto">
        <div className={`rounded-2xl px-6 py-4 flex items-center justify-between gap-4 transition-all duration-300 ${
          ready ? 'bg-[#9BBF90]/30 border-2 border-[#9BBF90]' : 'bg-[#2A1506]/5 border-2 border-transparent'
        }`}>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-ui font-semibold text-[#2A1506]">
              Étape 2 — {selectedSessions.length} / {nbSeances} séance{nbSeances > 1 ? 's' : ''} sélectionnée{nbSeances > 1 ? 's' : ''}
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: nbSeances }).map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    i < selectedSessions.length ? 'bg-[#2A1506]' : 'bg-[#2A1506]/20'
                  }`}
                />
              ))}
            </div>
          </div>
          {ready && (
            <p className="font-ui text-sm text-[#2A1506]/70 hidden sm:block">
              ✓ Parfait ! Descends pour confirmer →
            </p>
          )}
        </div>
      </div>

      {/* PLANNING MARDI */}
      <section id="planning-mardi" className="px-6 md:px-16 lg:px-24 py-12 max-w-7xl mx-auto scroll-mt-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Mardis soir</h2>
            <span className="font-ui text-xs bg-[#E87040] text-[#FBF5E9] px-3 py-1 rounded-lg uppercase tracking-widest">18h30 – 21h</span>
            <span className="font-ui text-xs text-[#2A1506]/40 bg-[#2A1506]/5 px-3 py-1 rounded-lg">Mars – Avril 2026</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {coursMardi.length === 0 ? (
            <p className="font-ui text-sm text-[#2A1506]/40 italic">Aucun créneau prévu pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              {coursMardi.map((c, i) => (
                <SessionCard
                  key={c.id || i}
                  c={c}
                  selected={isSelected('Mardi', c.date)}
                  onClick={() => toggleSession('Mardi', c)}
                  maxReached={maxReached}
                />
              ))}
            </div>
          )}
        </Reveal>
      </section>

      {/* PLANNING JEUDI */}
      <section id="planning-jeudi" className="px-6 md:px-16 lg:px-24 py-12 max-w-7xl mx-auto scroll-mt-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Jeudis soir</h2>
            <span className="font-ui text-xs bg-[#F3D07A] text-[#2A1506] px-3 py-1 rounded-lg uppercase tracking-widest">18h30 – 21h</span>
            <span className="font-ui text-xs text-[#2A1506]/40 bg-[#2A1506]/5 px-3 py-1 rounded-lg">Mars – Avril 2026</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {coursJeudi.length === 0 ? (
            <p className="font-ui text-sm text-[#2A1506]/40 italic">Aucun créneau prévu pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              {coursJeudi.map((c, i) => (
                <SessionCard
                  key={c.id || i}
                  c={c}
                  selected={isSelected('Jeudi', c.date)}
                  onClick={() => toggleSession('Jeudi', c)}
                  maxReached={maxReached}
                />
              ))}
            </div>
          )}
        </Reveal>
      </section>

      {/* PLANNING SAMEDI */}
      <section id="planning-samedi" className="px-6 md:px-16 lg:px-24 py-12 max-w-7xl mx-auto scroll-mt-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Samedis</h2>
            <span className="font-ui text-xs bg-[#E87040] text-[#FBF5E9] px-3 py-1 rounded-lg uppercase tracking-widest">10h – 12h30</span>
            <span className="font-ui text-xs text-[#2A1506]/40 bg-[#2A1506]/5 px-3 py-1 rounded-lg">Mars – Avril 2026</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {coursSamedi.length === 0 ? (
            <p className="font-ui text-sm text-[#2A1506]/40 italic">Aucun créneau prévu pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              {coursSamedi.map((c, i) => (
                <SessionCard
                  key={c.id || i}
                  c={c}
                  selected={isSelected('Samedi', c.date)}
                  onClick={() => toggleSession('Samedi', c)}
                  maxReached={maxReached}
                />
              ))}
            </div>
          )}
        </Reveal>
      </section>

      {/* RESERVATION */}
      <section className="px-6 md:px-16 lg:px-24 py-20 relative overflow-hidden" style={{ backgroundColor: '#2A1506', backgroundImage: 'radial-gradient(circle, rgba(251,245,233,0.04) 1px, transparent 1px)', backgroundSize: '6px 6px' }}>
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#FBF5E9]/40 mb-4">Inscription</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[#FBF5E9] mb-8 leading-tight">
              {ready
                ? <><span className="italic text-[#9BBF90]">{nbSeances} séance{nbSeances > 1 ? 's' : ''}</span> choisies ✓</>
                : <>Choisis tes <span className="italic text-[#9BBF90]">séances</span></>
              }
            </h2>

            {selectedSessions.length > 0 && (
              <div className="mb-8">
                <div className="bg-[#FBF5E9]/8 rounded-2xl p-5 mb-6 text-left inline-block w-full max-w-md mx-auto">
                  <p className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 mb-3">Tes dates</p>
                  <ul className="space-y-2">
                    {selectedSessions.map((s, i) => (
                      <li key={s.key} className="flex items-center gap-3">
                        <span className="font-display font-bold text-[#9BBF90] text-sm w-5 text-right">{i + 1}.</span>
                        <span className="font-ui text-[#FBF5E9] text-sm">{s.key}</span>
                        <span className="font-ui text-[#FBF5E9]/40 text-xs ml-auto">{s.heure}</span>
                      </li>
                    ))}
                    {Array.from({ length: nbSeances - selectedSessions.length }).map((_, i) => (
                      <li key={`empty-${i}`} className="flex items-center gap-3">
                        <span className="font-display font-bold text-[#FBF5E9]/20 text-sm w-5 text-right">{selectedSessions.length + i + 1}.</span>
                        <span className="font-ui text-[#FBF5E9]/20 text-sm italic">à sélectionner...</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {ready && (
                  <div className="flex flex-col items-center">
                    <p className="font-ui text-[#FBF5E9]/60 text-sm mb-4">Nombre de personnes :</p>
                    <div className="bg-[#FBF5E9]/10 rounded-2xl p-5 inline-block mb-6">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setNbPlaces(n => Math.max(1, n - 1))} className="w-8 h-8 rounded-lg bg-[#FBF5E9]/10 hover:bg-[#FBF5E9]/20 flex items-center justify-center font-bold text-[#FBF5E9] transition-colors">−</button>
                        <span className="font-display font-bold text-2xl w-10 text-center text-[#FBF5E9]">{nbPlaces}</span>
                        <button onClick={() => setNbPlaces(n => Math.min(Math.min(minAvailablePlaces, 4), n + 1))} className="w-8 h-8 rounded-lg bg-[#FBF5E9]/10 hover:bg-[#FBF5E9]/20 flex items-center justify-center font-bold text-[#FBF5E9] transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!selectedSessions.length && (
              <p className="font-ui text-[#FBF5E9]/40 text-sm mb-10">
                Remonte sélectionner ton pack et tes {nbSeances} date{nbSeances > 1 ? 's' : ''} dans le planning ci-dessus.
              </p>
            )}

            <p className="font-ui text-[#FBF5E9]/50 text-sm mb-10">
              Une fois ta demande effectuée, je te recontacte par mail pour finaliser ton inscription.
            </p>
            <div className="flex justify-center">
              <Link
                to={contactUrl}
                className={`${btn.sage} ${!ready ? 'opacity-50 pointer-events-none' : ''}`}
              >
                M'inscrire par mail →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <FaqSection
        items={[
          { q: "Peut-on commencer sans expérience ?", a: "Oui, les cours sont ouverts à tous les niveaux. Si tu n'as jamais touché l'argile, une initiation avant de prendre un pack est une bonne façon de démarrer." },
          { q: "Que se passe-t-il si je rate une séance ?", a: "Il faut me prévenir en amont pour que je puisse reprogrammer le cours. Dans le cas contraire, si je n'ai pas été prévenue, la séance n'est pas reprogrammable." },
          { q: "Les cuissons sont-elles vraiment incluses ?", a: "Oui, les deux cuissons (biscuit et émaillage) sont comprises dans le prix du pack. Aucun frais supplémentaire." },
          { q: "Peut-on rejoindre un pack en cours de saison ?", a: "Oui ! Tu peux rejoindre le groupe dès qu'une place se libère. Les cours commenceront à partir de cette date et ce pour le nombre de cours choisi." },
          { q: "Combien de temps pour récupérer ses pièces ?", a: "Il faut compter environ 1 mois à partir du moment où ta pièce est finie. La durée d'attente reste assez variable selon la fréquence des fours et le temps de séchage des pièces." },
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
            <Link to="/contact?type=cours" className={btn.outline}>Me contacter si intéressé →</Link>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
