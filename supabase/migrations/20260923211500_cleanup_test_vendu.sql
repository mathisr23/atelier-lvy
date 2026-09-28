-- Annule le test du statut "vendu" (voir migration précédente).
update produit_prix set vendu = false where slug = 'porte-bijoux-chat';
