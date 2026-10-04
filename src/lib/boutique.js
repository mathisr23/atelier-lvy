// Petits utilitaires partagés par la boutique, la fiche pièce et le panier.

export const btn = {
  dark: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#2A1506] text-[#FBF5E9] border-2 border-[#2A1506] rounded-xl hover:bg-[#E87040] hover:text-[#2A1506] hover:border-[#E87040] transition-all duration-200 whitespace-nowrap',
  outline: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-transparent text-[#2A1506] border-2 border-[#2A1506] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] transition-all duration-200 whitespace-nowrap',
  orange: 'inline-block font-ui font-semibold text-sm px-8 py-3.5 bg-[#E87040] text-[#2A1506] border-2 border-[#E87040] rounded-xl hover:bg-[#2A1506] hover:text-[#FBF5E9] hover:border-[#2A1506] transition-all duration-200 whitespace-nowrap',
}

const defaultDescriptions = {
  'porte-bijoux': "Un joli rangement pour poser bagues et bijoux du quotidien — pièce unique en grès, façonnée et émaillée à la main.",
  'bols-vases': "Une pièce en grès façonnée à la main, entre objet du quotidien et petite sculpture.",
  'cuilleres': "Une cuillère en grès façonnée et peinte à la main, pour twister sa vaisselle du quotidien.",
  'art-de-la-table': "Une pièce en grès façonnée à la main, pour twister sa table ou son intérieur.",
  'figurines': "Une petite pièce en grès modelée à la main, pleine de caractère.",
}
export function defaultDescription(categorieSlug) {
  return defaultDescriptions[categorieSlug] ?? 'Pièce unique façonnée à la main dans mon atelier, en grès.'
}

export const formatPrix = (n) => `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2 })} €`

export const lienPiece = (slug) => `/boutique/${slug}`
