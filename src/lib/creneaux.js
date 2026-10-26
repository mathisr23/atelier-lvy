// Clés des créneaux de cours, stockées dans reservations.date_session (tableau JSON).
// Deux créneaux peuvent tomber le même jour : l'horaire fait donc partie de la clé.

export const cleCreneau = (jour, s) => `${jour} ${s.date} · ${s.heure}`

// Créneaux de la même date, dans un ordre stable (horaire croissant)
export const creneauxMemeDate = (s, sessions) =>
  sessions
    .filter(x => x.jour?.toLowerCase() === s.jour?.toLowerCase() && x.date === s.date)
    .sort((a, b) => (a.heure || '').localeCompare(b.heure || '', 'fr', { numeric: true }))

// Une entrée de réservation correspond-elle à ce créneau ?
// Les anciennes clés sans horaire (« Jeudi 29 octobre »), ou dont l'horaire a été modifié depuis,
// sont rattachées au premier créneau de la date pour ne pas être comptées deux fois.
export function entreeCorrespond(entree, jour, s, memeDate) {
  const e = entree.trim().toLowerCase()
  if (e === cleCreneau(jour, s).toLowerCase()) return true
  const base = `${jour} ${s.date}`.toLowerCase()
  if (e !== base && !e.startsWith(`${base} · `)) return false
  const exacte = memeDate.some(x => e === cleCreneau(jour, x).toLowerCase())
  return !exacte && memeDate[0]?.id === s.id
}

// Places restantes d'un créneau de cours, d'après les réservations acceptées.
// Calculé dans l'admin (seul à pouvoir lire les réservations) puis écrit dans sessions.places_restantes.
export function placesRestantesCours(s, sessions, reservations) {
  const coursDuJour = sessions.filter(x => x.type === 'cours' && x.jour?.toLowerCase() === s.jour?.toLowerCase())
  const memeDate = creneauxMemeDate(s, coursDuJour)
  const currentIndex = coursDuJour.findIndex(x => x.id === s.id)
  let reserved = 0
  reservations.forEach(r => {
    if (r.type !== 'cours' || r.status !== 'accepted' || !r.date_session) return
    // Format actuel : tableau JSON ["Mardi 25 mars · 18h30 – 21h", ...]
    try {
      const dates = JSON.parse(r.date_session)
      if (Array.isArray(dates)) {
        if (dates.some(d => typeof d === 'string' && entreeCorrespond(d, s.jour, s, memeDate))) reserved += r.nb_places || 1
        return
      }
    } catch {
      // Ancien format : "Mardi 25 mars" avec séances consécutives
    }
    if (r.date_session.toLowerCase().startsWith(s.jour.toLowerCase())) {
      const startDate = r.date_session.replace(new RegExp(`^${s.jour} `, 'i'), '')
      const startIndex = coursDuJour.findIndex(x => x.date === startDate)
      if (startIndex !== -1 && currentIndex >= startIndex && currentIndex < startIndex + (r.nb_seances || 5)) {
        reserved += r.nb_places || 1
      }
    }
  })
  return Math.max(0, s.places_total - reserved)
}
