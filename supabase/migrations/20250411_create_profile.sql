-- Insérer le profil s'il n'existe pas déjà
INSERT INTO public.profiles (id, username, full_name)
VALUES (
  '829d0c64-5f7c-4c10-9d76-c0f766cfdbf2',  -- votre ID utilisateur
  'brandon22030',                            -- nom d'utilisateur par défaut
  'Brandon Medehou'                          -- nom complet
)
ON CONFLICT (id) DO UPDATE
SET 
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name;

-- Maintenant on peut ajouter la contrainte de clé étrangère
ALTER TABLE public.articles
DROP CONSTRAINT IF EXISTS articles_author_id_fkey;

ALTER TABLE public.articles
ADD CONSTRAINT articles_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES public.profiles(id)
ON DELETE SET NULL;
