import Reveal from './Reveal'

// Gabarit commun des pages légales (mentions légales, CGV) : titre, date de mise à jour, sections.
export default function PageLegale({ surtitre, titre, miseAJour, children }) {
  return (
    <div className="bg-[#FBF5E9] pt-24 md:pt-28 min-h-screen">
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#D97080] mb-4 inline-flex items-center gap-2">
            <span className="w-6 h-px bg-[#D97080]" /> {surtitre}
          </p>
          <h1 className="font-display font-black leading-[0.95] mb-3 text-[#2A1506]" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}>
            {titre}
          </h1>
          <p className="font-ui text-xs text-[#2A1506]/40 mb-12">Dernière mise à jour : {miseAJour}</p>
        </Reveal>
        <div className="font-ui text-[0.95rem] leading-relaxed text-[#2A1506]/80 flex flex-col gap-10">{children}</div>
      </section>
    </div>
  )
}

export function Section({ titre, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display font-bold text-xl md:text-2xl text-[#2A1506]">{titre}</h2>
      {children}
    </section>
  )
}

// Information que Léa doit compléter avant la mise en ligne : bien visible pour ne pas l'oublier
export function ACompleter({ children }) {
  return <mark className="bg-[#F3D07A]/70 text-[#2A1506] rounded px-1 font-semibold">[À compléter : {children}]</mark>
}
