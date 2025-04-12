-- Drop existing foreign key if it exists
ALTER TABLE public.articles
DROP CONSTRAINT IF EXISTS articles_author_id_fkey;

-- Create foreign key reference to auth.users
ALTER TABLE public.articles
ADD CONSTRAINT articles_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Create a secure view for user data
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
    id,
    email,
    raw_user_meta_data
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.user_profiles TO authenticated, anon;

-- Modify the articles query to use the view
CREATE OR REPLACE FUNCTION get_article_author(article_row articles)
RETURNS json AS $$
  SELECT json_build_object(
    'email', u.email,
    'raw_user_meta_data', u.raw_user_meta_data
  )
  FROM public.user_profiles u
  WHERE u.id = article_row.author_id;
$$ LANGUAGE sql SECURITY DEFINER;
