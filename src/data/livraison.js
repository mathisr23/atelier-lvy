// Frais de livraison — grille par palier de poids, affichée dans le panier.
// Le calcul qui fait foi est côté serveur (supabase/functions/create-checkout-session) : garder synchronisé.

// Emballage ajouté au poids des pièces : il grandit avec le poids des pièces, de 100 g (petit bijou dans une boîte
// ou une enveloppe à bulles) jusqu'à 800 g (grosse pièce, carton et calage).
const EMBALLAGE_MIN_G = 100
const EMBALLAGE_MAX_G = 800
const emballageG = (poidsPiecesG) => Math.min(EMBALLAGE_MAX_G, Math.round(EMBALLAGE_MIN_G + poidsPiecesG * 0.7))

// Poids retenu pour une pièce dont le poids n'est pas renseigné dans l'admin
export const POIDS_PAR_DEFAUT_G = 500
export const SEUIL_LIVRAISON_OFFERTE = 60

// Paliers de poids (emballage compris), bornes hautes en grammes
export const PALIERS_G = [250, 500, 1000, 2000, 3000, 5000]

// Tarifs TTC pour le client, par palier : tarif transporteur + de 0,50 € (petits colis) à 1 € (colis plus gros) d'emballage, arrondi.
// Le palier 3 kg est interpolé entre les tarifs 2 kg et 5 kg : à vérifier sur le simulateur Colissimo.
// null = option non proposée à ce poids
export const TARIFS_LIVRAISON = {
  mondial_relay: { label: 'Mondial Relay — point relais', prix: [4.5, 5.5, 6.5, 7.5, null, null] },
  colissimo: { label: 'Colissimo — livraison à domicile', prix: [6, 8.6, 10.6, 12.2, 14.3, 18.4] },
}

// Petit envoi (bijoux, petits ornements) en lettre suivie : jusqu'à 50 g de pièces + enveloppe à bulles (~50 g)
// = palier 100 g de la lettre verte suivie (3,60 €), plus 0,40 € d'enveloppe. Épaisseur limitée, indemnisation faible.
export const LETTRE_SUIVIE = { cle: 'lettre_suivie', label: 'La Poste — lettre suivie (petit envoi)', poidsPiecesMaxG: 50, prix: 4 }

// Options d'envoi pour un poids de pièces donné (sans l'emballage), de la moins chère à la plus chère.
// Tableau vide = envoi en ligne impossible.
export function optionsLivraison(poidsPiecesG) {
  const options = []
  if (poidsPiecesG <= LETTRE_SUIVIE.poidsPiecesMaxG) {
    options.push({ cle: LETTRE_SUIVIE.cle, label: LETTRE_SUIVIE.label, prix: LETTRE_SUIVIE.prix })
  }
  const poids = poidsPiecesG + emballageG(poidsPiecesG)
  const palier = PALIERS_G.findIndex((max) => poids <= max)
  if (palier !== -1) {
    for (const [cle, t] of Object.entries(TARIFS_LIVRAISON)) {
      if (t.prix[palier] != null) options.push({ cle, label: t.label, prix: t.prix[palier] })
    }
  }
  return options.sort((a, b) => a.prix - b.prix)
}

// Poids total des pièces du panier (quantités comprises)
export function poidsPiecesPanier(items, produitsParSlug) {
  return items.reduce((n, i) => n + (produitsParSlug[i.slug]?.poids_g ?? POIDS_PAR_DEFAUT_G) * i.qte, 0)
}
