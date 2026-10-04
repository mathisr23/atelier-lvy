import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { envoyerPhoto, supprimerPhotos, slugifier } from '../../lib/photos'

const inputClass =
  'w-full font-ui text-sm bg-[#FBF5E9] border-2 border-[#2A1506]/15 focus:border-[#E87040] outline-none rounded-xl px-3 py-2.5 transition-colors placeholder:text-[#2A1506]/30'
const labelClass = 'font-ui text-[0.7rem] font-semibold uppercase tracking-wider text-[#2A1506]/50 mb-1.5 block'
const btnPrimaire =
  'font-ui font-bold text-sm px-5 py-2.5 rounded-xl bg-[#E87040] text-[#2A1506] hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-colors disabled:opacity-40'
const btnSecondaire =
  'font-ui font-semibold text-sm px-5 py-2.5 rounded-xl border-2 border-[#2A1506]/15 text-[#2A1506]/70 hover:border-[#2A1506]/40 transition-colors'

const formatPrix = (n) => (n == null ? '—' : `${Number(n).toLocaleString('fr-FR')} €`)

function badgeStock(stock) {
  if (stock === 0) return { texte: 'Épuisé', classe: 'bg-[#F2A0A8] text-[#2A1506]' }
  if (stock === 1) return { texte: 'Pièce unique', classe: 'bg-[#9BBF90]/25 text-[#4F7A45]' }
  return { texte: `${stock} en stock`, classe: 'bg-[#9BBF90]/25 text-[#4F7A45]' }
}

