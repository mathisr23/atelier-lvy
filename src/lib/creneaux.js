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
