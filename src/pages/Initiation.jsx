import { useState } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { Cake, Wine, Gem, Building2, Palette, Sparkles, Mail } from 'lucide-react'
import { Asterisk, patterns } from '../components/Deco'
import Reveal from '../components/Reveal'
import illustration1 from '../assets/illustration1.png'
import illustration2 from '../assets/illustration2.png'

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
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-transparent hover:text-[#E87040] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
}

const evenements = [
  { icon: Cake, label: 'Anniversaire' },
  { icon: Wine, label: 'Soirée entre amis' },
  { icon: Gem, label: 'EVJF' },
  { icon: Building2, label: 'Team building' },
  { icon: Palette, label: 'Atelier créatif' },
  { icon: Sparkles, label: 'Autre occasion' },
]

// Mars 2026 — à mettre à jour avec les vrais créneaux
const creneaux = [
  { jour: 'Vendredi', day: 6, date: '6 mars', heure: '18h30 – 20h30', places: 8, dispo: true },
  { jour: 'Samedi', day: 7, date: '7 mars', heure: '14h – 17h', places: 8, dispo: true },
  { jour: 'Vendredi', day: 13, date: '13 mars', heure: '18h30 – 20h30', places: 3, dispo: true },
  { jour: 'Samedi', day: 14, date: '14 mars', heure: '14h – 17h', places: 0, dispo: false },
  { jour: 'Vendredi', day: 20, date: '20 mars', heure: '18h30 – 20h30', places: 5, dispo: true },
  { jour: 'Samedi', day: 21, date: '21 mars', heure: '14h – 17h', places: 8, dispo: true },
]

// Mars 2026 commence un dimanche → offset 6 (grille Lun–Dim)
const CALENDAR_OFFSET = 6
const DAYS_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

