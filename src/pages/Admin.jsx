import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const EDGE_FUNCTION_URL = import.meta.env.VITE_ADMIN_EDGE_FUNCTION_URL


const JOURS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

const statusConfig = {
  pending: { bg: 'bg-[#F3D07A]', text: 'text-[#2A1506]', label: 'En attente' },
  accepted: { bg: 'bg-[#9BBF90]', text: 'text-[#2A1506]', label: 'Acceptée' },
  refused: { bg: 'bg-[#F2A0A8]', text: 'text-[#2A1506]', label: 'Refusée' },
}
const typeConfig = {
  cours: { bg: 'bg-[#E87040]', text: 'text-white', label: 'Cours' },
  initiation: { bg: 'bg-[#F2A0A8]', text: 'text-[#2A1506]', label: 'Initiation' },
  commande: { bg: 'bg-[#F3D07A]', text: 'text-[#2A1506]', label: 'Commande' },
  autre: { bg: 'bg-[#9BBF90]/60', text: 'text-[#2A1506]', label: 'Autre' },
}

const inp = 'w-full font-ui text-sm bg-[#FBF5E9] border-2 border-[#2A1506]/15 focus:border-[#E87040] outline-none rounded-xl px-4 py-2.5 transition-colors placeholder:text-[#2A1506]/30'
const inpDark = 'w-full font-ui text-sm bg-[#FBF5E9]/10 border-2 border-[#FBF5E9]/10 focus:border-[#E87040] outline-none rounded-xl px-3 py-2.5 text-[#FBF5E9] placeholder:text-[#FBF5E9]/30 transition-colors'

