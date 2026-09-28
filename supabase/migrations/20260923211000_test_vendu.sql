-- Test temporaire du statut "vendu" — sera revenu à false juste après vérification.
update produit_prix set vendu = true where slug = 'porte-bijoux-chat';
