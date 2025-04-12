-- Create a bucket for culture images
insert into storage.buckets (id, name, public)
values ('cultures', 'cultures', true);

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert
with check (
  bucket_id = 'cultures' and
  auth.role() = 'authenticated'
);

-- Allow public access to view images
create policy "Anyone can view images"
on storage.objects for select
using (bucket_id = 'cultures');
