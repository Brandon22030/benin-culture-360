-- Create tables
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.cultures (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  region text,
  image_url text,
  author_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  culture_id uuid references public.cultures not null,
  author_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.cultures enable row level security;
alter table public.articles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Cultures policies
create policy "Cultures are viewable by everyone"
  on public.cultures for select
  using (true);

create policy "Users can insert cultures"
  on public.cultures for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own cultures"
  on public.cultures for update using (
    auth.uid() = author_id
  );

-- Articles policies
create policy "Articles are viewable by everyone"
  on public.articles for select
  using (true);

create policy "Users can insert articles"
  on public.articles for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own articles"
  on public.articles for update using (
    auth.uid() = author_id
  );
