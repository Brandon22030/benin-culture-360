-- Create a view to expose user data safely
create or replace view public.users as
select 
  id,
  email,
  raw_user_meta_data
from auth.users;

-- Grant access to the view
grant select on public.users to authenticated, anon;

-- Update articles query to use public.users
create policy "Allow users to view article authors"
  on public.users
  for select
  using (true);
