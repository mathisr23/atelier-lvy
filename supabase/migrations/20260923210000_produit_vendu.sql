-- Statut "vendu" par pièce — chaque pièce étant unique, il faut pouvoir la retirer de la vente
-- dès qu'elle part, sans la supprimer du catalogue (elle reste visible comme portfolio).
alter table produit_prix add column if not exists vendu boolean not null default false;
