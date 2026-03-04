import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { Baby } from 'lucide-react'
import Reveal from '../components/Reveal'
import { supabase } from '../lib/supabase'

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

const packPrices = {
  mardi: { 5: '275€', 10: '550€' },
  jeudi: { 5: '275€', 10: '550€' },
  samedi: { 5: '350€', 10: '650€' },
}

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

  const [selectedMardi, setSelectedMardi] = useState(null)
  const [selectedJeudi, setSelectedJeudi] = useState(null)
  const [selectedSamedi, setSelectedSamedi] = useState(null)
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
        const sorted = data || []
        setDbMardi(sorted.filter(s => s.jour.toLowerCase() === 'mardi'))
        setDbJeudi(sorted.filter(s => s.jour.toLowerCase() === 'jeudi'))
        setDbSamedi(sorted.filter(s => s.jour.toLowerCase() === 'samedi'))
      })
  }, [])

  const computePlaces = (baseArray, dayPrefix) => {
    return baseArray.map((c, i) => {
      let reserved = 0
      reservations.forEach(r => {
        if (r.date_session && r.date_session.toLowerCase().startsWith(dayPrefix.toLowerCase())) {
          const startDate = r.date_session.replace(new RegExp(`^${dayPrefix} `, 'i'), '')
          const startIndex = baseArray.findIndex(x => x.date === startDate)
          if (startIndex !== -1) {
            const numPlaces = r.nb_places || 1
            const nbSns = r.nb_seances || 5
            if (i >= startIndex && i < startIndex + nbSns) {
              reserved += numPlaces
            }
          }
        }
      })
      const places_restantes = Math.max(0, c.places_total - reserved)
      return { ...c, places: places_restantes, dispo: places_restantes > 0 }
    })
  }

  const coursMardi = computePlaces(dbMardi, 'Mardi')
  const coursJeudi = computePlaces(dbJeudi, 'Jeudi')
  const coursSamedi = computePlaces(dbSamedi, 'Samedi')

  const selectedSession =
    selectedMardi !== null ? `Mardi ${coursMardi[selectedMardi].date}`
      : selectedJeudi !== null ? `Jeudi ${coursJeudi[selectedJeudi].date}`
        : selectedSamedi !== null ? `Samedi ${coursSamedi[selectedSamedi].date}`
          : null

  const selectedDay = selectedMardi !== null ? 'mardi' : selectedJeudi !== null ? 'jeudi' : selectedSamedi !== null ? 'samedi' : null
  const selectedObj = selectedMardi !== null ? coursMardi[selectedMardi] : selectedJeudi !== null ? coursJeudi[selectedJeudi] : selectedSamedi !== null ? coursSamedi[selectedSamedi] : null

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
                <div className="font-ui text-[#2A1506]/70 text-base leading-relaxed mb-6 space-y-3">
                  <p>Vous souhaitez aller plus loin dans l'apprentissage du modelage ? Les cours réguliers sont la meilleure solution ! Vous pouvez réaliser des projets plus complexes qui demandent plus de technique et de temps, séance après séance, dans un petit groupe soudé.</p>
                  <p>C'est pourquoi les cours sont proposés en packs de 5 ou 10 séances. Tu peux créer différentes pièces avec plus de liberté dans leurs formats <span className="text-[#2A1506]/50 text-sm">(dans la limite de 10 kg par personne)</span>.</p>
                  <p>Choisis ton créneau, ta présence sera requise à chaque séance après ton inscription !</p>
                </div>
                <div className="bg-[#2A1506]/10 rounded-2xl p-5 font-ui text-sm text-[#2A1506]/70 mb-8">
                  <p className="font-semibold text-[#2A1506] mb-2">Inclus :</p>
                  <ul className="space-y-1">
                    <li>• 10 kg maximum de terre par personne</li>
                    <li>• Engobes, outils et matériel fournis</li>
                    <li>• Cuissons + émaillage inclus</li>
                    <li>• Groupe de 6 personnes maximum</li>
                  </ul>
                </div>
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

            {/* Les créneaux */}
            <div className="flex flex-col gap-4">
              <Reveal delay={0.02}>
                <div className="bg-[#E87040] text-[#2A1506] rounded-3xl p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-ui text-xs uppercase tracking-widest text-[#2A1506]/50 mb-1">En semaine</p>
                      <h3 className="font-display font-black text-4xl">Mardi soir</h3>
                      <p className="font-ui text-[#2A1506] text-base font-medium mt-1">18h30 – 21h</p>
                    </div>
                    <span className="font-display italic text-6xl text-[#2A1506]/10 select-none leading-none">M</span>
                  </div>
                  <div className="bg-[#2A1506]/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="font-ui text-sm text-[#2A1506]/70">
                      <p className="text-[#2A1506] font-semibold mb-1">Pack 5 séances : 275€</p>
                      <p>Pack 10 séances : 550€</p>
                      <p className="text-[#2A1506]/60 text-xs mt-1.5">Je te recontacte par mail pour valider ton inscription.</p>
                    </div>
                    <a href="#planning-mardi" className="bg-[#2A1506] text-[#FBF5E9] border-2 border-[#2A1506] font-ui font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#FBF5E9] hover:text-[#2A1506] transition-all duration-200 whitespace-nowrap">
                      Voir les dates →
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="bg-[#2A1506] text-[#FBF5E9] rounded-3xl p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 mb-1">En semaine</p>
                      <h3 className="font-display font-black text-4xl">Jeudi soir</h3>
                      <p className="font-ui text-[#F5D060] text-base font-medium mt-1">18h30 – 21h</p>
                    </div>
                    <span className="font-display italic text-6xl text-[#FBF5E9]/10 select-none leading-none">J</span>
                  </div>
                  <div className="bg-[#FBF5E9]/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="font-ui text-sm text-[#FBF5E9]/70">
                      <p className="text-[#FBF5E9] font-semibold mb-1">Pack 5 séances : 275€</p>
                      <p>Pack 10 séances : 550€</p>
                      <p className="text-[#F5D060]/80 text-xs mt-1.5">Présence à chaque jeudi requise. Je te recontacte par mail pour valider ton inscription.</p>
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
                      <p className="font-ui text-[#E87040] text-base font-medium mt-1">10h – 12h30</p>
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

      {/* PLANNING MARDI */}
      <section id="planning-mardi" className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto scroll-mt-24">
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
                <SessionCard key={c.id || i} c={c} selected={selectedMardi === i} onClick={() => { setSelectedMardi(selectedMardi === i ? null : i); setSelectedJeudi(null); setSelectedSamedi(null); setNbPlaces(1) }} />
              ))}
            </div>
          )}
        </Reveal>
      </section>

      {/* PLANNING JEUDI */}
      <section id="planning-jeudi" className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto scroll-mt-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Jeudis soir</h2>
            <span className="font-ui text-xs bg-[#F5D060] text-[#2A1506] px-3 py-1 rounded-lg uppercase tracking-widest">18h30 – 21h</span>
            <span className="font-ui text-xs text-[#2A1506]/40 bg-[#2A1506]/5 px-3 py-1 rounded-lg">Mars – Avril 2026</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {coursJeudi.length === 0 ? (
            <p className="font-ui text-sm text-[#2A1506]/40 italic">Aucun créneau prévu pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              {coursJeudi.map((c, i) => (
                <SessionCard key={c.id || i} c={c} selected={selectedJeudi === i} onClick={() => { setSelectedJeudi(selectedJeudi === i ? null : i); setSelectedSamedi(null); setSelectedMardi(null); setNbPlaces(1) }} />
              ))}
            </div>
          )}
        </Reveal>
      </section>

      {/* PLANNING SAMEDI */}
      <section id="planning-samedi" className="px-6 md:px-16 lg:px-24 pb-20 max-w-7xl mx-auto scroll-mt-24">
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
                <SessionCard key={c.id || i} c={c} selected={selectedSamedi === i} onClick={() => { setSelectedSamedi(selectedSamedi === i ? null : i); setSelectedJeudi(null); setSelectedMardi(null); setNbPlaces(1) }} />
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
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[#FBF5E9] mb-4 leading-tight">
              {selectedSession
                ? <>Tu as choisi : <span className="italic text-[#F5D060]">{selectedSession}</span></>
                : <>Choisis une <span className="italic text-[#9BBF90]">date</span></>}
            </h2>

            {selectedSession && (
              <div className="mb-8 flex flex-col items-center">
                <p className="font-ui text-[#FBF5E9]/60 text-sm mb-4">Quel nombre de séances souhaites-tu ?</p>
                <div className="flex justify-center gap-3 mb-8">
                  {[1, 5, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNbSeances(n)}
                      className={`font-ui font-semibold text-sm px-6 py-3 rounded-xl border-2 transition-all duration-150 flex flex-col items-center ${nbSeances === n
                        ? 'bg-[#9BBF90] border-[#9BBF90] text-[#2A1506]'
                        : 'bg-transparent border-[#FBF5E9]/20 text-[#FBF5E9]/60 hover:border-[#FBF5E9]/50'
                        }`}
                    >
                      <span>{n === 1 ? '1 cours' : `Pack ${n}`}</span>
                      {selectedDay && packPrices[selectedDay]?.[n] && (
                        <span className={`text-xs font-normal mt-0.5 ${nbSeances === n ? 'text-[#2A1506]/70' : 'text-[#FBF5E9]/40'}`}>
                          {packPrices[selectedDay][n]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="bg-[#FBF5E9]/10 rounded-2xl p-5 inline-block">
                  <div className="flex items-center gap-4">
                    <span className="font-ui text-sm text-[#FBF5E9]/70">Personnes :</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setNbPlaces(n => Math.max(1, n - 1))} className="w-8 h-8 rounded-lg bg-[#FBF5E9]/10 hover:bg-[#FBF5E9]/20 flex items-center justify-center font-bold text-[#FBF5E9] transition-colors">−</button>
                      <span className="font-display font-bold text-2xl w-10 text-center text-[#FBF5E9]">{nbPlaces}</span>
                      <button onClick={() => setNbPlaces(n => Math.min(selectedObj?.places || 1, n + 1))} className="w-8 h-8 rounded-lg bg-[#FBF5E9]/10 hover:bg-[#FBF5E9]/20 flex items-center justify-center font-bold text-[#FBF5E9] transition-colors">+</button>
                    </div>
                  </div>
                </div>

                <p className="font-ui text-[#FBF5E9]/40 text-xs mt-6 max-w-sm">
                  Tu seras inscrit·e aux séances qui suivent cette date selon le nombre de séances et de places choisis.
                </p>
              </div>
            )}

            <p className="font-ui text-[#FBF5E9]/50 text-sm mb-10">
              Une fois ta demande effectuée, je te recontacte par mail pour finaliser ton inscription.
            </p>
            <div className="flex justify-center">
              <Link to={selectedSession ? `/contact?type=cours&date=${selectedSession}&seances=${nbSeances}&places=${nbPlaces}` : '/contact?type=cours'} className={btn.sage}>M'inscrire par mail →</Link>
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
            <Link to="/contact?type=cours" className={btn.outline}>Me prévenir</Link>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
