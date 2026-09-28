-- Annule le test d'achat réel effectué en Stripe test mode (voir conversation) —
-- remet la cuillère étoile disponible, ce n'était pas une vraie vente.
update produit_prix set vendu = false where slug = 'cuillere-etoile';
