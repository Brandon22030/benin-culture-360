-- Create policies if they don't exist
DO $$ 
BEGIN
    -- Create policies for articles table
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'articles' 
        AND policyname = 'Articles are viewable by everyone'
    ) THEN
        create policy "Articles are viewable by everyone"
        on public.articles for select
        using (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'articles' 
        AND policyname = 'Users can insert articles'
    ) THEN
        create policy "Users can insert articles"
        on public.articles for insert
        with check (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'articles' 
        AND policyname = 'Users can update their own articles'
    ) THEN
        create policy "Users can update their own articles"
        on public.articles for update using (
            auth.uid() = author_id
        );
    END IF;

END $$;
