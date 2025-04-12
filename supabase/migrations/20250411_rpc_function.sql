-- Create a function to get user info
create or replace function get_user_info(user_id uuid)
returns json
language sql
security definer
set search_path = public
as $$
  select 
    json_build_object(
      'email', email,
      'raw_user_meta_data', raw_user_meta_data
    )
  from auth.users
  where id = user_id;
$$;
