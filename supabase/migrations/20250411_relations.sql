-- Add foreign key constraints for relationships
alter table public.articles
add constraint articles_author_id_fkey
foreign key (author_id)
references auth.users (id);

alter table public.articles
add constraint articles_culture_id_fkey
foreign key (culture_id)
references public.cultures (id);

-- Enable row level security
alter table public.articles enable row level security;

-- Create policies
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
