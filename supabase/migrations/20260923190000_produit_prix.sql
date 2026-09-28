-- Prix et description des pièces de la boutique, éditables depuis l'admin.
-- Le catalogue (photos, noms, catégories) reste dans src/data/produits.js ;
-- cette table ne stocke que ce que Léa doit pouvoir changer elle-même.

create table if not exists produit_prix (
  slug text primary key,
  prix numeric,
  description text,
  updated_at timestamptz not null default now()
);

alter table produit_prix enable row level security;

create policy "Lecture publique des prix"
  on produit_prix for select
  using (true);

create policy "Écriture admin des prix"
  on produit_prix for all
  to authenticated
  using (true)
  with check (true);
