import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const EDGE_FUNCTION_URL = import.meta.env.VITE_ADMIN_EDGE_FUNCTION_URL

const JOURS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

const statusConfig = {
  pending: { bg: 'bg-[#F5D060]', text: 'text-[#2A1506]', label: 'En attente' },
  accepted: { bg: 'bg-[#9BBF90]', text: 'text-[#2A1506]', label: 'Acceptée' },
  refused: { bg: 'bg-[#F2A0A8]', text: 'text-[#2A1506]', label: 'Refusée' },
}
const typeConfig = {
  cours: { bg: 'bg-[#E87040]', text: 'text-white', label: 'Cours' },
  initiation: { bg: 'bg-[#F2A0A8]', text: 'text-[#2A1506]', label: 'Initiation' },
  commande: { bg: 'bg-[#F5D060]', text: 'text-[#2A1506]', label: 'Commande' },
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

/* ─── RESERVATION CARD ─── */
function ReservationCard({ r, sessions, onAction }) {
  const [loading, setLoading] = useState(null)
  const st = statusConfig[r.status] || statusConfig.pending
  const tc = typeConfig[r.type] || typeConfig.autre
  const date = new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  const session = sessions?.find(s => s.id === r.session_id)

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
      body: JSON.stringify({ reservationId: r.id, action }),
    })
    onAction(r.id, newStatus)
    setLoading(null)
  }

  const borderColor = r.status === 'pending' ? 'border-[#F5D060]' : r.status === 'accepted' ? 'border-[#9BBF90]/60' : 'border-[#F2A0A8]/60'

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

      <p className="font-ui text-xs text-[#2A1506]/25">{date}</p>

      {r.status === 'pending' && (
        <div className="flex gap-2">
          <button onClick={() => handleAction('accept')} disabled={!!loading}
            className="flex-1 font-ui font-bold text-sm py-2.5 rounded-xl bg-[#9BBF90] text-[#2A1506] hover:bg-[#7aab6e] transition-colors disabled:opacity-50">
            {loading === 'accept' ? '…' : '✓ Accepter'}
          </button>
          <button onClick={() => handleAction('refuse')} disabled={!!loading}
            className="flex-1 font-ui font-bold text-sm py-2.5 rounded-xl bg-[#F2A0A8] text-[#2A1506] hover:bg-[#d97080] hover:text-white transition-colors disabled:opacity-50">
            {loading === 'refuse' ? '…' : '✕ Refuser'}
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── SESSION CARD ─── */
function SessionCard({ s, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const pct = s.places_total > 0 ? Math.round((s.places_restantes / s.places_total) * 100) : 0
  const barColor = pct === 0 ? 'bg-[#F2A0A8]' : pct < 50 ? 'bg-[#F5D060]' : 'bg-[#9BBF90]'

  const handleDelete = async () => {
    if (!confirm(`Supprimer le créneau du ${s.jour} ${s.date} ?`)) return
    setDeleting(true)
    await supabase.from('sessions').delete().eq('id', s.id)
    onDelete(s.id)
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#2A1506]/10 p-4 flex flex-col gap-3 hover:border-[#2A1506]/20 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-ui text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${s.type === 'cours' ? 'bg-[#E87040] text-white' : 'bg-[#F2A0A8] text-[#2A1506]'
              }`}>{s.type || 'initiation'}</span>
          </div>
          <p className="font-display font-bold text-lg text-[#2A1506]">{s.jour} {s.date}</p>
          <p className="font-ui text-sm text-[#E87040] font-medium">{s.heure}</p>
        </div>
        <button onClick={handleDelete} disabled={deleting}
          className="font-ui text-xs text-[#2A1506]/25 hover:text-[#F2A0A8] hover:bg-[#F2A0A8]/10 transition-colors px-2 py-1 rounded-lg disabled:opacity-40">
          {deleting ? '…' : 'Suppr.'}
        </button>
      </div>
      <div>
        <div className="flex justify-between font-ui text-xs mb-1.5">
          <span className="text-[#2A1506]/50">Places restantes</span>
          <span className="font-bold text-[#2A1506]">{s.places_restantes} / {s.places_total}</span>
        </div>
        <div className="h-2 bg-[#2A1506]/8 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
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
    <form onSubmit={handleSubmit} className="bg-[#2A1506] rounded-2xl p-5 flex flex-col sm:flex-row gap-3 items-end mb-6">
      <div className="flex-1">
        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Date</label>
        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className={inpDark} />
      </div>
      <div className="flex-1 min-w-[120px]">
        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Type</label>
        <TypeSelector
          value={form.type}
          onChange={val => setForm(f => ({ ...f, type: val, places: val === 'cours' ? 6 : 8 }))}
        />
      </div>
      <div className="flex-1 min-w-[120px]">
        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Horaires</label>
        <input type="text" value={form.heure} onChange={e => setForm(f => ({ ...f, heure: e.target.value }))} placeholder="18h30 – 20h30" required className={inpDark} />
      </div>
      <div className="w-20">
        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-1.5">Places</label>
        <input type="number" min={1} max={20} value={form.places} onChange={e => setForm(f => ({ ...f, places: parseInt(e.target.value) }))} className={inpDark} />
      </div>
      <button type="submit" disabled={loading}
        className="font-ui font-bold text-sm px-5 py-2.5 bg-[#E87040] text-[#2A1506] rounded-xl hover:bg-[#FBF5E9] transition-colors disabled:opacity-50 whitespace-nowrap">
        {loading ? '…' : '+ Ajouter'}
      </button>
    </form>
  )
}

/* ─── MAIN ─── */
export default function Admin() {
  const [session, setSession] = useState(null)
  const [reservations, setReservations] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
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
    ]).then(([resData, sessData]) => {
      setReservations(resData.data || [])
      setSessions(sessData.data || [])
      setLoading(false)
    })
  }, [session])

  const handleReservationAction = (id, newStatus) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }
  const handleSessionAdd = (s) => setSessions(prev => [...prev, s].sort((a, b) => a.annee - b.annee || a.mois - b.mois || a.day - b.day))
  const handleSessionDelete = (id) => setSessions(prev => prev.filter(s => s.id !== id))

  if (!session) return <LoginForm />

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter)
  const counts = {
    pending: reservations.filter(r => r.status === 'pending').length,
    accepted: reservations.filter(r => r.status === 'accepted').length,
    refused: reservations.filter(r => r.status === 'refused').length,
  }

  return (
    <div className="min-h-screen bg-[#FBF5E9]">
      <header className="bg-[#2A1506] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <p className="font-display italic font-bold text-[#E87040] text-xl py-4">Atelier LVY</p>
          <nav className="flex items-center gap-0">
            {[
              { key: 'reservations', label: counts.pending > 0 ? `Réservations · ${counts.pending} en attente` : 'Réservations' },
              { key: 'sessions', label: `Créneaux · ${sessions.length}` },
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
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'pending', label: 'En attente', count: counts.pending, color: 'bg-[#F5D060]' },
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
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display italic text-4xl text-[#2A1506]/15">Aucune réservation</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(r => <ReservationCard key={r.id} r={r} sessions={sessions} onAction={handleReservationAction} />)}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="font-display font-bold text-2xl text-[#2A1506]">Gérer les créneaux</h2>
              <p className="font-ui text-sm text-[#2A1506]/50 mt-1">Les créneaux apparaissent automatiquement sur la page Initiation.</p>
            </div>
            <AddSessionForm onAdd={handleSessionAdd} />
            {sessions.length === 0 ? (
              <p className="font-ui text-[#2A1506]/30 text-sm text-center py-12 italic">Aucun créneau pour l'instant.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map(s => <SessionCard key={s.id} s={s} onDelete={handleSessionDelete} />)}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