/* ─── LOGIN ─── */
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Identifiants incorrects.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'radial-gradient(ellipse at 30% 60%, #3D2010 0%, #2A1506 70%)' }}>
      <div className="m-auto w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <p className="font-display italic font-bold text-[#E87040] text-4xl">Atelier LVY</p>
          <p className="font-ui text-[#FBF5E9]/30 text-xs uppercase tracking-[0.4em] mt-2">Espace admin</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#FBF5E9] rounded-3xl p-8 space-y-4 shadow-2xl">
          <h1 className="font-display font-bold text-2xl text-[#2A1506] mb-2">Connexion</h1>
          <div>
            <label className="font-ui text-xs uppercase tracking-widest text-[#2A1506]/40 block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inp} placeholder="ton@email.fr" />
          </div>
          <div>
            <label className="font-ui text-xs uppercase tracking-widest text-[#2A1506]/40 block mb-1.5">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inp} placeholder="••••••••" />
          </div>
          {error && <p className="font-ui text-xs text-[#E87040] font-semibold">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] transition-all duration-200 disabled:opacity-60 mt-2">
            {loading ? 'Connexion…' : 'Se connecter →'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ─── CALCUL DU TOTAL ─── */
function computeTotal(r) {
  const places = r.nb_places || 1
  if (r.type === 'initiation') return `${50 * places} €`
  if (r.type === 'cours') {
    const seances = r.nb_seances
    if (!seances || seances === 1) return null
    const packPrice = seances >= 10 ? 500 : 275
    return `${packPrice * places} €`
  }
  return null
}

const emailTypeLabel = {
  initiation: "Confirmation d'initiation",
  cours: 'Confirmation de cours',
  commande: 'Confirmation de commande',
  autre: 'Réponse à la demande',
}

const acceptLabel = {
  initiation: '✓ Confirmer',
  cours: '✓ Confirmer',
  commande: '✓ Accepter',
  autre: '✓ Répondre',
}

/* ─── RESERVATION CARD ─── */
function ReservationCard({ r, sessions, onAction }) {
  const [loading, setLoading] = useState(null)
  const st = statusConfig[r.status] || statusConfig.pending
  const tc = typeConfig[r.type] || typeConfig.autre
  const date = new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  const session = sessions?.find(s => s.id === r.session_id)
  const total = computeTotal(r)

  const handleAction = async (action) => {
    setLoading(action)
    const newStatus = action === 'accept' ? 'accepted' : 'refused'
    await supabase.from('reservations').update({ status: newStatus }).eq('id', r.id)

    if (action === 'accept' && r.session_id && r.nb_places) {
      const { data: sess } = await supabase.from('sessions').select('places_restantes').eq('id', r.session_id).single()
      if (sess) {
        await supabase.from('sessions').update({
          places_restantes: Math.max(0, sess.places_restantes - r.nb_places)
        }).eq('id', r.session_id)
      }
    }

    await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationId: r.id, action, type: r.type }),
    })

    onAction(r.id, newStatus)
    setLoading(null)
  }

  const borderColor = r.status === 'pending' ? 'border-[#F3D07A]' : r.status === 'accepted' ? 'border-[#9BBF90]/60' : 'border-[#F2A0A8]/60'

  return (
    <div className={`bg-white rounded-2xl border-2 ${borderColor} p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-xl text-[#2A1506]">{r.prenom} {r.nom}</p>
          <p className="font-ui text-xs text-[#2A1506]/50 mt-0.5">{r.email}{r.telephone ? ` · ${r.telephone}` : ''}</p>
        </div>
        <span className={`font-ui text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap ${st.bg} ${st.text}`}>{st.label}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className={`font-ui text-xs font-semibold px-2.5 py-1 rounded-lg ${tc.bg} ${tc.text}`}>{tc.label}</span>
        {r.date_session && <span className="font-ui text-xs bg-[#2A1506]/8 text-[#2A1506]/70 px-2.5 py-1 rounded-lg">{r.date_session}</span>}
        {r.nb_places > 0 && (
          <span className="font-ui text-xs bg-[#E87040]/20 text-[#E87040] font-bold px-2.5 py-1 rounded-lg">
            {r.nb_places} place{r.nb_places > 1 ? 's' : ''}
          </span>
        )}
        {r.nb_seances && (
          <span className="font-ui text-xs bg-[#2A1506]/8 text-[#2A1506]/70 px-2.5 py-1 rounded-lg">
            {r.nb_seances === 1 ? '1 cours' : `Pack ${r.nb_seances}`}
          </span>
        )}
      </div>

      {session && (
        <div className="bg-[#F2A0A8]/15 rounded-xl px-3 py-2 font-ui text-xs text-[#2A1506]/70 flex justify-between">
          <span>{session.jour} {session.date} · {session.heure}</span>
          <span className="font-semibold text-[#2A1506]">{session.places_restantes}/{session.places_total} restantes</span>
        </div>
      )}

      {r.message && (
        <p className="font-body text-sm text-[#2A1506]/60 italic leading-relaxed border-l-2 border-[#E87040]/30 pl-3">{r.message}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="font-ui text-xs text-[#2A1506]/25">{date}</p>
        {total && (
          <span className="font-ui text-sm font-bold bg-[#2A1506] text-[#F3D07A] px-3 py-1 rounded-lg">
            Total : {total}
          </span>
        )}
      </div>

      {r.status === 'pending' && (
        <>
          <p className="font-ui text-[0.65rem] text-[#2A1506]/30 text-center -mb-1">
            {emailTypeLabel[r.type] || emailTypeLabel.autre}
          </p>
          <div className="flex gap-2">
            <button onClick={() => handleAction('accept')} disabled={!!loading}
              className="flex-1 font-ui font-bold text-sm py-2.5 rounded-xl bg-[#9BBF90] text-[#2A1506] hover:bg-[#7aab6e] transition-colors disabled:opacity-50">
              {loading === 'accept' ? '…' : (acceptLabel[r.type] || '✓ Accepter')}
            </button>
            <button onClick={() => handleAction('refuse')} disabled={!!loading}
              className="flex-1 font-ui font-bold text-sm py-2.5 rounded-xl bg-[#F2A0A8] text-[#2A1506] hover:bg-[#d97080] hover:text-white transition-colors disabled:opacity-50">
              {loading === 'refuse' ? '…' : '✕ Refuser'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── SESSION CARD ─── */
function SessionCard({ s, onDelete, onEdit, onReservationAdd, onReservationDelete, onArchiveToggle }) {
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [editForm, setEditForm] = useState({ heure: s.heure, places_total: s.places_total })
  const [showDetails, setShowDetails] = useState(false)
  const [detailsReservations, setDetailsReservations] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [addForm, setAddForm] = useState({ prenom: '', nom: '', nb_places: 1 })
  const [addLoading, setAddLoading] = useState(false)
  const pct = s.places_total > 0 ? Math.round((s.places_restantes / s.places_total) * 100) : 0
  const barColor = pct === 0 ? 'bg-[#F2A0A8]' : pct < 50 ? 'bg-[#F3D07A]' : 'bg-[#9BBF90]'
  const isInitiation = s.type === 'initiation' || !s.type

  const handleDelete = async () => {
    if (!confirm(`Supprimer le créneau du ${s.jour} ${s.date} ?`)) return
    setDeleting(true)
    await supabase.from('sessions').delete().eq('id', s.id)
    onDelete(s.id)
  }

  const handleArchive = async () => {
    setArchiving(true)
    const newArchived = !s.archived
    const { data, error } = await supabase.from('sessions')
      .update({ archived: newArchived })
      .eq('id', s.id)
      .select()
      .single()
    if (!error && data) {
      onArchiveToggle(data)
    }
    setArchiving(false)
  }

  const handleSave = async () => {
    if (!editForm.heure.trim()) return
    setSaving(true)
    const newTotal = parseInt(editForm.places_total)
    const diff = newTotal - s.places_total
    const newRestantes = Math.max(0, s.places_restantes + diff)
    const { data, error } = await supabase.from('sessions')
      .update({ heure: editForm.heure.trim(), places_total: newTotal, places_restantes: newRestantes })
      .eq('id', s.id)
      .select()
      .single()
    if (!error && data) {
      onEdit(data)
      setEditing(false)
    }
    setSaving(false)
  }

  const fetchDetails = async () => {
    setLoadingDetails(true)
    if (isInitiation) {
      const { data } = await supabase.from('reservations').select('*').eq('session_id', s.id).order('created_at')
      setDetailsReservations(data || [])
    } else {
      const dateKey = `${s.jour} ${s.date}`
      const { data } = await supabase.from('reservations').select('*').eq('type', 'cours').ilike('date_session', `%${dateKey}%`).order('created_at')
      setDetailsReservations(data || [])
    }
    setLoadingDetails(false)
  }

  const handleToggleDetails = () => {
    if (!showDetails) fetchDetails()
    setShowDetails(v => !v)
  }

  const handleDeleteReservation = async (r) => {
    if (!confirm(`Supprimer la réservation de ${r.prenom} ${r.nom} ?`)) return
    await supabase.from('reservations').delete().eq('id', r.id)
    if (isInitiation && r.status === 'accepted' && r.nb_places) {
      const { data: sess } = await supabase.from('sessions').select('places_restantes, places_total').eq('id', s.id).single()
      if (sess) {
        const newRestantes = Math.min(sess.places_total, sess.places_restantes + r.nb_places)
        await supabase.from('sessions').update({ places_restantes: newRestantes }).eq('id', s.id)
        onEdit({ ...s, places_restantes: newRestantes })
      }
    }
    setDetailsReservations(prev => prev.filter(x => x.id !== r.id))
    onReservationDelete(r.id)
  }

  const handleManualAdd = async (e) => {
    e.preventDefault()
    if (!addForm.prenom.trim()) return
    setAddLoading(true)
    const dateKey = `${s.jour} ${s.date}`
    const newRes = {
      prenom: addForm.prenom.trim(),
      nom: addForm.nom.trim() || '',
      nb_places: addForm.nb_places,
      type: isInitiation ? 'initiation' : 'cours',
      status: 'accepted',
      session_id: isInitiation ? s.id : null,
      date_session: isInitiation ? dateKey : JSON.stringify([dateKey]),
      jour: s.jour.toLowerCase(),
      email: '',
    }
    const { data, error } = await supabase.from('reservations').insert([newRes]).select().single()
    if (!error && data) {
      if (isInitiation) {
        const { data: sess } = await supabase.from('sessions').select('places_restantes, places_total').eq('id', s.id).single()
        if (sess) {
          const newRestantes = Math.max(0, sess.places_restantes - addForm.nb_places)
          await supabase.from('sessions').update({ places_restantes: newRestantes }).eq('id', s.id)
          onEdit({ ...s, places_restantes: newRestantes })
        }
      }
      setDetailsReservations(prev => [...prev, data])
      onReservationAdd(data)
      setAddForm({ prenom: '', nom: '', nb_places: 1 })
    }
    setAddLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#2A1506]/10 p-4 flex flex-col gap-3 hover:border-[#2A1506]/20 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-ui text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${s.type === 'cours' ? 'bg-[#E87040] text-white' : 'bg-[#F2A0A8] text-[#2A1506]'
              }`}>{s.type || 'initiation'}</span>
          </div>
          <p className="font-display font-bold text-lg text-[#2A1506]">{s.jour} {s.date}</p>
          {editing ? (
            <div className="mt-2 flex flex-col gap-2">
              <div>
                <label className="font-ui text-xs text-[#2A1506]/40 uppercase tracking-wider block mb-1">Horaires</label>
                <input
                  type="text"
                  value={editForm.heure}
                  onChange={e => setEditForm(f => ({ ...f, heure: e.target.value }))}
                  placeholder="18h30 – 20h30"
                  className="w-full font-ui text-sm bg-[#FBF5E9] border-2 border-[#E87040]/40 focus:border-[#E87040] outline-none rounded-lg px-3 py-1.5 transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="font-ui text-xs text-[#2A1506]/40 uppercase tracking-wider block mb-1">Places totales</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={editForm.places_total}
                  onChange={e => setEditForm(f => ({ ...f, places_total: parseInt(e.target.value) }))}
                  className="w-full font-ui text-sm bg-[#FBF5E9] border-2 border-[#E87040]/40 focus:border-[#E87040] outline-none rounded-lg px-3 py-1.5 transition-colors"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 font-ui font-bold text-xs py-1.5 rounded-lg bg-[#9BBF90] text-[#2A1506] hover:bg-[#7aab6e] transition-colors disabled:opacity-50">
                  {saving ? '…' : '✓ Enregistrer'}
                </button>
                <button onClick={() => { setEditing(false); setEditForm({ heure: s.heure, places_total: s.places_total }) }}
                  className="flex-1 font-ui font-bold text-xs py-1.5 rounded-lg bg-[#2A1506]/8 text-[#2A1506]/60 hover:bg-[#2A1506]/15 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <p className="font-ui text-sm text-[#E87040] font-medium">{s.heure}</p>
          )}
        </div>
        {!editing && (
          <div className="flex flex-col gap-1 items-end">
            <button onClick={() => setEditing(true)}
              className="font-ui text-xs text-[#2A1506]/30 hover:text-[#E87040] hover:bg-[#E87040]/10 transition-colors px-2 py-1 rounded-lg">
              Modifier
            </button>
            <button onClick={handleArchive} disabled={archiving}
              className="font-ui text-xs text-[#2A1506]/30 hover:text-[#F3D07A] hover:bg-[#F3D07A]/20 transition-colors px-2 py-1 rounded-lg disabled:opacity-40 inline-flex items-center gap-1">
              {archiving ? '…' : s.archived ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M8 5L3 10l5 5M3 10h11a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Restaurer
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M3 6h14v3H3zM4.5 9v7a1 1 0 001 1h9a1 1 0 001-1V9M8 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Archiver
                </>
              )}
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="font-ui text-xs text-[#2A1506]/25 hover:text-[#F2A0A8] hover:bg-[#F2A0A8]/10 transition-colors px-2 py-1 rounded-lg disabled:opacity-40">
              {deleting ? '…' : 'Suppr.'}
            </button>
          </div>
        )}
      </div>
      {!editing && (
        <div>
          <div className="flex justify-between font-ui text-xs mb-1.5">
            <span className="text-[#2A1506]/50">Places restantes</span>
            <span className="font-bold text-[#2A1506]">{s.places_restantes} / {s.places_total}</span>
          </div>
          <div className="h-2 bg-[#2A1506]/8 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
      {!editing && (
        <>
          <button
            onClick={handleToggleDetails}
            className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${showDetails ? 'bg-[#2A1506] border-[#2A1506] text-[#FBF5E9]' : 'bg-white border-[#2A1506]/15 text-[#2A1506]/50 hover:border-[#2A1506]/30 hover:text-[#2A1506]'}`}
          >
            {showDetails ? '▲ Fermer les détails' : '▼ Voir les détails'}
          </button>
          {showDetails && (
            <div className="border-t border-[#2A1506]/10 pt-3 flex flex-col gap-2">
              <p className="font-ui text-xs font-bold uppercase tracking-wider text-[#2A1506]/40">Inscriptions</p>
              {loadingDetails ? (
                <p className="font-ui text-xs text-[#2A1506]/40 italic">Chargement…</p>
              ) : detailsReservations.length === 0 ? (
                <p className="font-ui text-xs text-[#2A1506]/30 italic">Aucune inscription pour ce créneau.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {detailsReservations.map(r => (
                    <div key={r.id} className="flex items-center gap-2 bg-[#FBF5E9] rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <span className="font-ui text-sm font-semibold text-[#2A1506]">{r.prenom} {r.nom}</span>
                        {r.email && <span className="font-ui text-xs text-[#2A1506]/40 ml-2">{r.email}</span>}
                      </div>
                      <span className={`font-ui text-xs font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${statusConfig[r.status]?.bg || 'bg-[#2A1506]/10'} ${statusConfig[r.status]?.text || 'text-[#2A1506]'}`}>
                        {r.nb_places} pl.
                      </span>
                      <button
                        onClick={() => handleDeleteReservation(r)}
                        className="font-ui text-sm text-[#2A1506]/25 hover:text-[#F2A0A8] hover:bg-[#F2A0A8]/10 transition-colors w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0"
                        title="Supprimer cette inscription"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleManualAdd} className="border-t border-[#2A1506]/8 pt-3 flex flex-col gap-2 mt-1">
                <p className="font-ui text-xs text-[#2A1506]/40 uppercase tracking-wider">Ajouter manuellement</p>
                <div className="flex gap-1.5 flex-wrap">
                  <input
                    type="text"
                    placeholder="Prénom *"
                    value={addForm.prenom}
                    onChange={e => setAddForm(f => ({ ...f, prenom: e.target.value }))}
                    required
                    className="flex-1 min-w-[80px] font-ui text-xs bg-[#FBF5E9] border border-[#2A1506]/15 focus:border-[#E87040] outline-none rounded-lg px-2.5 py-1.5 placeholder:text-[#2A1506]/30 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={addForm.nom}
                    onChange={e => setAddForm(f => ({ ...f, nom: e.target.value }))}
                    className="flex-1 min-w-[80px] font-ui text-xs bg-[#FBF5E9] border border-[#2A1506]/15 focus:border-[#E87040] outline-none rounded-lg px-2.5 py-1.5 placeholder:text-[#2A1506]/30 transition-colors"
                  />
                  <input
                    type="number"
                    min={1}
                    max={s.places_total}
                    value={addForm.nb_places}
                    onChange={e => setAddForm(f => ({ ...f, nb_places: parseInt(e.target.value) || 1 }))}
                    className="w-14 font-ui text-xs bg-[#FBF5E9] border border-[#2A1506]/15 focus:border-[#E87040] outline-none rounded-lg px-2 py-1.5 text-center transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={addLoading || !addForm.prenom.trim()}
                    className="font-ui font-bold text-xs px-3 py-1.5 bg-[#9BBF90] text-[#2A1506] rounded-lg hover:bg-[#7aab6e] transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {addLoading ? '…' : '+ Valider'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ─── CUSTOM TYPE SELECTOR ─── */
function TypeSelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const options = [
    { value: 'initiation', label: 'Initiation' },
    { value: 'cours', label: 'Cours rep.' },
  ]
  const current = options.find(o => o.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${inpDark} flex items-center justify-between text-left`}
      >
        <span>{current?.label}</span>
        <svg className={`w-4 h-4 text-[#FBF5E9]/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-[110%] left-0 w-full bg-[#2A1506] border-2 border-[#E87040]/30 rounded-xl overflow-hidden z-20 shadow-2xl flex flex-col">
            {options.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full text-left px-3 py-2.5 font-ui text-sm transition-colors ${o.value === value
                  ? 'bg-[#E87040]/10 text-[#E87040] font-semibold'
                  : 'text-[#FBF5E9]/70 hover:bg-[#FBF5E9]/5 hover:text-[#FBF5E9]'
                  }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── ADD SESSION FORM ─── */
function AddSessionForm({ onAdd }) {
  const [form, setForm] = useState({ date: '', heure: '', places: 6, type: 'initiation' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.date || !form.heure) return
    setLoading(true)
    const d = new Date(form.date + 'T12:00:00')
    const jour = JOURS_FR[d.getDay()]
    const day = d.getDate()
    const mois = d.getMonth()
    const annee = d.getFullYear()
    const dateStr = `${day} ${MONTHS_FR[mois]}`

    const { data, error } = await supabase.from('sessions').insert([{
      jour, day, date: dateStr, mois, annee,
      heure: form.heure,
      places_total: form.places,
      places_restantes: form.places,
      type: form.type,
    }]).select().single()

    if (!error && data) {
      onAdd(data)
      setForm({ date: '', heure: '', places: form.type === 'cours' ? 6 : 8, type: form.type })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#2A1506] rounded-2xl p-5 flex flex-col sm:flex-row gap-3 sm:items-end mb-6">
      <div className="flex-1">
        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Date</label>
        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className={inpDark} />
      </div>
      <div className="flex-1 sm:min-w-[120px]">
        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Type</label>
        <TypeSelector
          value={form.type}
          onChange={val => setForm(f => ({ ...f, type: val, places: val === 'cours' ? 6 : 8 }))}
        />
      </div>
      <div className="flex-1 sm:min-w-[120px]">
        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Horaires</label>
        <input type="text" value={form.heure} onChange={e => setForm(f => ({ ...f, heure: e.target.value }))} placeholder="18h30 – 20h30" required className={inpDark} />
      </div>
      <div className="w-full sm:w-20">
        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Places</label>
        <input type="number" min={1} max={20} value={form.places} onChange={e => setForm(f => ({ ...f, places: parseInt(e.target.value) }))} className={inpDark} />
      </div>
      <button type="submit" disabled={loading}
        className="w-full sm:w-auto font-ui font-bold text-sm px-5 py-2.5 bg-[#E87040] text-[#2A1506] rounded-xl hover:bg-[#FBF5E9] transition-colors disabled:opacity-50 whitespace-nowrap">
        {loading ? '…' : '+ Ajouter'}
      </button>
    </form>
  )
}

/* ─── COMMENTAIRE CARD ─── */
function CommentaireCard({ c, onAction }) {
  const [loading, setLoading] = useState(null)

  const handleAction = async (action) => {
    setLoading(action)
    const newStatut = action === 'approuver' ? 'approuve' : 'refuse'
    await supabase.from('commentaires').update({ statut: newStatut }).eq('id', c.id)
    onAction(c.id, newStatut)
    setLoading(null)
  }

  const statColor = c.statut === 'pending' ? 'bg-[#F3D07A] text-[#2A1506]' : c.statut === 'approuve' ? 'bg-[#9BBF90] text-[#2A1506]' : 'bg-[#F2A0A8] text-[#2A1506]'
  const statLabel = c.statut === 'pending' ? 'En attente' : c.statut === 'approuve' ? 'Approuvé' : 'Refusé'
  const date = new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`bg-white rounded-2xl border-2 p-5 flex flex-col gap-3 ${c.statut === 'pending' ? 'border-[#F3D07A]' : c.statut === 'approuve' ? 'border-[#9BBF90]/60' : 'border-[#F2A0A8]/60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-xl text-[#2A1506]">{c.nom}</p>
          <span className={`inline-block font-ui text-xs font-semibold px-2.5 py-0.5 rounded-lg mt-1 ${c.type === 'initiation' ? 'bg-[#F2A0A8] text-[#2A1506]' : 'bg-[#F3D07A] text-[#2A1506]'}`}>
            {c.type === 'initiation' ? 'Initiation' : 'Création'}
          </span>
        </div>
        <span className={`font-ui text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap ${statColor}`}>{statLabel}</span>
      </div>
      <p className="font-body text-sm text-[#2A1506]/70 italic leading-relaxed border-l-2 border-[#E87040]/30 pl-3">{c.texte}</p>
      <p className="font-ui text-xs text-[#2A1506]/25">{date}</p>
      {c.statut === 'pending' && (
        <div className="flex gap-2">
          <button onClick={() => handleAction('approuver')} disabled={!!loading}
            className="flex-1 font-ui font-bold text-sm py-2.5 rounded-xl bg-[#9BBF90] text-[#2A1506] hover:bg-[#7aab6e] transition-colors disabled:opacity-50">
            {loading === 'approuver' ? '…' : '✓ Approuver'}
          </button>
          <button onClick={() => handleAction('refuser')} disabled={!!loading}
            className="flex-1 font-ui font-bold text-sm py-2.5 rounded-xl bg-[#F2A0A8] text-[#2A1506] hover:bg-[#d97080] hover:text-white transition-colors disabled:opacity-50">
            {loading === 'refuser' ? '…' : '✕ Refuser'}
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── MAIN ─── */
export default function Admin() {
  const [session, setSession] = useState(null)
  const [reservations, setReservations] = useState([])
  const [sessions, setSessions] = useState([])
  const [commentaires, setCommentaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [filterType, setFilterType] = useState('all')
  const [filterSessionType, setFilterSessionType] = useState('all')
  const [activeTab, setActiveTab] = useState('reservations')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    setLoading(true)
    Promise.all([
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('sessions').select('*').order('annee').order('mois').order('day'),
      supabase.from('commentaires').select('*').order('created_at', { ascending: false }),
    ]).then(([resData, sessData, commData]) => {
      setReservations(resData.data || [])
      setSessions(sessData.data || [])
      setCommentaires(commData.data || [])
      setLoading(false)
    })
  }, [session])

  const handleReservationAction = (id, newStatus) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }
  const handleCommentaireAction = (id, newStatut) => {
    setCommentaires(prev => prev.map(c => c.id === id ? { ...c, statut: newStatut } : c))
  }
  const handleSessionAdd = (s) => setSessions(prev => [...prev, s].sort((a, b) => a.annee - b.annee || a.mois - b.mois || a.day - b.day))
  const handleSessionDelete = (id) => setSessions(prev => prev.filter(s => s.id !== id))
  const handleSessionEdit = (updated) => setSessions(prev => prev.map(s => s.id === updated.id ? updated : s))
  const handleSessionArchiveToggle = (updated) => setSessions(prev => prev.map(s => s.id === updated.id ? updated : s))
  const handleReservationAddFromSession = (r) => setReservations(prev => [r, ...prev])
  const handleReservationDeleteFromSession = (id) => setReservations(prev => prev.filter(r => r.id !== id))

  if (!session) return <LoginForm />

  const filtered = reservations
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => filterType === 'all' || r.type === filterType)

  const enhancedSessions = sessions.map(s => {
    if (s.type === 'cours') {
      let reserved = 0
      const dayPrefix = s.jour
      const dateKey = `${s.jour} ${s.date}`
      const sTypeSessions = sessions.filter(x => x.type === 'cours' && x.jour.toLowerCase() === dayPrefix.toLowerCase())
      const currentIndex = sTypeSessions.findIndex(x => x.id === s.id)

      reservations.forEach(r => {
        if (r.type === 'cours' && r.status === 'accepted') {
          if (!r.date_session) return
          // Nouveau format : JSON array ["Mardi 25 mars", ...]
          try {
            const dates = JSON.parse(r.date_session)
            if (Array.isArray(dates)) {
              if (dates.includes(dateKey)) reserved += r.nb_places || 1
              return
            }
          } catch {
            // Ancien format : "Mardi 25 mars" avec séances consécutives
          }
          if (r.date_session.toLowerCase().startsWith(dayPrefix.toLowerCase())) {
            const startDate = r.date_session.replace(new RegExp(`^${dayPrefix} `, 'i'), '')
            const startIndex = sTypeSessions.findIndex(x => x.date === startDate)
            if (startIndex !== -1) {
              const nbSns = r.nb_seances || 5
              if (currentIndex >= startIndex && currentIndex < startIndex + nbSns) {
                reserved += r.nb_places || 1
              }
            }
          }
        }
      })
      return { ...s, places_restantes: Math.max(0, s.places_total - reserved) }
    }
    return s
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPast = (s) => {
    const d = new Date(s.annee, s.mois, s.day)
    return d < today
  }
  const activeSessions = enhancedSessions.filter(s => !s.archived && !isPast(s))
  const archivedSessions = enhancedSessions.filter(s => s.archived)
  const historiqueSessions = enhancedSessions.filter(s => !s.archived && isPast(s))
  const applyTypeFilter = (list) => filterSessionType === 'all' ? list : list.filter(s => (s.type || 'initiation') === filterSessionType)
  const filteredSessions = applyTypeFilter(activeSessions)
  const filteredArchives = applyTypeFilter(archivedSessions)
  const filteredHistorique = applyTypeFilter(historiqueSessions)

  const counts = {
    pending: reservations.filter(r => r.status === 'pending').length,
    accepted: reservations.filter(r => r.status === 'accepted').length,
    refused: reservations.filter(r => r.status === 'refused').length,
  }
  const commentsPending = commentaires.filter(c => c.statut === 'pending').length

  return (
    <div className="min-h-screen bg-[#FBF5E9]">
      <header className="bg-[#2A1506] sticky top-0 z-10">
        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="font-display italic font-bold text-[#E87040] text-xl">Atelier LVY</p>
            <button onClick={() => supabase.auth.signOut()}
              className="font-ui text-xs text-[#FBF5E9]/40 hover:text-[#FBF5E9] transition-colors">
              Déconnexion
            </button>
          </div>
          <nav className="flex border-t border-[#FBF5E9]/5 overflow-x-auto scrollbar-hide">
            {[
              { key: 'reservations', label: counts.pending > 0 ? `Rés. · ${counts.pending}` : 'Rés.' },
              { key: 'sessions', label: `Créneaux · ${activeSessions.length}` },
              { key: 'archives', label: `Archives · ${archivedSessions.length}` },
              { key: 'historique', label: `Historique · ${historiqueSessions.length}` },
              { key: 'commentaires', label: commentsPending > 0 ? `Avis · ${commentsPending}` : 'Avis' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex-1 font-ui text-xs font-semibold px-1 py-3 border-b-2 transition-all text-center ${activeTab === key ? 'text-[#E87040] border-[#E87040]' : 'text-[#FBF5E9]/40 border-transparent'}`}>
                {label}
              </button>
            ))}
          </nav>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex max-w-6xl mx-auto px-10 items-center justify-between">
          <p className="font-display italic font-bold text-[#E87040] text-xl py-4">Atelier LVY</p>
          <nav className="flex items-center gap-0">
            {[
              { key: 'reservations', label: counts.pending > 0 ? `Réservations · ${counts.pending} en attente` : 'Réservations' },
              { key: 'sessions', label: `Créneaux · ${activeSessions.length}` },
              { key: 'archives', label: `Archives · ${archivedSessions.length}` },
              { key: 'historique', label: `Historique · ${historiqueSessions.length}` },
              { key: 'commentaires', label: commentsPending > 0 ? `Avis · ${commentsPending} en attente` : 'Avis' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`font-ui text-sm font-semibold px-5 py-5 border-b-2 transition-all ${activeTab === key ? 'text-[#E87040] border-[#E87040]' : 'text-[#FBF5E9]/40 border-transparent hover:text-[#FBF5E9]/70'}`}>
                {label}
              </button>
            ))}
          </nav>
          <button onClick={() => supabase.auth.signOut()}
            className="font-ui text-xs text-[#FBF5E9]/30 hover:text-[#FBF5E9] transition-colors py-4">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        {loading ? (
          <p className="font-ui text-[#2A1506]/40 text-sm">Chargement…</p>
        ) : activeTab === 'reservations' ? (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { key: 'pending', label: 'En attente', count: counts.pending, color: 'bg-[#F3D07A]' },
                { key: 'accepted', label: 'Acceptées', count: counts.accepted, color: 'bg-[#9BBF90]' },
                { key: 'refused', label: 'Refusées', count: counts.refused, color: 'bg-[#F2A0A8]' },
                { key: 'all', label: 'Toutes', count: reservations.length, color: 'bg-[#2A1506]/15' },
              ].map(({ key, label, count, color }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`font-ui text-sm font-semibold px-4 py-2 rounded-xl border-2 transition-all duration-150 flex items-center gap-2 ${filter === key ? 'bg-[#2A1506] border-[#2A1506] text-[#FBF5E9]' : 'bg-white border-[#2A1506]/10 text-[#2A1506]/70 hover:border-[#2A1506]/25'}`}>
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${filter === key ? 'bg-white/15 text-[#FBF5E9]' : `${color} text-[#2A1506]`}`}>{count}</span>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'Tous types' },
                { key: 'initiation', label: 'Initiation' },
                { key: 'cours', label: 'Cours' },
                { key: 'commande', label: 'Commande' },
                { key: 'autre', label: 'Autre' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilterType(key)}
                  className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${filterType === key ? 'bg-[#E87040] border-[#E87040] text-[#2A1506]' : 'bg-white border-[#2A1506]/10 text-[#2A1506]/50 hover:border-[#2A1506]/25'}`}>
                  {label}
                </button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display italic text-4xl text-[#2A1506]/15">Aucune réservation</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(r => <ReservationCard key={r.id} r={r} sessions={enhancedSessions} onAction={handleReservationAction} />)}
              </div>
            )}
          </>
        ) : activeTab === 'sessions' ? (
          <>
            <div className="mb-5">
              <h2 className="font-display font-bold text-2xl text-[#2A1506]">Gérer les créneaux</h2>
              <p className="font-ui text-sm text-[#2A1506]/50 mt-1">Les créneaux apparaissent automatiquement sur la page Initiation.</p>
            </div>
            <AddSessionForm onAdd={handleSessionAdd} />
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'initiation', label: 'Initiation' },
                { key: 'cours', label: 'Cours' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilterSessionType(key)}
                  className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${filterSessionType === key ? 'bg-[#E87040] border-[#E87040] text-[#2A1506]' : 'bg-white border-[#2A1506]/10 text-[#2A1506]/50 hover:border-[#2A1506]/25'}`}>
                  {label}
                </button>
              ))}
            </div>
            {filteredSessions.length === 0 ? (
              <p className="font-ui text-[#2A1506]/30 text-sm text-center py-12 italic">Aucun créneau pour l'instant.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSessions.map(s => <SessionCard key={s.id} s={s} onDelete={handleSessionDelete} onEdit={handleSessionEdit} onReservationAdd={handleReservationAddFromSession} onReservationDelete={handleReservationDeleteFromSession} onArchiveToggle={handleSessionArchiveToggle} />)}
              </div>
            )}
          </>
        ) : activeTab === 'archives' ? (
          <>
            <div className="mb-5">
              <h2 className="font-display font-bold text-2xl text-[#2A1506]">Créneaux archivés</h2>
              <p className="font-ui text-sm text-[#2A1506]/50 mt-1">Créneaux que vous avez archivés manuellement pour les suivre (qui vient à telle date, etc.). Ils ne sont plus visibles sur le site public.</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'initiation', label: 'Initiation' },
                { key: 'cours', label: 'Cours' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilterSessionType(key)}
                  className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${filterSessionType === key ? 'bg-[#E87040] border-[#E87040] text-[#2A1506]' : 'bg-white border-[#2A1506]/10 text-[#2A1506]/50 hover:border-[#2A1506]/25'}`}>
                  {label}
                </button>
              ))}
            </div>
            {filteredArchives.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display italic text-4xl text-[#2A1506]/15">Aucun créneau archivé</p>
                <p className="font-ui text-sm text-[#2A1506]/40 mt-3">Depuis l'onglet Créneaux, utilisez le bouton « Archiver » pour ranger ici les créneaux à suivre.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArchives.map(s => <SessionCard key={s.id} s={s} onDelete={handleSessionDelete} onEdit={handleSessionEdit} onReservationAdd={handleReservationAddFromSession} onReservationDelete={handleReservationDeleteFromSession} onArchiveToggle={handleSessionArchiveToggle} />)}
              </div>
            )}
          </>
        ) : activeTab === 'historique' ? (
          <>
            <div className="mb-5">
              <h2 className="font-display font-bold text-2xl text-[#2A1506]">Historique des créneaux passés</h2>
              <p className="font-ui text-sm text-[#2A1506]/50 mt-1">Tous les créneaux dont la date est dépassée. Consultez « Voir les détails » pour retrouver qui était inscrit.</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'initiation', label: 'Initiation' },
                { key: 'cours', label: 'Cours' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilterSessionType(key)}
                  className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${filterSessionType === key ? 'bg-[#E87040] border-[#E87040] text-[#2A1506]' : 'bg-white border-[#2A1506]/10 text-[#2A1506]/50 hover:border-[#2A1506]/25'}`}>
                  {label}
                </button>
              ))}
            </div>
            {filteredHistorique.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display italic text-4xl text-[#2A1506]/15">Aucun créneau passé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHistorique.map(s => <SessionCard key={s.id} s={s} onDelete={handleSessionDelete} onEdit={handleSessionEdit} onReservationAdd={handleReservationAddFromSession} onReservationDelete={handleReservationDeleteFromSession} onArchiveToggle={handleSessionArchiveToggle} />)}
              </div>
            )}
          </>
        ) : activeTab === 'commentaires' ? (
          <>
            <div className="mb-5">
              <h2 className="font-display font-bold text-2xl text-[#2A1506]">Modération des avis</h2>
              <p className="font-ui text-sm text-[#2A1506]/50 mt-1">Les avis approuvés sont visibles publiquement sur la page À propos.</p>
            </div>
            {commentaires.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display italic text-4xl text-[#2A1506]/15">Aucun avis</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commentaires.map(c => <CommentaireCard key={c.id} c={c} onAction={handleCommentaireAction} />)}
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
