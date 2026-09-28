-- Catalogue boutique entièrement géré depuis l'admin : produits, catégories (type d'objet),
-- collections (univers visuel), stock et photos (bucket Storage « produits »).
-- Remplace src/data/produits.js et la table produit_prix (conservée pour l'historique, plus utilisée).

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  couleur text not null default '#E87040',
  ordre int not null default 0
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  couleur text not null default '#E87040',
  ordre int not null default 0
);

create table if not exists produits (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nom text not null,
  description text,
  prix numeric(10, 2),
  stock int not null default 1 check (stock >= 0),
  poids_g int check (poids_g is null or poids_g >= 0),
  categorie_id uuid references categories (id) on delete set null,
  collection_id uuid references collections (id) on delete set null,
  images jsonb not null default '[]'::jsonb,
  visible boolean not null default true,
  ordre int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table categories enable row level security;
alter table collections enable row level security;
alter table produits enable row level security;

create policy "Lecture publique des catégories" on categories for select using (true);
create policy "Écriture admin des catégories" on categories for all to authenticated using (true) with check (true);
create policy "Lecture publique des collections" on collections for select using (true);
create policy "Écriture admin des collections" on collections for all to authenticated using (true) with check (true);
-- Les brouillons (visible = false) ne sont lisibles que par l'admin connectée
create policy "Lecture publique des produits visibles" on produits for select using (visible);
create policy "Accès admin aux produits" on produits for all to authenticated using (true) with check (true);

-- Décrément atomique du stock après paiement — appelé uniquement par le webhook Stripe (service_role)
create or replace function decrementer_stock(p_slug text, p_qte int)
returns void
language sql
security definer
set search_path = public
as $$
  update produits set stock = greatest(stock - p_qte, 0), updated_at = now() where slug = p_slug;
$$;
revoke execute on function decrementer_stock(text, int) from public, anon, authenticated;
grant execute on function decrementer_stock(text, int) to service_role;

-- Commandes payées — une ligne par session Stripe. Sert d'historique et empêche
-- de décompter deux fois le stock si Stripe renvoie le même événement.
create table if not exists commandes (
  stripe_session_id text primary key,
  nom text,
  email text,
  telephone text,
  total numeric(10, 2),
  livraison text,
  adresse jsonb,
  articles jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table commandes enable row level security;
create policy "Lecture admin des commandes" on commandes for select to authenticated using (true);

-- Photos : bucket public en lecture, écriture réservée à l'admin connectée
insert into storage.buckets (id, name, public)
values ('produits', 'produits', true)
on conflict (id) do nothing;

create policy "Upload photos produits (admin)" on storage.objects for insert to authenticated with check (bucket_id = 'produits');
create policy "Modif photos produits (admin)" on storage.objects for update to authenticated using (bucket_id = 'produits');
create policy "Suppression photos produits (admin)" on storage.objects for delete to authenticated using (bucket_id = 'produits');

-- ─── Reprise de l'existant ───
insert into categories (slug, label, couleur, ordre) values
  ('porte-bijoux', 'Porte-bijoux', '#E87040', 0),
  ('bols-vases', 'Bols & vases', '#9BBF90', 1),
  ('cuilleres', 'Cuillères', '#F2A0A8', 2),
  ('art-de-la-table', 'Art de la table', '#D97080', 3),
  ('figurines', 'Figurines & jeux', '#F3D07A', 4)
on conflict (slug) do nothing;

insert into collections (slug, label, couleur, ordre) values
  ('corail', 'Corail', '#E87040', 0),
  ('visage', 'Visage', '#D97080', 1),
  ('fleurs', 'Fleurs', '#9BBF90', 2)
on conflict (slug) do nothing;

-- Produits : photos déplacées dans /public/boutique, prix/description/vendu repris de produit_prix
insert into produits (slug, nom, categorie_id, collection_id, images, ordre, prix, description, stock)
select v.slug, v.nom, c.id, co.id, v.images, v.ordre, pp.prix, pp.description,
       case when coalesce(pp.vendu, false) then 0 else 1 end
from (values
  ('porte-bijoux-monstre-jaune', 'Porte-bijoux Monstre jaune', 'porte-bijoux', null, '[{"thumb": "/boutique/thumb/monstre_jaune.webp", "full": "/boutique/full/monstre_jaune.webp"}]'::jsonb, 0),
  ('porte-bijoux-monstre-rose', 'Porte-bijoux Monstre rose', 'porte-bijoux', null, '[{"thumb": "/boutique/thumb/monstre_rouge.webp", "full": "/boutique/full/monstre_rouge.webp"}, {"thumb": "/boutique/thumb/monstre_rouge_2.webp", "full": "/boutique/full/monstre_rouge_2.webp"}]'::jsonb, 1),
  ('porte-bijoux-chat', 'Porte-bijoux Chat', 'porte-bijoux', null, '[{"thumb": "/boutique/thumb/chat_porte_bijoux.webp", "full": "/boutique/full/chat_porte_bijoux.webp"}]'::jsonb, 2),
  ('porte-bijoux-vague', 'Porte-bijoux Vague', 'porte-bijoux', null, '[{"thumb": "/boutique/thumb/porte_bijoux_vague.webp", "full": "/boutique/full/porte_bijoux_vague.webp"}, {"thumb": "/boutique/thumb/porte_bijoux_vague_2.webp", "full": "/boutique/full/porte_bijoux_vague_2.webp"}, {"thumb": "/boutique/thumb/porte_bijoux_vague_3.webp", "full": "/boutique/full/porte_bijoux_vague_3.webp"}, {"thumb": "/boutique/thumb/porte_bijoux_vague_4.webp", "full": "/boutique/full/porte_bijoux_vague_4.webp"}]'::jsonb, 3),
  ('porte-bijoux-oursin', 'Porte-bijoux Oursin', 'porte-bijoux', null, '[{"thumb": "/boutique/thumb/porte_bijoux_tentacule.webp", "full": "/boutique/full/porte_bijoux_tentacule.webp"}, {"thumb": "/boutique/thumb/porte_bijoux_tentacule_2.webp", "full": "/boutique/full/porte_bijoux_tentacule_2.webp"}, {"thumb": "/boutique/thumb/porte_bijoux_tentacule_3.webp", "full": "/boutique/full/porte_bijoux_tentacule_3.webp"}]'::jsonb, 4),
  ('porte-bijoux-epines', 'Porte-bijoux Épines', 'porte-bijoux', null, '[{"thumb": "/boutique/thumb/porte_bijoux_epine.webp", "full": "/boutique/full/porte_bijoux_epine.webp"}, {"thumb": "/boutique/thumb/porte_bijoux_epine_2.webp", "full": "/boutique/full/porte_bijoux_epine_2.webp"}, {"thumb": "/boutique/thumb/porte_bijoux_epine_3.webp", "full": "/boutique/full/porte_bijoux_epine_3.webp"}]'::jsonb, 5),
  ('porte-bijoux-patte', 'Porte-bijoux Patte', 'porte-bijoux', null, '[{"thumb": "/boutique/thumb/porte_bijoux_trous.webp", "full": "/boutique/full/porte_bijoux_trous.webp"}, {"thumb": "/boutique/thumb/duo_porte_bijoux.webp", "full": "/boutique/full/duo_porte_bijoux.webp"}]'::jsonb, 6),
  ('porte-bijoux-vaguelette', 'Porte-bijoux Vaguelette', 'porte-bijoux', null, '[{"thumb": "/boutique/thumb/porte_bijoux_baignoire.webp", "full": "/boutique/full/porte_bijoux_baignoire.webp"}]'::jsonb, 7),
  ('porte-bijoux-visage', 'Porte-bijoux Visage', 'porte-bijoux', 'visage', '[{"thumb": "/boutique/thumb/visage_porte_bijoux.webp", "full": "/boutique/full/visage_porte_bijoux.webp"}]'::jsonb, 8),
  ('bol-corail', 'Bol Corail', 'bols-vases', 'corail', '[{"thumb": "/boutique/thumb/bol_corail.webp", "full": "/boutique/full/bol_corail.webp"}, {"thumb": "/boutique/thumb/bol_corail_2.webp", "full": "/boutique/full/bol_corail_2.webp"}]'::jsonb, 9),
  ('bol-visage', 'Bol Visage', 'bols-vases', 'visage', '[{"thumb": "/boutique/thumb/visage_bol.webp", "full": "/boutique/full/visage_bol.webp"}]'::jsonb, 10),
  ('vase-organique', 'Vase organique', 'bols-vases', null, '[{"thumb": "/boutique/thumb/vase.webp", "full": "/boutique/full/vase.webp"}, {"thumb": "/boutique/thumb/vase_2.webp", "full": "/boutique/full/vase_2.webp"}]'::jsonb, 11),
  ('coupelles-texturees', 'Coupelles texturées', 'bols-vases', null, '[{"thumb": "/boutique/thumb/porte_bijoux_tasses_all.webp", "full": "/boutique/full/porte_bijoux_tasses_all.webp"}]'::jsonb, 12),
  ('coupe-martini', 'Coupe Martini', 'art-de-la-table', null, '[{"thumb": "/boutique/thumb/martini.webp", "full": "/boutique/full/martini.webp"}]'::jsonb, 13),
  ('mini-table-pois', 'Mini-table à pois', 'art-de-la-table', null, '[{"thumb": "/boutique/thumb/mini_table.webp", "full": "/boutique/full/mini_table.webp"}, {"thumb": "/boutique/thumb/mini_table_2.webp", "full": "/boutique/full/mini_table_2.webp"}]'::jsonb, 14),
  ('plateaux-visages', 'Plateaux Visages', 'art-de-la-table', 'visage', '[{"thumb": "/boutique/thumb/porte_bijoux_all.webp", "full": "/boutique/full/porte_bijoux_all.webp"}, {"thumb": "/boutique/thumb/porte_bijoux_all_2.webp", "full": "/boutique/full/porte_bijoux_all_2.webp"}]'::jsonb, 15),
  ('cuillere-etoile', 'Cuillère Étoile', 'cuilleres', null, '[{"thumb": "/boutique/thumb/cuillere_etoile.webp", "full": "/boutique/full/cuillere_etoile.webp"}, {"thumb": "/boutique/thumb/cuillere_etoile_2.webp", "full": "/boutique/full/cuillere_etoile_2.webp"}, {"thumb": "/boutique/thumb/cuillere_etoile_3.webp", "full": "/boutique/full/cuillere_etoile_3.webp"}]'::jsonb, 16),
  ('cuillere-fleur', 'Cuillère Fleur & sa coupelle', 'cuilleres', 'fleurs', '[{"thumb": "/boutique/thumb/cuillere_fleurs.webp", "full": "/boutique/full/cuillere_fleurs.webp"}]'::jsonb, 17),
  ('collection-cuilleres', 'Collection de cuillères peintes', 'cuilleres', null, '[{"thumb": "/boutique/thumb/cuillere_1.webp", "full": "/boutique/full/cuillere_1.webp"}, {"thumb": "/boutique/thumb/cuillere_2.webp", "full": "/boutique/full/cuillere_2.webp"}, {"thumb": "/boutique/thumb/cuillere_size.webp", "full": "/boutique/full/cuillere_size.webp"}, {"thumb": "/boutique/thumb/cuilleres_all.webp", "full": "/boutique/full/cuilleres_all.webp"}, {"thumb": "/boutique/thumb/cuilleres_all_2.webp", "full": "/boutique/full/cuilleres_all_2.webp"}]'::jsonb, 18),
  ('duo-poussins', 'Duo de poussins', 'figurines', null, '[{"thumb": "/boutique/thumb/poussin_1.webp", "full": "/boutique/full/poussin_1.webp"}, {"thumb": "/boutique/thumb/poussin_2.webp", "full": "/boutique/full/poussin_2.webp"}]'::jsonb, 19),
  ('jeu-morpion-poussins', 'Jeu de morpion Poussins', 'figurines', null, '[{"thumb": "/boutique/thumb/morpion_poussins.webp", "full": "/boutique/full/morpion_poussins.webp"}, {"thumb": "/boutique/thumb/morpion_poussins_2.webp", "full": "/boutique/full/morpion_poussins_2.webp"}]'::jsonb, 20)
) as v (slug, nom, cat, coll, images, ordre)
left join categories c on c.slug = v.cat
left join collections co on co.slug = v.coll
left join produit_prix pp on pp.slug = v.slug
on conflict (slug) do nothing;
