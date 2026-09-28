// Catalogue boutique — photos, noms, catégories (statique).
// Prix et descriptions vivent dans la table Supabase `produit_prix`, éditable depuis l'admin.
// Noms et regroupements sont provisoires : à valider avec Léa avant mise en ligne.

const thumbs = import.meta.glob('../assets/boutique/optimized/thumb/*.webp', { eager: true, import: 'default' })
const fulls = import.meta.glob('../assets/boutique/optimized/full/*.webp', { eager: true, import: 'default' })

function img(name) {
  const thumb = thumbs[`../assets/boutique/optimized/thumb/${name}.webp`]
  const full = fulls[`../assets/boutique/optimized/full/${name}.webp`]
  return { thumb, full }
}

function imgs(names) {
  return names.map(img)
}

export const categories = [
  { slug: 'porte-bijoux', label: 'Porte-bijoux', color: '#E87040' },
  { slug: 'bols-vases', label: 'Bols & vases', color: '#9BBF90' },
  { slug: 'cuilleres', label: 'Cuillères', color: '#F2A0A8' },
  { slug: 'art-de-la-table', label: 'Art de la table', color: '#D97080' },
  { slug: 'figurines', label: 'Figurines & jeux', color: '#F3D07A' },
]

export const produits = [
  {
    slug: 'porte-bijoux-monstre-jaune',
    nom: 'Porte-bijoux Monstre jaune',
    categorie: 'porte-bijoux',
    images: imgs(['monstre_jaune']),
  },
  {
    slug: 'porte-bijoux-monstre-rose',
    nom: 'Porte-bijoux Monstre rose',
    categorie: 'porte-bijoux',
    images: imgs(['monstre_rouge', 'monstre_rouge_2']),
  },
  {
    slug: 'porte-bijoux-chat',
    nom: 'Porte-bijoux Chat',
    categorie: 'porte-bijoux',
    images: imgs(['chat_porte_bijoux']),
  },
  {
    slug: 'porte-bijoux-vague',
    nom: 'Porte-bijoux Vague',
    categorie: 'porte-bijoux',
    images: imgs(['porte_bijoux_vague', 'porte_bijoux_vague_2', 'porte_bijoux_vague_3', 'porte_bijoux_vague_4']),
  },
  {
    slug: 'porte-bijoux-oursin',
    nom: 'Porte-bijoux Oursin',
    categorie: 'porte-bijoux',
    images: imgs(['porte_bijoux_tentacule', 'porte_bijoux_tentacule_2', 'porte_bijoux_tentacule_3']),
  },
  {
    slug: 'porte-bijoux-epines',
    nom: 'Porte-bijoux Épines',
    categorie: 'porte-bijoux',
    images: imgs(['porte_bijoux_epine', 'porte_bijoux_epine_2', 'porte_bijoux_epine_3']),
  },
  {
    slug: 'porte-bijoux-patte',
    nom: 'Porte-bijoux Patte',
    categorie: 'porte-bijoux',
    images: imgs(['porte_bijoux_trous', 'duo_porte_bijoux']),
  },
  {
    slug: 'porte-bijoux-vaguelette',
    nom: 'Porte-bijoux Vaguelette',
    categorie: 'porte-bijoux',
    images: imgs(['porte_bijoux_baignoire']),
  },
  {
    slug: 'porte-bijoux-visage',
    nom: 'Porte-bijoux Visage',
    categorie: 'porte-bijoux',
    images: imgs(['visage_porte_bijoux']),
  },
  {
    slug: 'bol-corail',
    nom: 'Bol Corail',
    categorie: 'bols-vases',
    images: imgs(['bol_corail', 'bol_corail_2']),
  },
  {
    slug: 'bol-visage',
    nom: 'Bol Visage',
    categorie: 'bols-vases',
    images: imgs(['visage_bol']),
  },
  {
    slug: 'vase-organique',
    nom: 'Vase organique',
    categorie: 'bols-vases',
    images: imgs(['vase', 'vase_2']),
  },
  {
    slug: 'coupelles-texturees',
    nom: 'Coupelles texturées',
    categorie: 'bols-vases',
    images: imgs(['porte_bijoux_tasses_all']),
  },
  {
    slug: 'coupe-martini',
    nom: 'Coupe Martini',
    categorie: 'art-de-la-table',
    images: imgs(['martini']),
  },
  {
    slug: 'mini-table-pois',
    nom: 'Mini-table à pois',
    categorie: 'art-de-la-table',
    images: imgs(['mini_table', 'mini_table_2']),
  },
  {
    slug: 'plateaux-visages',
    nom: 'Plateaux Visages',
    categorie: 'art-de-la-table',
    images: imgs(['porte_bijoux_all', 'porte_bijoux_all_2']),
  },
  {
    slug: 'cuillere-etoile',
    nom: 'Cuillère Étoile',
    categorie: 'cuilleres',
    images: imgs(['cuillere_etoile', 'cuillere_etoile_2', 'cuillere_etoile_3']),
  },
  {
    slug: 'cuillere-fleur',
    nom: 'Cuillère Fleur & sa coupelle',
    categorie: 'cuilleres',
    images: imgs(['cuillere_fleurs']),
  },
  {
    slug: 'collection-cuilleres',
    nom: 'Collection de cuillères peintes',
    categorie: 'cuilleres',
    images: imgs(['cuillere_1', 'cuillere_2', 'cuillere_size', 'cuilleres_all', 'cuilleres_all_2']),
  },
  {
    slug: 'duo-poussins',
    nom: 'Duo de poussins',
    categorie: 'figurines',
    images: imgs(['poussin_1', 'poussin_2']),
  },
  {
    slug: 'jeu-morpion-poussins',
    nom: 'Jeu de morpion Poussins',
    categorie: 'figurines',
    images: imgs(['morpion_poussins', 'morpion_poussins_2']),
  },
]
