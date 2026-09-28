import { supabase } from './supabase'

// Photos produits : compressées dans le navigateur avant l'envoi (une photo d'iPhone de 5 Mo
// devient ~80 Ko en miniature et ~300 Ko en grand), puis stockées dans le bucket « produits ».
const BUCKET = 'produits'
const TAILLES = {
  thumb: { largeur: 700, qualite: 0.75 },
  full: { largeur: 1600, qualite: 0.82 },
}

function toBlob(canvas, type, qualite) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, qualite))
}

async function redimensionner(bitmap, { largeur, qualite }) {
  const ratio = Math.min(1, largeur / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * ratio)
  canvas.height = Math.round(bitmap.height * ratio)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  // WebP si le navigateur sait l'encoder, sinon JPEG (vieux Safari)
  const webp = await toBlob(canvas, 'image/webp', qualite)
  if (webp?.type === 'image/webp') return { blob: webp, ext: 'webp' }
  return { blob: await toBlob(canvas, 'image/jpeg', qualite), ext: 'jpg' }
}

// Compresse et envoie une photo — renvoie { thumb, full, chemins } à stocker dans produits.images
export async function envoyerPhoto(fichier, dossier) {
  const bitmap = await createImageBitmap(fichier, { imageOrientation: 'from-image' })
  const id = crypto.randomUUID()
  const resultat = { chemins: [] }
  for (const [nom, taille] of Object.entries(TAILLES)) {
    const { blob, ext } = await redimensionner(bitmap, taille)
    const chemin = `${dossier}/${id}-${nom}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(chemin, blob, {
      contentType: blob.type,
      cacheControl: '31536000',
    })
    if (error) throw error
    resultat[nom] = supabase.storage.from(BUCKET).getPublicUrl(chemin).data.publicUrl
    resultat.chemins.push(chemin)
  }
  bitmap.close?.()
  return resultat
}

// Supprime du stockage les fichiers de photos retirées (les anciennes photos dans /public n'ont pas de chemins)
export async function supprimerPhotos(photos) {
  const chemins = photos.flatMap((p) => p.chemins ?? [])
  if (chemins.length > 0) await supabase.storage.from(BUCKET).remove(chemins)
}

export const slugifier = (texte) =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
