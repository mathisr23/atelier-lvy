-- Ligne de test temporaire pour vérifier l'affichage côté boutique — sera supprimée juste après.
insert into produit_prix (slug, prix, description)
values ('porte-bijoux-chat', 25, 'TEST VERIFICATION')
on conflict (slug) do update set prix = excluded.prix, description = excluded.description;
