import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { motion, AnimatePresence } from 'framer-motion'
import { Squiggle } from '../components/Deco'
import Reveal from '../components/Reveal'
import { supabase } from '../lib/supabase'
import imgPinceau from '../assets/pinceau_marron.png'
import imgRessort from '../assets/ressort_marron.png'
import imgvase3 from '../assets/vas3.png'

const EDGE_FUNCTION_URL = import.meta.env.VITE_ADMIN_EDGE_FUNCTION_URL

const types = [
  { value: 'commande', label: 'Commande sur mesure' },
  { value: 'initiation', label: 'Initiation' },
  { value: 'cours', label: 'Cours réguliers' },
  { value: 'autre', label: 'Autre' },
]

const inputClass =
  'w-full font-ui text-sm bg-white border-2 border-[#2A1506]/10 focus:border-[#E87040] outline-none rounded-xl px-4 py-3 transition-colors placeholder:text-[#2A1506]/30'

export default function Contact() {
  useSEO({
    title: 'Contact — Léa Céramiste',
    description: "Contactez Léa pour une commande sur mesure, une réservation d'initiation ou des renseignements sur les cours.",
  })

  const [searchParams] = useSearchParams()
  const defaultType = searchParams.get('type') || 'autre'
  const defaultDate = searchParams.get('date') || ''
  const defaultPlaces = searchParams.get('places') || ''
  const defaultSeances = searchParams.get('seances') || ''
  const defaultSessionId = searchParams.get('session_id') || ''

  // Calcul du prix selon le type de réservation
  const prixRecap = (() => {
    if (!defaultDate) return null
    const places = parseInt(defaultPlaces) || 1
    if (defaultType === 'initiation') {
      return { total: places * 50, detail: `${places} pers. × 50 €` }
    }
    if (defaultType === 'cours') {
      const seances = parseInt(defaultSeances)
      if (!seances || seances === 1) return null
      const jourLower = defaultDate.split(' ')[0].toLowerCase()
      const tarifs = jourLower === 'samedi'
        ? { 5: 350, 10: 650 }
        : { 5: 275, 10: 550 }
      const prix = tarifs[seances]
      if (!prix) return null
      return { total: prix * places, detail: `${places > 1 ? `${places} pers. × ` : ''}Pack ${seances} séances${places > 1 ? ` (${prix} €/pers.)` : ''}` }
    }
    return null
  })()

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    type: defaultType,
    date: defaultDate,
    places: defaultPlaces,
    seances: defaultSeances,
    session_id: defaultSessionId,
    message: '',
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.prenom.trim()) e.prenom = 'Ton prénom est requis.'
    if (!form.nom.trim()) e.nom = 'Ton nom est requis.'
    if (!form.email.trim()) {
      e.email = 'Ton email est requis.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Adresse email invalide.'
    }
    if (form.message.trim().length < 10) e.message = 'Le message doit faire au moins 10 caractères.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')

    try {
      const id = crypto.randomUUID()
      const jour = form.date ? form.date.split(' ')[0].toLowerCase() : null
      const { error } = await supabase.from('reservations').insert([{
        id,
        type: form.type,
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim() || null,
        date_session: form.date || null,
        jour,
        nb_seances: form.seances ? parseInt(form.seances) : null,
        nb_places: form.places ? parseInt(form.places) : null,
        session_id: form.session_id || null,
        message: form.message.trim() || null,
      }])

      if (!error) {
        await fetch(EDGE_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationId: id, action: 'notify_admin' }),
        })
      }

      setStatus(error ? 'error' : 'success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-[#FBF5E9] pt-20">

      {/* ─── HERO ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#E87040]/10 blur-3xl pointer-events-none" />
        <img src={imgPinceau} alt="" aria-hidden="true" className="absolute top-8 right-8 w-72 h-72 -rotate-6 object-contain contrast-[1.1] pointer-events-none hidden lg:block" style={{ imageRendering: '-webkit-optimize-contrast' }} />
        <img src={imgRessort} alt="" aria-hidden="true" className="absolute bottom-8 right-16 w-96 h-96 rotate-3 object-contain contrast-[1.1] pointer-events-none hidden lg:block" style={{ imageRendering: '-webkit-optimize-contrast' }} />
        <img src={imgvase3} alt="" aria-hidden="true" className="absolute bottom-30 right-80 w-72 h-72 -rotate-3 object-contain contrast-[1.1] pointer-events-none hidden lg:block" style={{ imageRendering: '-webkit-optimize-contrast' }} />

        <Reveal><p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-4">Contact</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display font-black leading-[0.9] mb-6" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
            On se<br />parle<span className="text-[#E87040]">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <Squiggle width={90} color="#E87040" className="mb-6 opacity-60" />
          <p className="font-ui text-[#2A1506]/60 text-lg max-w-md leading-relaxed">
            Une question, une commande, une envie de créer, je réponds à tout, en général sous 48h.
          </p>
        </Reveal>
      </section>

      {/* ─── FORMULAIRE ─── */}
      <section className="px-6 md:px-16 lg:px-24 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Formulaire */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="bg-[#2A1506] rounded-3xl p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#9BBF90] flex items-center justify-center mb-6">
                      <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                        <path d="M6 14l6 6 10-10" stroke="#2A1506" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="font-display font-bold text-3xl text-[#FBF5E9] mb-3">Message envoyé !</p>
                    <p className="font-ui text-[#FBF5E9]/60 text-sm leading-relaxed max-w-xs">
                      Je te réponds dans les plus brefs délais, généralement sous 48h.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {form.date && (
                      <div className="flex items-start gap-3 bg-[#E87040]/15 border border-[#E87040]/40 rounded-xl px-4 py-3">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="shrink-0 text-[#E87040] mt-0.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <div>
                          <p className="font-ui text-sm text-[#FBF5E9]/80">
                            Créneau sélectionné : <span className="font-semibold text-[#E87040]">{form.date}</span>
                          </p>
                          {form.places && (
                            <p className="font-ui text-xs text-[#FBF5E9]/50 mt-0.5">
                              {form.places} place{form.places > 1 ? 's' : ''} souhaitée{form.places > 1 ? 's' : ''}
                            </p>
                          )}
                          {form.seances && (
                            <p className="font-ui text-xs text-[#FBF5E9]/50 mt-0.5">
                              {form.seances === '1' ? '1 cours' : `Pack ${form.seances} séances`}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-2">Prénom</label>
                        <input
                          value={form.prenom}
                          onChange={set('prenom')}
                          placeholder="Ton prénom"
                          className={`${inputClass} ${errors.prenom ? 'border-rose' : ''}`}
                        />
                        {errors.prenom && <p className="font-ui text-xs text-rose mt-1.5">{errors.prenom}</p>}
                      </div>
                      <div>
                        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-2">Nom</label>
                        <input
                          value={form.nom}
                          onChange={set('nom')}
                          placeholder="Ton nom de famille"
                          className={`${inputClass} ${errors.nom ? 'border-rose' : ''}`}
                        />
                        {errors.nom && <p className="font-ui text-xs text-rose mt-1.5">{errors.nom}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-2">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set('email')}
                          placeholder="ton@email.fr"
                          className={`${inputClass} ${errors.email ? 'border-rose' : ''}`}
                        />
                        {errors.email && <p className="font-ui text-xs text-rose mt-1.5">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={form.telephone}
                          onChange={set('telephone')}
                          placeholder="06 00 00 00 00"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-3">Type de demande</label>
                      <div className="grid grid-cols-2 gap-2">
                        {types.map(({ value, label }) => (
                          <label
                            key={value}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border-2 transition-all duration-150 ${form.type === value
                              ? 'bg-[#E87040] border-[#E87040] text-[#2A1506]'
                              : 'bg-white/5 border-[#FBF5E9]/10 text-[#FBF5E9]/60 hover:border-[#FBF5E9]/30'
                              }`}
                          >
                            <input
                              type="radio"
                              name="type"
                              value={value}
                              checked={form.type === value}
                              onChange={set('type')}
                              className="sr-only"
                            />
                            <span className="font-ui text-sm font-medium">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-ui text-xs uppercase tracking-widest text-[#FBF5E9]/40 block mb-2">Message</label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={set('message')}
                        placeholder="Dis-moi tout..."
                        className={`${inputClass} resize-none ${errors.message ? 'border-rose' : ''}`}
                      />
                      {errors.message && <p className="font-ui text-xs text-rose mt-1.5">{errors.message}</p>}
                    </div>

                    {status === 'error' && (
                      <p className="font-ui text-sm text-rose">
                        Une erreur est survenue. Réessaie ou écris directement à{' '}
                        <a href="mailto:contact.atelierlvy@gmail.com" className="underline">contact.atelierlvy@gmail.com</a>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full font-ui font-semibold text-sm px-8 py-4 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#FBF5E9] hover:border-[#FBF5E9] transition-all duration-200 disabled:opacity-60"
                    >
                      {status === 'loading' ? 'Envoi en cours…' : 'Envoyer le message →'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Infos contact */}
          <Reveal direction="left" delay={0.2} className="lg:col-span-2">
            <div className="space-y-6 pt-2">

              {/* Récap réservation */}
              {prixRecap && (
                <div className="bg-[#2A1506] rounded-2xl p-6">
                  <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#FBF5E9]/40 mb-4">Récap de ta réservation</p>
                  <div className="space-y-3">
                    {defaultDate && (
                      <div className="flex items-start gap-2">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="shrink-0 text-[#E87040] mt-0.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <div>
                          <p className="font-ui text-xs text-[#FBF5E9]/40 uppercase tracking-wider mb-0.5">Créneau</p>
                          <p className="font-ui text-sm font-semibold text-[#FBF5E9]">{defaultDate}</p>
                        </div>
                      </div>
                    )}
                    {defaultPlaces && (
                      <div className="flex items-start gap-2">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="shrink-0 text-[#E87040] mt-0.5">
                          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                          <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <div>
                          <p className="font-ui text-xs text-[#FBF5E9]/40 uppercase tracking-wider mb-0.5">Places</p>
                          <p className="font-ui text-sm font-semibold text-[#FBF5E9]">{defaultPlaces} personne{parseInt(defaultPlaces) > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    )}
                    {defaultSeances && defaultSeances !== '1' && (
                      <div className="flex items-start gap-2">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="shrink-0 text-[#E87040] mt-0.5">
                          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <div>
                          <p className="font-ui text-xs text-[#FBF5E9]/40 uppercase tracking-wider mb-0.5">Pack</p>
                          <p className="font-ui text-sm font-semibold text-[#FBF5E9]">{defaultSeances} séances</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-[#FBF5E9]/10 mt-4 pt-4 flex items-center justify-between">
                    <p className="font-ui text-xs text-[#FBF5E9]/40 uppercase tracking-wider">Total estimé</p>
                    <p className="font-display font-black text-3xl text-[#E87040]">{prixRecap.total} €</p>
                  </div>
                  <p className="font-ui text-xs text-[#FBF5E9]/25 mt-2 leading-relaxed">{prixRecap.detail}</p>
                  <p className="font-ui text-xs text-[#FBF5E9]/20 mt-1 leading-relaxed">Un acompte sera demandé pour confirmer ta réservation.</p>
                </div>
              )}
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#E87040] mb-5">Autres façons de me joindre</p>
                <div className="space-y-4">
                  <a href="mailto:contact.atelierlvy@gmail.com" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#2A1506] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E87040] transition-colors">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-ui text-xs text-[#2A1506]/40 uppercase tracking-widest mb-0.5">Email</p>
                      <p className="font-ui text-sm font-medium text-[#2A1506] group-hover:text-[#E87040] transition-colors">contact.atelierlvy@gmail.com</p>
                    </div>
                  </a>
                  <a href="https://instagram.com/atelier_lvy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#2A1506] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F2A0A8] transition-colors">
                      <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-ui text-xs text-[#2A1506]/40 uppercase tracking-widest mb-0.5">Instagram</p>
                      <p className="font-ui text-sm font-medium text-[#2A1506] group-hover:text-rose transition-colors">@atelier_lvy</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-[#F5D060]/30 border border-[#F5D060]/50 rounded-2xl p-6">
                <p className="font-display font-bold text-xl text-[#2A1506] mb-2">Délai de réponse</p>
                <p className="font-ui text-sm text-[#2A1506]/70 leading-relaxed">
                  Je réponds généralement sous <strong>48h</strong>, souvent plus vite. Pour les demandes urgentes, écris-moi directement sur Instagram.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

    </div>
  )
}
