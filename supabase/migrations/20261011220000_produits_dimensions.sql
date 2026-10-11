-- Dimensions des pièces dans leur propre champ : la description redevient un vrai texte.
alter table produits add column if not exists dimensions text;

-- Léa avait saisi les dimensions dans « description » (ex. « 14x7cm », « 13x11.5x5cm ») :
-- on les déplace dans « dimensions » et la description repasse au texte par défaut du type de pièce.
update produits
set dimensions = trim(description), description = null
where dimensions is null
  and description ~* '^\s*[0-9]+([.,][0-9]+)?\s*x\s*[0-9]+([.,][0-9]+)?(\s*x\s*[0-9]+([.,][0-9]+)?)?\s*(cm)?\s*$';