/* ─── ÉDITEUR DE PRODUIT ─── */
function ProduitEditeur({ produit, produits, categories, collections, onFermer, onEnregistre, onSupprime }) {
  const nouveau = !produit
  const [form, setForm] = useState(() => ({
    nom: produit?.nom ?? '',
    prix: produit?.prix ?? '',
    stock: produit?.stock ?? 1,
    poids_g: produit?.poids_g ?? '',
    categorie_id: produit?.categorie_id ?? categories[0]?.id ?? '',
    collection_id: produit?.collection_id ?? '',
    description: produit?.description ?? '',
    visible: produit?.visible ?? true,
  }))
  const [images, setImages] = useState(produit?.images ?? [])
  const [envoiEnCours, setEnvoiEnCours] = useState(0)
  const [enregistrement, setEnregistrement] = useState(false)
  const [erreur, setErreur] = useState(null)
  const dossier = useRef(produit?.id ?? crypto.randomUUID())
  const ajoutees = useRef([]) // photos envoyées pendant cette édition (à nettoyer si on annule)
  const retirees = useRef([]) // photos retirées (supprimées du stockage seulement à l'enregistrement)
  const inputFichiers = useRef(null)

  const set = (champ) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [champ]: v }))
  }

  const ajouterPhotos = async (fichiers) => {
    setErreur(null)
    const liste = [...fichiers]
    setEnvoiEnCours((n) => n + liste.length)
    for (const fichier of liste) {
      try {
        const photo = await envoyerPhoto(fichier, dossier.current)
        ajoutees.current.push(photo)
        setImages((prev) => [...prev, photo])
      } catch (err) {
        console.error(err)
        setErreur(`Impossible d'envoyer « ${fichier.name} ». Essaie avec une photo JPEG ou PNG.`)
      } finally {
        setEnvoiEnCours((n) => n - 1)
      }
    }
  }

  const retirerPhoto = (i) => {
    retirees.current.push(images[i])
    setImages((prev) => prev.filter((_, j) => j !== i))
  }
  const deplacerPhoto = (i, sens) => {
    setImages((prev) => {
      const j = i + sens
      if (j < 0 || j >= prev.length) return prev
      const copie = [...prev]
      ;[copie[i], copie[j]] = [copie[j], copie[i]]
      return copie
    })
  }

  const annuler = async () => {
    // Nettoie les photos envoyées mais jamais enregistrées
    const nonGardees = ajoutees.current.filter((p) => !(produit?.images ?? []).includes(p))
    await supprimerPhotos(nonGardees)
    onFermer()
  }

  const enregistrer = async () => {
    setErreur(null)
    if (!form.nom.trim()) return setErreur('Donne un titre à ta pièce.')
    if (form.visible && images.length === 0) return setErreur('Ajoute au moins une photo pour afficher la pièce dans la boutique.')
    setEnregistrement(true)

    const payload = {
      nom: form.nom.trim(),
      prix: form.prix === '' ? null : Number(form.prix),
      stock: Math.max(0, parseInt(form.stock) || 0),
      poids_g: form.poids_g === '' ? null : parseInt(form.poids_g),
      categorie_id: form.categorie_id || null,
      collection_id: form.collection_id || null,
      description: form.description.trim() || null,
      visible: form.visible,
      images,
      updated_at: new Date().toISOString(),
    }

    let requete
    if (nouveau) {
      // Identifiant unique dans l'URL/panier — calculé une fois, ne change plus si on renomme
      const base = slugifier(payload.nom) || 'piece'
      const pris = new Set(produits.map((p) => p.slug))
      let slug = base
      for (let n = 2; pris.has(slug); n++) slug = `${base}-${n}`
      const ordre = Math.min(0, ...produits.map((p) => p.ordre)) - 1 // les nouveautés en premier
      requete = supabase.from('produits').insert({ ...payload, id: dossier.current, slug, ordre })
    } else {
      requete = supabase.from('produits').update(payload).eq('id', produit.id)
    }
    const { data, error } = await requete.select().single()
    if (error) {
      console.error(error)
      setErreur("L'enregistrement a échoué. Réessaie dans un instant.")
      setEnregistrement(false)
      return
    }
    await supprimerPhotos(retirees.current.filter((p) => !images.includes(p)))
    onEnregistre(data, nouveau)
  }

  const supprimer = async () => {
    if (!window.confirm(`Supprimer définitivement « ${produit.nom} » ? Ses photos seront aussi effacées.`)) return
    setEnregistrement(true)
    const { error } = await supabase.from('produits').delete().eq('id', produit.id)
    if (error) {
      setErreur('La suppression a échoué.')
      setEnregistrement(false)
      return
    }
    await supprimerPhotos([...images, ...retirees.current])
    onSupprime(produit.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-0 md:p-6 overflow-y-auto"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white w-full max-w-4xl md:rounded-3xl p-5 md:p-8 min-h-screen md:min-h-0"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-[#2A1506]">{nouveau ? 'Nouvelle pièce' : 'Modifier la pièce'}</h2>
          <button onClick={annuler} className="w-9 h-9 rounded-full bg-[#2A1506]/10 hover:bg-[#2A1506]/20 flex items-center justify-center" aria-label="Fermer">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="#2A1506" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 md:gap-8">
          {/* Photos */}
          <div>
            <span className={labelClass}>Photos {images.length > 0 && <span className="normal-case tracking-normal font-normal">— la première est la photo principale</span>}</span>
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, i) => (
                <div key={img.thumb} className={`relative group rounded-xl overflow-hidden bg-[#FBF5E9] ${i === 0 ? 'col-span-2 aspect-[4/5]' : 'aspect-square'}`}>
                  <img src={img.thumb} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute top-2 left-2 font-ui text-[0.6rem] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-[#2A1506] text-[#FBF5E9]">Principale</span>}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {i > 0 && <button onClick={() => deplacerPhoto(i, -1)} className="w-7 h-7 rounded-lg bg-white/90 font-ui text-xs hover:bg-white" title="Avancer">←</button>}
                    {i < images.length - 1 && <button onClick={() => deplacerPhoto(i, 1)} className="w-7 h-7 rounded-lg bg-white/90 font-ui text-xs hover:bg-white" title="Reculer">→</button>}
                    <button onClick={() => retirerPhoto(i)} className="w-7 h-7 rounded-lg bg-white/90 font-ui text-xs text-[#D97080] hover:bg-[#F2A0A8] hover:text-[#2A1506]" title="Retirer">✕</button>
                  </div>
                </div>
              ))}
              {Array.from({ length: envoiEnCours }).map((_, i) => (
                <div key={`envoi-${i}`} className={`rounded-xl bg-[#FBF5E9] animate-pulse flex items-center justify-center ${images.length === 0 && i === 0 ? 'col-span-2 aspect-[4/5]' : 'aspect-square'}`}>
                  <span className="font-ui text-xs text-[#2A1506]/40">Envoi…</span>
                </div>
              ))}
              <button
                onClick={() => inputFichiers.current?.click()}
                className={`rounded-xl border-2 border-dashed border-[#2A1506]/20 hover:border-[#E87040] hover:bg-[#E87040]/5 transition-colors flex flex-col items-center justify-center gap-1 text-[#2A1506]/50 ${images.length === 0 && envoiEnCours === 0 ? 'col-span-2 aspect-[4/5]' : 'aspect-square'}`}
              >
                <span className="text-2xl leading-none">+</span>
                <span className="font-ui text-xs font-semibold">Ajouter des photos</span>
              </button>
            </div>
            <input
              ref={inputFichiers}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { ajouterPhotos(e.target.files); e.target.value = '' }}
            />
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass} htmlFor="p-nom">Titre</label>
              <input id="p-nom" className={inputClass} value={form.nom} onChange={set('nom')} placeholder="Ex. Tasse Corail" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass} htmlFor="p-prix">Prix</label>
                <div className="relative">
                  <input id="p-prix" type="number" min="0" step="0.5" className={`${inputClass} pr-7`} value={form.prix} onChange={set('prix')} placeholder="—" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-ui text-xs text-[#2A1506]/40 pointer-events-none">€</span>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="p-stock">Stock</label>
                <input id="p-stock" type="number" min="0" step="1" className={inputClass} value={form.stock} onChange={set('stock')} />
              </div>
              <div>
                <label className={labelClass} htmlFor="p-poids">Poids</label>
                <div className="relative">
                  <input id="p-poids" type="number" min="0" step="10" className={`${inputClass} pr-7`} value={form.poids_g} onChange={set('poids_g')} placeholder="—" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-ui text-xs text-[#2A1506]/40 pointer-events-none">g</span>
                </div>
              </div>
            </div>
            <p className="font-ui text-xs text-[#2A1506]/40 -mt-2">Stock : 1 pour une pièce unique. Il baisse tout seul à chaque vente ; à 0 la pièce s'affiche « Vendue ».</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="p-cat">Catégorie</label>
                <select id="p-cat" className={inputClass} value={form.categorie_id} onChange={set('categorie_id')}>
                  <option value="">— Aucune —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="p-coll">Collection</label>
                <select id="p-coll" className={inputClass} value={form.collection_id} onChange={set('collection_id')}>
                  <option value="">— Aucune —</option>
                  {collections.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="p-desc">Description</label>
              <textarea id="p-desc" rows={5} className={`${inputClass} resize-none`} value={form.description} onChange={set('description')} placeholder="La terre, l'émail, la cuisson, les dimensions…" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={form.visible} onChange={set('visible')} className="w-5 h-5 accent-[#E87040]" />
              <span className="font-ui text-sm text-[#2A1506]">Visible dans la boutique <span className="text-[#2A1506]/40">(décocher = brouillon)</span></span>
            </label>

            {erreur && <p className="font-ui text-sm text-[#D97080]">{erreur}</p>}

            <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
              <button onClick={enregistrer} disabled={enregistrement || envoiEnCours > 0} className={btnPrimaire}>
                {enregistrement ? 'Enregistrement…' : envoiEnCours > 0 ? 'Photos en cours d’envoi…' : 'Enregistrer'}
              </button>
              <button onClick={annuler} className={btnSecondaire}>Annuler</button>
              {!nouveau && (
                <button onClick={supprimer} disabled={enregistrement} className="ml-auto font-ui text-xs font-semibold text-[#D97080] hover:underline">
                  Supprimer la pièce
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── CATÉGORIES / COLLECTIONS ─── */
function ListeTaxonomie({ table, titre, aide, items, onChange }) {
  const [nouveau, setNouveau] = useState('')
  const [brouillons, setBrouillons] = useState({})

  const valeur = (item, champ) => brouillons[item.id]?.[champ] ?? item[champ]
  const modifier = (item, champ, v) => setBrouillons((b) => ({ ...b, [item.id]: { ...b[item.id], [champ]: v } }))

  const enregistrer = async (item) => {
    const maj = brouillons[item.id]
    if (!maj) return
    const { data, error } = await supabase.from(table).update(maj).eq('id', item.id).select().single()
    if (!error) {
      onChange(items.map((i) => (i.id === item.id ? data : i)))
      setBrouillons((b) => {
        const reste = { ...b }
        delete reste[item.id]
        return reste
      })
    }
  }

  const ajouter = async () => {
    const label = nouveau.trim()
    if (!label) return
    const base = slugifier(label) || table
    let slug = base
    for (let n = 2; items.some((i) => i.slug === slug); n++) slug = `${base}-${n}`
    const ordre = Math.max(-1, ...items.map((i) => i.ordre)) + 1
    const { data, error } = await supabase.from(table).insert({ label, slug, ordre }).select().single()
    if (!error) {
      onChange([...items, data])
      setNouveau('')
    }
  }

  const supprimer = async (item) => {
    if (!window.confirm(`Supprimer « ${item.label} » ? Les pièces concernées ne seront pas supprimées, elles n'auront juste plus de ${titre === 'Catégories' ? 'catégorie' : 'collection'}.`)) return
    const { error } = await supabase.from(table).delete().eq('id', item.id)
    if (!error) onChange(items.filter((i) => i.id !== item.id))
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#2A1506]/10 p-5">
      <h3 className="font-display font-bold text-xl text-[#2A1506]">{titre}</h3>
      <p className="font-ui text-xs text-[#2A1506]/50 mt-1 mb-4">{aide}</p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="color"
              value={valeur(item, 'couleur')}
              onChange={(e) => modifier(item, 'couleur', e.target.value)}
              className="w-9 h-9 rounded-lg border-2 border-[#2A1506]/10 cursor-pointer shrink-0 p-0.5"
              title="Couleur"
            />
            <input
              value={valeur(item, 'label')}
              onChange={(e) => modifier(item, 'label', e.target.value)}
              className={`${inputClass} py-2`}
            />
            {brouillons[item.id] ? (
              <button onClick={() => enregistrer(item)} className="font-ui font-bold text-xs px-3 py-2 rounded-lg bg-[#9BBF90] text-[#2A1506] hover:bg-[#7aab6e] shrink-0">OK</button>
            ) : (
              <button onClick={() => supprimer(item)} className="font-ui text-xs text-[#2A1506]/30 hover:text-[#D97080] px-2 shrink-0" title="Supprimer">✕</button>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2">
          <input
            value={nouveau}
            onChange={(e) => setNouveau(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ajouter()}
            placeholder={`Nouvelle ${titre === 'Catégories' ? 'catégorie' : 'collection'}…`}
            className={`${inputClass} py-2`}
          />
          <button onClick={ajouter} disabled={!nouveau.trim()} className="font-ui font-bold text-xs px-3 py-2 rounded-lg bg-[#E87040] text-[#2A1506] disabled:opacity-40 shrink-0">Ajouter</button>
        </div>
      </div>
    </div>
  )
}

/* ─── ONGLET PRODUITS ─── */
export default function ProduitsAdmin() {
  const [vue, setVue] = useState('pieces')
  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('all')
  const [edition, setEdition] = useState(null) // null | 'nouveau' | produit

  useEffect(() => {
    Promise.all([
      supabase.from('produits').select('*').order('ordre').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('ordre'),
      supabase.from('collections').select('*').order('ordre'),
    ]).then(([p, c, co]) => {
      setProduits(p.data ?? [])
      setCategories(c.data ?? [])
      setCollections(co.data ?? [])
      setLoading(false)
    })
  }, [])

  const catParId = Object.fromEntries(categories.map((c) => [c.id, c]))
  const collParId = Object.fromEntries(collections.map((c) => [c.id, c]))
  const affiches = filtre === 'all' ? produits : filtre === 'brouillons' ? produits.filter((p) => !p.visible) : produits.filter((p) => p.categorie_id === filtre)

  const onEnregistre = (data, nouveau) => {
    setProduits((prev) => (nouveau ? [data, ...prev] : prev.map((p) => (p.id === data.id ? data : p))))
    setEdition(null)
  }
  const onSupprime = (id) => {
    setProduits((prev) => prev.filter((p) => p.id !== id))
    setEdition(null)
  }

  // Masquer / afficher toute la boutique d'un coup (ex. pendant une mise à jour du catalogue).
  // Une pièce sans photo reste en brouillon : elle ne peut pas s'afficher dans la boutique.
  const [basculeEnCours, setBasculeEnCours] = useState(false)
  const nbVisibles = produits.filter((p) => p.visible).length
  const affichables = produits.filter((p) => p.images?.length > 0)
  const toutMasquer = nbVisibles > 0
  const basculerTout = async () => {
    const cibles = toutMasquer ? produits.filter((p) => p.visible) : affichables.filter((p) => !p.visible)
    if (!cibles.length) return
    const message = toutMasquer
      ? `Masquer les ${cibles.length} pièce(s) visibles ? La boutique n'affichera plus aucune pièce.`
      : `Afficher ${cibles.length} pièce(s) dans la boutique ?${affichables.length < produits.length ? ` (${produits.length - affichables.length} sans photo resteront en brouillon)` : ''}`
    if (!confirm(message)) return
    setBasculeEnCours(true)
    const ids = cibles.map((p) => p.id)
    const { error } = await supabase.from('produits').update({ visible: !toutMasquer }).in('id', ids)
    if (error) alert("La modification n'a pas pu être enregistrée : " + error.message)
    else setProduits((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, visible: !toutMasquer } : p)))
    setBasculeEnCours(false)
  }

  if (loading) return <p className="font-ui text-[#2A1506]/40 text-sm">Chargement…</p>

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display font-bold text-2xl text-[#2A1506]">Boutique</h2>
          <p className="font-ui text-sm text-[#2A1506]/50 mt-1">Tout ce que tu modifies ici s'affiche directement sur le site.</p>
        </div>
        <div className="flex gap-1 bg-white rounded-xl p-1 border-2 border-[#2A1506]/10">
          {[{ key: 'pieces', label: `Pièces · ${produits.length}` }, { key: 'classement', label: 'Catégories & collections' }].map(({ key, label }) => (
            <button key={key} onClick={() => setVue(key)}
              className={`font-ui text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${vue === key ? 'bg-[#2A1506] text-[#FBF5E9]' : 'text-[#2A1506]/60 hover:text-[#2A1506]'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {vue === 'pieces' ? (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button onClick={() => setEdition('nouveau')} className={`${btnPrimaire} mr-2`}>+ Nouvelle pièce</button>
            {[
              { id: 'all', label: 'Toutes' },
              ...categories.map((c) => ({ id: c.id, label: c.label, color: c.couleur })),
              { id: 'brouillons', label: 'Brouillons' },
            ].map(({ id, label, color }) => (
              <button key={id} onClick={() => setFiltre(id)}
                className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${filtre === id ? 'text-[#2A1506]' : 'bg-white border-[#2A1506]/10 text-[#2A1506]/50 hover:border-[#2A1506]/25'}`}
                style={filtre === id ? { backgroundColor: color || '#F3D07A', borderColor: color || '#F3D07A' } : undefined}>
                {label}
              </button>
            ))}
            {produits.length > 0 && (
              <button onClick={basculerTout} disabled={basculeEnCours || (!toutMasquer && affichables.length === 0)}
                className="ml-auto font-ui text-xs font-semibold px-3 py-1.5 rounded-lg border-2 border-[#2A1506]/15 bg-white text-[#2A1506] hover:border-[#2A1506]/40 transition-colors disabled:opacity-50">
                {basculeEnCours ? '…' : toutMasquer ? `Tout masquer · ${nbVisibles} visible${nbVisibles > 1 ? 's' : ''}` : 'Tout afficher dans la boutique'}
              </button>
            )}
          </div>

          {affiches.length === 0 ? (
            <p className="font-ui text-sm text-[#2A1506]/40 py-12 text-center">Aucune pièce ici pour l'instant.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {affiches.map((p) => {
                const badge = badgeStock(p.stock)
                const cat = catParId[p.categorie_id]
                const coll = collParId[p.collection_id]
                return (
                  <button key={p.id} onClick={() => setEdition(p)} className="group text-left bg-white rounded-2xl border-2 border-[#2A1506]/10 hover:border-[#E87040] overflow-hidden transition-colors">
                    <div className="relative aspect-[4/5] bg-[#FBF5E9]">
                      {p.images[0] ? (
                        <img src={p.images[0].thumb} alt={p.nom} className={`w-full h-full object-cover ${p.stock === 0 || !p.visible ? 'grayscale opacity-60' : ''}`} loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-ui text-xs text-[#2A1506]/30">Pas de photo</div>
                      )}
                      <span className={`absolute top-2 left-2 font-ui text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${badge.classe}`}>{badge.texte}</span>
                      {!p.visible && <span className="absolute top-2 right-2 font-ui text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[#2A1506] text-[#FBF5E9]">Brouillon</span>}
                    </div>
                    <div className="p-3">
                      <p className="font-display font-bold text-sm leading-snug">{p.nom}</p>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="font-ui text-[0.65rem] uppercase tracking-wider truncate" style={{ color: cat?.couleur }}>
                          {cat?.label ?? 'Sans catégorie'}{coll ? ` · ${coll.label}` : ''}
                        </p>
                        <p className={`font-ui text-sm font-bold shrink-0 ${p.prix == null ? 'text-[#D97080]' : ''}`}>{p.prix == null ? 'Sans prix' : formatPrix(p.prix)}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ListeTaxonomie table="categories" titre="Catégories" aide="Le type d'objet : tasses, cuillères, vide-poches…" items={categories} onChange={setCategories} />
          <ListeTaxonomie table="collections" titre="Collections" aide="L'univers visuel : Corail, Visage, Fleurs…" items={collections} onChange={setCollections} />
        </div>
      )}

      <AnimatePresence>
        {edition && (
          <ProduitEditeur
            key={edition === 'nouveau' ? 'nouveau' : edition.id}
            produit={edition === 'nouveau' ? null : edition}
            produits={produits}
            categories={categories}
            collections={collections}
            onFermer={() => setEdition(null)}
            onEnregistre={onEnregistre}
            onSupprime={onSupprime}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── ONGLET COMMANDES ─── */
export function CommandesAdmin() {
  const [commandes, setCommandes] = useState(null)

  useEffect(() => {
    supabase.from('commandes').select('*').order('created_at', { ascending: false }).then(({ data }) => setCommandes(data ?? []))
  }, [])

  if (!commandes) return <p className="font-ui text-[#2A1506]/40 text-sm">Chargement…</p>

  return (
    <>
      <div className="mb-5">
        <h2 className="font-display font-bold text-2xl text-[#2A1506]">Commandes</h2>
        <p className="font-ui text-sm text-[#2A1506]/50 mt-1">Chaque paiement reçu sur la boutique. Tu reçois aussi un mail à chaque commande.</p>
      </div>
      {commandes.length === 0 ? (
        <p className="font-ui text-sm text-[#2A1506]/40 py-12 text-center">Pas encore de commande.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commandes.map((c) => {
            const retrait = /retrait/i.test(c.livraison ?? '')
            const a = c.adresse
            return (
              <div key={c.stripe_session_id} className="bg-white rounded-2xl border-2 border-[#2A1506]/10 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-display font-bold text-lg leading-tight">{c.nom ?? 'Client'}</p>
                    <p className="font-ui text-xs text-[#2A1506]/50 mt-0.5">
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="font-display font-bold text-xl text-[#E87040] shrink-0">{formatPrix(c.total)}</p>
                </div>
                <ul className="font-ui text-sm text-[#2A1506]/80 mb-3">
                  {c.articles.map((art, i) => (
                    <li key={i} className="flex justify-between gap-2 py-1 border-b border-[#2A1506]/5">
                      <span>{art.nom}{art.quantite > 1 ? ` × ${art.quantite}` : ''}</span>
                      <span>{formatPrix(art.montant)}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-ui text-xs mb-1">
                  <span className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${retrait ? 'bg-[#F3D07A]/50' : 'bg-[#9BBF90]/30'}`}>{retrait ? 'Retrait atelier' : 'Colissimo'}</span>
                </p>
                {!retrait && a && (
                  <p className="font-ui text-xs text-[#2A1506]/60 mt-2">{[a.line1, a.line2, `${a.postal_code ?? ''} ${a.city ?? ''}`].filter(Boolean).join(', ')}</p>
                )}
                <p className="font-ui text-xs text-[#2A1506]/60 mt-2">
                  {c.email && <a href={`mailto:${c.email}`} className="text-[#E87040] hover:underline">{c.email}</a>}
                  {c.telephone && <> · {c.telephone}</>}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
