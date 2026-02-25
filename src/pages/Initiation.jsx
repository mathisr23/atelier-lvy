import { useState } from 'react'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { Cake, Wine, Gem, Building2, Palette, Sparkles, Mail } from 'lucide-react'
import { Asterisk, Squiggle, patterns } from '../components/Deco'
import Reveal from '../components/Reveal'
import imgAtelier1 from '../assets/IMG_4948.JPG'
import imgAtelier2 from '../assets/IMG_4959.JPG'
import imgAtelier3 from '../assets/IMG_4982.JPG'

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
  { jour: 'Mardi', day: 3, date: '3 mars', heure: '19h – 21h30', places: 4, dispo: true },
  { jour: 'Samedi', day: 7, date: '7 mars', heure: '10h – 12h30', places: 6, dispo: true },
  { jour: 'Mardi', day: 10, date: '10 mars', heure: '19h – 21h30', places: 2, dispo: true },
  { jour: 'Samedi', day: 14, date: '14 mars', heure: '14h – 16h30', places: 0, dispo: false },
  { jour: 'Mardi', day: 17, date: '17 mars', heure: '19h – 21h30', places: 5, dispo: true },
  { jour: 'Samedi', day: 21, date: '21 mars', heure: '10h – 12h30', places: 6, dispo: true },
]

