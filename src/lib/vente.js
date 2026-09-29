// La vente en ligne n'est ouverte sur le site de production qu'une fois Stripe en mode réel.
// Pour l'ouvrir : variable VITE_VENTE_OUVERTE=true dans Vercel (environnement Production), puis redéployer.
// En local et sur les aperçus Vercel, elle reste ouverte pour pouvoir tester avec les cartes de test
// (VITE_VENTE_OUVERTE=false, ou ?vente=fermee dans l'URL, pour y voir la version « bientôt »).
const HOTES_PRODUCTION = ['atelier-lvy.vercel.app']

const forceFermee =
  import.meta.env.VITE_VENTE_OUVERTE === 'false' || new URLSearchParams(window.location.search).get('vente') === 'fermee'

export const VENTE_OUVERTE =
  !forceFermee &&
  (import.meta.env.VITE_VENTE_OUVERTE === 'true' || !HOTES_PRODUCTION.includes(window.location.hostname))
