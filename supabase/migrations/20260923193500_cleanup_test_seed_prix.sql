-- Nettoyage de la ligne de test insérée pour vérifier l'affichage (voir migration précédente).
delete from produit_prix where slug = 'porte-bijoux-chat' and description = 'TEST VERIFICATION';