// Mars 2026 commence un dimanche → offset 6 (grille Lun–Dim)
const CALENDAR_OFFSET = 6
const DAYS_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function Initiation() {
  useSEO({
    title: 'Initiation à la céramique — Léa',
    description: "Ateliers d'initiation à la céramique : découvrez le tournage et le modelage le temps d'une session.",
  })

  const [selected, setSelected] = useState(null)

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
            Pas besoin d'expérience ou de talent particulier, juste besoin de curiosité et d’une envie de créer quelque chose avec ses mains ! Je m'occupe du reste.
          </p>
        </Reveal>
      </section>

      {/* FORMAT PILLS */}
      <section className="px-6 md:px-16 lg:px-24 pb-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="#domicile" className="group flex items-center gap-4 bg-[#F5D060] text-[#2A1506] border-2 border-[#2A1506] rounded-xl px-4 md:px-8 py-5 shadow-[3px_3px_0px_rgba(42,21,6,0.25)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150">
              <span className="font-display font-black text-3xl">①</span>
              <div>
                <p className="font-ui font-semibold text-base">À domicile</p>
                <p className="font-ui text-xs opacity-60">Vous souhaitez organiser une initiation directement chez vous pour un évènement ? Je viens à vous !</p>
              </div>
              <span className="ml-auto font-ui text-xl">→</span>
            </a>
            <a href="#atelier" className="group flex items-center gap-4 bg-[#F2A0A8] text-[#2A1506] border-2 border-[#2A1506] rounded-xl px-4 md:px-8 py-5 shadow-[3px_3px_0px_rgba(42,21,6,0.25)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150">
              <span className="font-display font-black text-3xl">②</span>
              <div>
                <p className="font-ui font-semibold text-base">Dans mon atelier</p>
                <p className="font-ui text-xs opacity-60">Venez pour une initiation au modelage</p>
              </div>
              <span className="ml-auto font-ui text-xl">→</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* A DOMICILE */}
      <section
        id="domicile"
        className="px-6 md:px-16 lg:px-24 py-24 mt-8 scroll-mt-20 relative overflow-hidden"
        style={{ backgroundColor: '#F5D060', backgroundImage: 'linear-gradient(rgba(42,21,6,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,21,6,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      >
        <Asterisk size={36} color="rgba(42,21,6,0.1)" className="absolute top-10 right-16 rotate-6" />
        <Asterisk size={20} color="rgba(42,21,6,0.08)" className="absolute bottom-12 left-6 -rotate-12" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/50 mb-4">Format ①</p></Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display font-black text-5xl md:text-6xl text-[#2A1506] leading-tight mb-6">
                  Un événement<br /><span className="italic">à domicile</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-body text-[#2A1506]/70 text-lg leading-relaxed mb-8 max-w-md">
                  Je viens animer un atelier de modelage chez vous. 2 heures de création, de rires et de céramique, idéal pour une occasion un peu spéciale. Faites moi part de vos inspirations pour que j’adapte le matériel à vos besoins !
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
                    {['Matériel/Argile/Engobe fournis', "Encadrement tout au long de l'atelier", 'Cuisson des pièces incluse (première cuisson, émaillage + deuxième cuisson)', 'Récupération des créations 1 mois minimum après l’initiation (livraison possible sur devis)'].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[#FBF5E9]/80 font-ui text-sm">
                        <span className="text-[#F5D060] mt-0.5">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-ui text-xs text-[#2A1506]/60 mb-6">Tarif calculé selon le nombre de participants, la durée et les projets souhaités, je t'envoie un devis après contact. Ces initiations peuvent être personnalisées davantage qu’une initiation classique en atelier.</p>
                <Link to="/contact?type=initiation" className={btn.dark}>Faire une demande →</Link>
              </Reveal>
            </div>
            <Reveal direction="left" delay={0.15}>
              <div className="relative h-120 hidden lg:block">
                {/* haut-droite : portrait */}
                <img src={imgAtelier1} alt="Atelier céramique" className="absolute top-0 right-0 w-52 h-64 rotate-3 rounded-2xl object-cover shadow-lg" />
                {/* milieu-gauche : décalée pour ne pas couvrir img1 */}
                <img src={imgAtelier2} alt="Atelier céramique" className="absolute top-16 left-12 w-44 h-56 -rotate-4 rounded-2xl object-cover shadow-lg" />
                {/* bas-droite : séparée d'img1 par une zone libre */}
                <img src={imgAtelier3} alt="Atelier céramique" className="absolute bottom-0 right-6 w-44 h-40 rotate-2 rounded-2xl object-cover shadow-lg" />
                <div className="absolute bottom-6 left-0 bg-[#FBF5E9] rounded-2xl p-4 shadow-lg">
                  <p className="font-display font-bold text-2xl text-[#2A1506]">2 – 12</p>
                  <p className="font-ui text-xs text-[#2A1506]/60">participants</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DANS L'ATELIER */}
      <section
        id="atelier"
        className="px-6 md:px-16 lg:px-24 py-24 scroll-mt-20 relative overflow-hidden"
        style={{ backgroundColor: '#F2A0A8', backgroundImage: 'repeating-linear-gradient(-45deg, rgba(42,21,6,0.05) 0, rgba(42,21,6,0.05) 1px, transparent 0, transparent 50%)', backgroundSize: '14px 14px' }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#2A1506]/50 mb-4">Format ②</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <h2 className="font-display font-black text-5xl md:text-6xl text-[#2A1506] leading-tight flex-shrink-0">
                Dans<br /><span className="italic">mon atelier</span>
              </h2>
              <div className="font-ui text-[#2A1506]/70 text-base leading-relaxed max-w-xl">
                <p className="mb-3">
                  Venez seul·e ou accompagné·e pour découvrir la céramique pendant une initiation au modelage de 2h. Créez une à deux pièces en grès selon la forme, la grandeur et les couleurs que vous souhaitez utiliser. Je vous guide tout au long du processus de création !
                </p>
                <p>
                  Une fois vos créations finies, il faut encore être un peu patient. Le séchage des pièces et les cuissons peuvent prendre du temps. Dès que vos pièces sortent du four, je vous envoie un message pour venir récupérer vos créations (délai d’un mois minimum).
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { num: '1', label: 'Vous réservez un créneau' },
              { num: '2', label: 'Vous créez votre pièce' },
              { num: '3', label: "Je m'occupe de la cuisson" },
              { num: '4', label: 'Vous récupérez votre œuvre' },
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
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="font-display font-bold text-2xl text-[#2A1506]">Créneaux disponibles</h3>
                <div className="flex items-center gap-3">
                  <span className="font-ui text-sm font-semibold bg-[#E87040] text-white px-4 py-1.5 rounded-lg shadow-sm">Initiation 2h = 50€ / pers</span>
                  <span className="font-ui text-xs text-[#2A1506]/50 bg-[#2A1506]/10 px-3 py-1.5 rounded-lg">Mars 2025</span>
                </div>
              </div>
              {/* Calendrier */}
              <div className="mb-6">
                <div className="grid grid-cols-7 mb-1">
                  {DAYS_LABELS.map((d, i) => (
                    <div key={i} className="text-center font-ui text-xs text-[#2A1506]/40 py-2">{d}</div>
                  ))}
                </div>
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
                        onClick={() => c && c.dispo && setSelected(isSel ? null : idx)}
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
                <div>
                  {selected !== null ? (
                    <>
                      <p className="font-ui text-sm text-[#2A1506] font-semibold">
                        {creneaux[selected].jour} {creneaux[selected].date} à {creneaux[selected].heure}
                      </p>
                      <p className="font-ui text-xs text-[#E87040] mt-0.5">
                        {creneaux[selected].places} place{creneaux[selected].places > 1 ? 's' : ''} restante{creneaux[selected].places > 1 ? 's' : ''}
                      </p>
                    </>
                  ) : (
                    <p className="font-ui text-sm text-[#2A1506]/50">Sélectionne un créneau ci-dessus</p>
                  )}
                  <p className="font-ui text-xs text-[#2A1506]/40 mt-1">Un acompte est demandé pour confirmer (Lydia, Vero ou espèces).</p>
                </div>
                <Link
                  to={selected !== null ? `/contact?type=initiation&date=${creneaux[selected].jour} ${creneaux[selected].date}` : '/contact?type=initiation'}
                  className={btn.dark}
                >
                  Réserver ce créneau →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NOTE CONFIRMATION */}
      <section className="px-6 md:px-16 lg:px-24 py-16 max-w-7xl mx-auto">
        <Reveal>
          <div className="bg-[#9BBF90]/20 border border-[#9BBF90]/40 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="text-[#6A9960] bg-[#FBF5E9] p-4 rounded-full shadow-sm">
              <Mail size={40} strokeWidth={1.5} />
            </div>
            <p className="font-ui text-[#2A1506]/70 text-sm leading-relaxed flex-1">
              Pour toute demande ou réservation, je confirme par <strong className="text-[#2A1506]">mail ou par téléphone</strong>, à toi de choisir ce qui te convient le mieux.
            </p>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
