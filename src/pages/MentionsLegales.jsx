import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import PageLegale, { Section, ACompleter } from '../components/PageLegale'

const EMAIL = 'contact.atelierlvy@gmail.com'

export default function MentionsLegales() {
  useSEO({ title: 'Mentions légales — Léa Artiste céramiste', description: "Mentions légales et protection des données personnelles du site de l'atelier." })

  return (
    <PageLegale surtitre="Informations légales" titre="Mentions légales" miseAJour="octobre 2026">
      <Section titre="Éditrice du site">
        <p>
          Le site est édité par <ACompleter>prénom et nom de Léa</ACompleter>, entrepreneuse individuelle sous le régime de la micro-entreprise
          (Atelier LVY).
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>SIRET : <ACompleter>numéro SIRET</ACompleter></li>
          <li>Adresse : <ACompleter>adresse de l'atelier ou de domiciliation</ACompleter></li>
          <li>E-mail : <a href={`mailto:${EMAIL}`} className="underline hover:text-[#E87040]">{EMAIL}</a></li>
          <li>Téléphone : <ACompleter>numéro de téléphone</ACompleter></li>
          <li>TVA non applicable, article 293 B du Code général des impôts.</li>
        </ul>
        <p>Directrice de la publication : <ACompleter>prénom et nom de Léa</ACompleter>.</p>
      </Section>

      <Section titre="Hébergement">
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).
          Les données de la boutique (catalogue, commandes) sont hébergées par Supabase (supabase.com).
        </p>
      </Section>

      <Section titre="Propriété intellectuelle">
        <p>
          Les créations présentées, les photographies, les textes, les illustrations et le logo sont la propriété de l'éditrice.
          Toute reproduction ou utilisation sans autorisation écrite préalable est interdite.
        </p>
      </Section>

      <Section titre="Données personnelles">
        <p>
          Les données que vous transmettez (nom, e-mail, téléphone, adresse de livraison, point relais, message) servent uniquement à traiter
          vos commandes et à répondre à vos demandes. Elles ne sont jamais vendues ni utilisées à des fins publicitaires.
        </p>
        <p>Elles sont transmises aux seuls prestataires nécessaires :</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Stripe, pour le paiement : l'éditrice n'a jamais accès à vos coordonnées bancaires ;</li>
          <li>Supabase, pour l'enregistrement des commandes ;</li>
          <li>EmailJS, pour l'envoi des e-mails de confirmation ;</li>
          <li>le transporteur choisi (Mondial Relay, Colissimo ou La Poste), pour la livraison.</li>
        </ul>
        <p>
          Les données des commandes sont conservées le temps nécessaire à leur suivi, puis pendant la durée imposée par les obligations comptables
          (10 ans pour les pièces justificatives).
        </p>
        <p>
          Conformément au RGPD, vous pouvez accéder à vos données, les rectifier, demander leur effacement ou vous opposer à leur traitement en
          écrivant à <a href={`mailto:${EMAIL}`} className="underline hover:text-[#E87040]">{EMAIL}</a>. Vous pouvez aussi adresser une
          réclamation à la CNIL (cnil.fr).
        </p>
      </Section>

      <Section titre="Cookies et stockage">
        <p>
          Le site n'utilise ni cookie publicitaire ni outil de mesure d'audience. Le contenu de votre panier est enregistré dans votre navigateur
          (stockage local), uniquement pour le retrouver lors de votre prochaine visite. Le fil Instagram affiché sur le site est fourni par le
          service Behold.
        </p>
      </Section>

      <Section titre="Vente en ligne">
        <p>
          Les ventes réalisées sur la boutique sont régies par les{' '}
          <Link to="/cgv" className="underline hover:text-[#E87040]">conditions générales de vente</Link>.
        </p>
      </Section>
    </PageLegale>
  )
}
