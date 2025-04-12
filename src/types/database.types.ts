export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Culture = {
  id: string;
  name: string;
  description: string | null;
  region: string | null;
  image_url: string | null;
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  culture_id: string;
  author_id: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'created_at'>>;
      };
      cultures: {
        Row: Culture;
        Insert: Omit<Culture, 'id' | 'created_at'>;
        Update: Partial<Omit<Culture, 'id' | 'created_at'>>;
      };
      articles: {
        Row: Article;
        Insert: Omit<Article, 'id' | 'created_at'>;
        Update: Partial<Omit<Article, 'id' | 'created_at'>>;
      };
    };
  };
};
