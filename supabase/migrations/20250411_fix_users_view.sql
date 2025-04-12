-- Drop the view if it exists
drop view if exists public.users;

-- Create the view with proper schema reference
create view public.users as
select 
  id,
  email,
  raw_user_meta_data
from auth.users;

-- Grant access to the view
grant select on public.users to authenticated;
grant select on public.users to anon;

-- Verify the view exists and has data
select count(*) from public.users;
