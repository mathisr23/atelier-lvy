-- Prix FICTIFS temporaires pour que la boutique ne soit pas vide en attendant les vrais tarifs.
-- Léa peut les changer à tout moment depuis l'admin (onglet Produits) — ça écrasera ces valeurs.

insert into produit_prix (slug, prix) values
  ('porte-bijoux-monstre-jaune', 32),
  ('porte-bijoux-monstre-rose', 32),
  ('porte-bijoux-chat', 24),
  ('porte-bijoux-vague', 26),
  ('porte-bijoux-oursin', 28),
  ('porte-bijoux-epines', 26),
  ('porte-bijoux-patte', 22),
  ('porte-bijoux-vaguelette', 20),
  ('porte-bijoux-visage', 24),
  ('bol-corail', 38),
  ('bol-visage', 32),
  ('vase-organique', 45),
  ('coupelles-texturees', 30),
  ('coupe-martini', 28),
  ('mini-table-pois', 22),
  ('plateaux-visages', 18),
  ('cuillere-etoile', 12),
  ('cuillere-fleur', 15),
  ('collection-cuilleres', 45),
  ('duo-poussins', 18),
  ('jeu-morpion-poussins', 25)
on conflict (slug) do update set prix = excluded.prix;
