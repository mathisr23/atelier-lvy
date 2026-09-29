// La vente en ligne n'est ouverte sur le site de production qu'une fois Stripe en mode réel.
// Pour l'ouvrir : variable VITE_VENTE_OUVERTE=true dans Vercel (environnement Production), puis redéployer.
// En local et sur les aperçus Vercel, elle reste ouverte pour pouvoir tester avec les cartes de test.
const HOTES_PRODUCTION = ['atelier-lvy.vercel.app']

export const VENTE_OUVERTE =
  import.meta.env.VITE_VENTE_OUVERTE === 'true' || !HOTES_PRODUCTION.includes(window.location.hostname)