export default function Initiation() {
  useSEO({
    title: 'Initiation à la céramique — Léa',
    description: "Ateliers d'initiation à la céramique : découvrez le tournage et le modelage le temps d'une session.",
  })

  const [selected, setSelected] = useState(null)
  const [nbPlaces, setNbPlaces] = useState(1)
  const [currentMonth, setCurrentMonth] = useState(2) // 0-indexé : 2 = Mars
  const [currentYear, setCurrentYear] = useState(2026)

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const isMars2026 = currentMonth === 2 && currentYear === 2026

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

      {/* FORMAT PILLS — atelier en premier, domicile en second */}
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

      {/* DANS L'ATELIER — en premier (rose) */}
      <section
        id="atelier"
        className="px-6 md:px-16 lg:px-24 pt-10 pb-24 mt-8 scroll-mt-20 relative overflow-hidden"
        style={{ backgroundColor: '#F2A0A8', backgroundImage: 'repeating-linear-gradient(-45deg, rgba(42,21,6,0.05) 0, rgba(42,21,6,0.05) 1px, transparent 0, transparent 50%)', backgroundSize: '14px 14px' }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/50 mb-4">Format ①</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
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
                  (8 personnes maximum par session, délai d'un mois minimum après la date de l'initiation avant de récupérer vos œuvres, possibilité de livraison avec des frais supplémentaires)
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { num: '1', label: 'Réservez votre créneau' },
              { num: '2', label: 'Modelez vos pièces' },
              { num: '3', label: 'Décorez les à l\'engobe' },
              { num: '4', label: 'Je m\'occupe de la cuisson et vous préviens dès que vos pièces sont disponibles !' },
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
            <div className="bg-[#FBF5E9] rounded-3xl p-8 md:p-10">

              {/* En-tête avec navigation de mois */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="font-display font-bold text-2xl text-[#2A1506]">Créneaux disponibles</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-ui text-sm font-semibold bg-[#E87040] text-white px-4 py-1.5 rounded-lg shadow-sm">Initiation 2h = 50€ / pers</span>
                  <div className="flex items-center gap-1 bg-[#2A1506]/10 rounded-xl px-3 py-2">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2A1506]/10 transition-colors text-[#2A1506] text-xl font-bold"
                      aria-label="Mois précédent"
                    >‹</button>
                    <span className="font-ui text-sm font-bold text-[#2A1506] min-w-[130px] text-center uppercase tracking-wide">
                      {MONTHS[currentMonth]} {currentYear}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2A1506]/10 transition-colors text-[#2A1506] text-xl font-bold"
                      aria-label="Mois suivant"
                    >›</button>
                  </div>
                </div>
              </div>

              {/* Calendrier */}
              <div className="mb-6">
                <div className="grid grid-cols-7 mb-1">
                  {DAYS_LABELS.map((d, i) => (
                    <div key={i} className="text-center font-ui text-xs text-[#2A1506]/40 py-2">{d}</div>
                  ))}
                </div>
                {isMars2026 ? (
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 42 }, (_, i) => {
                      const day = i - CALENDAR_OFFSET + 1
                      if (day < 1 || day > 31) return <div key={i} />
                      const idx = creneaux.findIndex(c => c.day === day)
                      const c = idx !== -1 ? creneaux[idx] : null
                      const isSel = selected === idx && idx !== -1
                      return (
                        <button
                          key={i}
                          disabled={!c || !c.dispo}
                          onClick={() => { if (c && c.dispo) { setSelected(isSel ? null : idx); setNbPlaces(1) } }}
                          className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-150
                            ${!c ? 'cursor-default' : ''}
                            ${c && !c.dispo ? 'bg-[#2A1506]/10 cursor-not-allowed' : ''}
                            ${c && c.dispo && !isSel ? 'bg-[#E87040]/20 border-2 border-[#E87040] hover:bg-[#E87040] cursor-pointer' : ''}
                            ${isSel ? 'bg-[#2A1506] scale-110 shadow-lg z-10' : ''}
                          `}
                        >
                          <span className={`font-display font-bold text-sm leading-none
                            ${!c ? 'text-[#2A1506]/25' : isSel ? 'text-[#FBF5E9]' : c.dispo ? 'text-[#2A1506]' : 'text-[#2A1506]/40'}`}>
                            {day}
                          </span>
                          {c && (
                            <span className={`text-[0.55rem] leading-none mt-0.5 font-ui font-semibold
                              ${isSel ? 'text-[#F5D060]' : c.dispo ? 'text-[#E87040]' : 'text-[#2A1506]/30'}`}>
                              {c.dispo ? `${c.places}pl` : '✕'}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-[#2A1506]/40 font-ui text-sm italic">
                    Aucun créneau disponible ce mois-ci.
                  </div>
                )}
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#E87040]/20 border border-[#E87040]" />
                    <span className="font-ui text-xs text-[#2A1506]/50">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#2A1506]/10" />
                    <span className="font-ui text-xs text-[#2A1506]/50">Complet</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#2A1506]/10 pt-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                <div className="flex flex-col gap-2">
                  {selected !== null ? (
                    <>
                      <p className="font-ui text-sm text-[#2A1506] font-semibold">
                        {creneaux[selected].jour} {creneaux[selected].date} à {creneaux[selected].heure}
                      </p>
                      <p className="font-ui text-xs text-[#E87040]">
                        {creneaux[selected].places} place{creneaux[selected].places > 1 ? 's' : ''} restante{creneaux[selected].places > 1 ? 's' : ''}
                      </p>
                      {/* Sélecteur de places */}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-ui text-xs text-[#2A1506]/70">Nombre de places :</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setNbPlaces(n => Math.max(1, n - 1))}
                            className="w-7 h-7 rounded-lg bg-[#2A1506]/10 hover:bg-[#2A1506]/20 flex items-center justify-center font-bold text-[#2A1506] transition-colors"
                          >−</button>
                          <span className="font-display font-bold text-xl w-8 text-center text-[#2A1506]">{nbPlaces}</span>
                          <button
                            onClick={() => setNbPlaces(n => Math.min(creneaux[selected].places, n + 1))}
                            className="w-7 h-7 rounded-lg bg-[#2A1506]/10 hover:bg-[#2A1506]/20 flex items-center justify-center font-bold text-[#2A1506] transition-colors"
                          >+</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="font-ui text-sm text-[#2A1506]/50">Sélectionne un créneau ci-dessus</p>
                  )}
                  <p className="font-ui text-xs text-[#2A1506]/40 mt-1">Un acompte est demandé pour confirmer (Lydia, Wero ou espèces). Acompte non remboursable.</p>
                </div>
                <Link
                  to={selected !== null
                    ? `/contact?type=initiation&date=${creneaux[selected].jour} ${creneaux[selected].date} à ${creneaux[selected].heure}&places=${nbPlaces}`
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

      {/* À DOMICILE — en second (jaune) */}
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
                <img src={illustration1} alt="Première cuisson" className="absolute top-0 right-0 w-96 h-96 rotate-3 rounded-2xl object-contain drop-shadow-xl" />
                <img src={illustration2} alt="Émaillage et deuxième cuisson" className="absolute bottom-4 left-0 w-80 h-80 -rotate-4 rounded-2xl object-contain drop-shadow-xl" />
                <div className="absolute bottom-6 right-0 bg-[#FBF5E9] rounded-2xl p-4 shadow-lg">
                  <p className="font-display font-bold text-2xl text-[#2A1506]">2 – 10</p>
                  <p className="font-ui text-xs text-[#2A1506]/60">participants</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        items={[
          { q: "Faut-il avoir de l'expérience ?", a: "Aucune ! Les initiations sont faites pour les débutants, même ceux qui n'ont pas l'habitude des activités manuelles. Tu seras guidé(e) tout au long du cours pour que tu puisses réaliser tes envies." },
          { q: "Qu'est-ce qu'on repart avec ?", a: "Malheureusement pas tout de suite : les pièces ont besoin de temps pour sécher avant de pouvoir passer en première cuisson. Ensuite, je m'occupe de les émailler pour qu'elles puissent être étanches après la deuxième cuisson. Il faut au moins compter 1 mois après la date de l'initiation avant de pouvoir venir les récupérer." },
          { q: "Que faut-il apporter ?", a: "Rien du tout, sauf des vêtements confortables que tu ne crains pas de salir. L'argile, les outils et les tabliers sont fournis." },
          { q: "C'est possible en cadeau ?", a: "Oui, les initiations font des cadeaux très originaux. Contacte-moi pour recevoir un bon cadeau personnalisé à offrir." },
          { q: "Combien de personnes par session ?", a: "8 personnes maximum. Les groupes restent petits pour que chacun avance à son rythme." },
        ]}
      />

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
                <p className="font-display font-bold text-3xl text-[#2A1506] mb-1">70 – 80 €</p>
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
