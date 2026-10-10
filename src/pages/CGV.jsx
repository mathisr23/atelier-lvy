import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import PageLegale, { Section, ACompleter } from '../components/PageLegale'
import { SEUIL_LIVRAISON_OFFERTE } from '../data/livraison'

const EMAIL = 'contact.atelierlvy@gmail.com'
const Mail = () => <a href={`mailto:${EMAIL}`} className="underline hover:text-[#E87040]">{EMAIL}</a>

export default function CGV() {
  useSEO({ title: 'Conditions générales de vente — Léa Artiste céramiste', description: "Conditions de vente, de livraison et de retour des pièces de l'atelier." })

  return (
    <PageLegale surtitre="Boutique de l'atelier" titre="Conditions générales de vente" miseAJour="octobre 2026">
      <Section titre="1. Objet">
        <p>
          Les présentes conditions régissent la vente des pièces en céramique proposées sur la boutique en ligne par{' '}
          <ACompleter>prénom et nom de Léa</ACompleter>, micro-entrepreneuse (SIRET <ACompleter>numéro SIRET</ACompleter>), ci-après « l'atelier »,
          à des clients particuliers. Toute commande implique leur acceptation. Les coordonnées complètes de l'atelier figurent dans les{' '}
          <Link to="/mentions-legales" className="underline hover:text-[#E87040]">mentions légales</Link>.
        </p>
      </Section>

      <Section titre="2. Les pièces">
        <p>
          Chaque pièce est façonnée et émaillée à la main. Les variations de forme, de teinte ou d'émail d'une pièce à l'autre, ou par rapport aux
          photographies, font partie de leur caractère artisanal et ne constituent pas un défaut. Les pièces sont proposées dans la limite des
          stocks disponibles ; la plupart sont uniques.
        </p>
      </Section>

      <Section titre="3. Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. TVA non applicable, article 293 B du Code général des impôts. Les frais de
          livraison s'ajoutent au prix des pièces ; ils sont affichés dans le panier et au moment du paiement, avant validation de la commande.
        </p>
      </Section>

      <Section titre="4. Commande et paiement">
        <p>
          La commande est validée après paiement par carte bancaire, via la plateforme sécurisée Stripe. L'atelier n'a jamais accès à vos
          coordonnées bancaires. Un e-mail de confirmation récapitulant la commande vous est envoyé dès le paiement accepté.
        </p>
      </Section>

      <Section titre="5. Livraison">
        <p>Les livraisons sont effectuées en France métropolitaine. Au moment du paiement, vous choisissez :</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>la livraison en point relais Mondial Relay (indiquez le point relais souhaité dans le champ prévu) ;</li>
          <li>la livraison à domicile en Colissimo ;</li>
          <li>pour les petits bijoux, l'envoi en lettre suivie La Poste ;</li>
          <li>ou le retrait gratuit à l'atelier, sur rendez-vous.</li>
        </ul>
        <p>
          Les frais dépendent du poids du colis et du mode choisi. La livraison est offerte dès {SEUIL_LIVRAISON_OFFERTE} € d'achat. Les pièces
          sont expédiées sous <ACompleter>délai d'expédition, ex. 5 jours ouvrés</ACompleter> après le paiement ; un numéro de suivi vous est
          communiqué par e-mail.
        </p>
        <p>
          Chaque pièce est soigneusement emballée. Si un colis arrive abîmé ou si une pièce est cassée, merci de le signaler sous 48 heures à <Mail />,
          avec des photos du colis et de la pièce : l'atelier vous propose alors un remplacement, si possible, ou un remboursement.
        </p>
      </Section>

      <Section titre="6. Droit de rétractation">
        <p>
          Vous disposez d'un délai de 14 jours à compter de la réception de votre commande pour vous rétracter, sans avoir à vous justifier. Il
          suffit d'envoyer une déclaration claire (par exemple le formulaire ci-dessous) à <Mail />.
        </p>
        <p>
          Les pièces doivent être renvoyées, bien protégées et dans leur état d'origine, au plus tard 14 jours après votre déclaration. Les frais de
          retour sont à votre charge. L'atelier vous rembourse la totalité des sommes versées, frais de livraison initiaux compris (sur la base du mode
          d'envoi le moins cher proposé), dans les 14 jours suivant votre déclaration ; ce remboursement peut être différé jusqu'à la réception des
          pièces. Il est effectué sur le moyen de paiement utilisé lors de la commande.
        </p>
        <p>
          Le droit de rétractation ne s'applique pas aux pièces réalisées sur commande selon vos indications ou nettement personnalisées
          (article L221-28 du Code de la consommation).
        </p>
      </Section>

      <Section titre="7. Garanties légales">
        <p>
          Les pièces bénéficient de la garantie légale de conformité (articles L217-3 et suivants du Code de la consommation), pendant 2 ans à
          compter de la livraison, et de la garantie des vices cachés (articles 1641 et suivants du Code civil). Pour la mettre en œuvre, contactez
          l'atelier à <Mail />.
        </p>
      </Section>

      <Section titre="8. Réclamations et médiation">
        <p>
          Pour toute réclamation, écrivez d'abord à <Mail /> : l'atelier vous répond au plus vite. Si aucune solution amiable n'est trouvée, vous
          pouvez recourir gratuitement au médiateur de la consommation : <ACompleter>nom et site du médiateur choisi</ACompleter>.
        </p>
      </Section>

      <Section titre="9. Droit applicable">
        <p>Les présentes conditions sont soumises au droit français.</p>
      </Section>

      <Section titre="Formulaire de rétractation">
        <div className="bg-white rounded-2xl border-2 border-[#2A1506]/10 p-5 md:p-6 flex flex-col gap-2 text-sm">
          <p className="italic text-[#2A1506]/60">À compléter et renvoyer uniquement si vous souhaitez vous rétracter de la commande.</p>
          <p>À l'attention de <ACompleter>prénom et nom de Léa, adresse</ACompleter>, {EMAIL} :</p>
          <p>Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous :</p>
          <p>— Pièce(s) concernée(s) :</p>
          <p>— Commandée(s) le / reçue(s) le :</p>
          <p>— Nom du client :</p>
          <p>— Adresse du client :</p>
          <p>— Signature du client (uniquement en cas d'envoi sur papier) :</p>
          <p>— Date :</p>
        </div>
      </Section>
    </PageLegale>
  )
}
