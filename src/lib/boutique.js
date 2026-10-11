// Petits utilitaires partagés par la boutique, la fiche pièce et le panier.

export const btn = {
  dark: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] border-2 border-[#2A1506] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  outline: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-transparent text-[#2A1506] border-2 border-[#2A1506] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-all duration-200 whitespace-nowrap',
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200 whitespace-nowrap',
}

// Texte affiché quand Léa n'a pas écrit de description pour une pièce, selon son type.
// Clés = slugs des catégories en base. Attention : certains slugs ne correspondent plus à leur libellé
// (« figurines » = Tasses / bols / verres, « mugs-et-tasses » = Figurines / jeux) : on suit le libellé.
const defaultDescriptions = {
  'bijoux': "Un bijou léger, modelé à la main dans le grès puis décoré à l'engobe et à l'émail. La terre garde la trace des doigts qui l'ont façonné : aucun n'est tout à fait pareil.",
  'porte-bijoux': "Un petit nid pour bagues, boucles et trésors du quotidien. Modelé à la main dans le grès, émaillé puis cuit deux fois, il devient une petite sculpture posée sur la commode.",
  'figurines': "Une pièce en grès modelée à la main pour le café du matin ou le thé de l'après-midi. Sa forme un peu irrégulière se glisse dans la paume, son émail apporte une touche de couleur à la table.",
  'bols-vases': "Une pièce en grès modelée à la main, entre objet utile et petite sculpture : pour quelques fleurs des champs, une carafe d'eau, ou le simple plaisir des formes organiques.",
  'cuilleres': "Modelée et peinte à la main dans le grès, cette petite pièce glisse un peu de couleur dans la vaisselle du quotidien, à côté du pot de miel ou de la théière.",
  'art-de-la-table': "Une pièce en grès modelée à la main, aux bords ondulés comme la terre les a voulus. Pour dresser une table avec des pièces qui ne ressemblent à aucune autre.",
  'mugs-et-tasses': "Une petite pièce en grès modelée à la main, pleine de caractère : à poser sur une étagère, à offrir ou à jouer. Chaque détail est façonné du bout des doigts, puis émaillé et cuit deux fois.",
}
export function defaultDescription(categorieSlug) {
  return defaultDescriptions[categorieSlug] ?? 'Une pièce unique modelée à la main dans le grès, émaillée puis cuite deux fois à l’atelier.'
}

// « 13x11.5x5cm » → « 13 × 11,5 × 5 cm » (saisie libre dans l'admin, affichage harmonisé)
export function formatDimensions(texte) {
  if (!texte) return null
  const propre = texte.trim()
  if (!/^[0-9.,\sx×]+(cm)?$/i.test(propre)) return propre
  const valeurs = propre.replace(/cm$/i, '').split(/\s*[x×]\s*/i).map((v) => v.trim().replace('.', ','))
  return `${valeurs.join(' × ')} cm`
}

export const formatPrix = (n) => `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2 })} €`

export const lienPiece = (slug) => `/boutique/${slug}`
