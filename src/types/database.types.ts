export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          culture_id: string | null;
          author_id: string;
          created_at: string | null;
          updated_at: string | null;
          image_url: string | null;
          title: string;
          content: string;
        };
        Insert: {
          id?: string;
          culture_id?: string | null;
          author_id: string;
          created_at?: string | null;
          updated_at?: string | null;
          image_url?: string | null;
          title: string;
          content: string;
        };
        Update: {
          id?: string;
          culture_id?: string | null;
          author_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          image_url?: string | null;
          title?: string;
          content?: string;
        };
      };
      cultures: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          region: string | null;
          image_url: string | null;
          author_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          region?: string | null;
          image_url?: string | null;
          author_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          region?: string | null;
          image_url?: string | null;
          author_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      galleries: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: string;
          region: string;
          credit: string | null;
          contributor_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          category: string;
          region: string;
          credit?: string | null;
          contributor_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          category?: string;
          region?: string;
          credit?: string | null;
          contributor_id?: string | null;
          created_at?: string | null;
        };
      };
      gallery_pending: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: string;
          region: string;
          credit: string | null;
          source: string | null;
          contributor_id: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          category: string;
          region: string;
          credit?: string | null;
          source?: string | null;
          contributor_id?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          category?: string;
          region?: string;
          credit?: string | null;
          source?: string | null;
          contributor_id?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      music: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          audio_url: string;
          image_url: string | null;
          category: string;
          region: string;
          credit: string | null;
          contributor_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          audio_url: string;
          image_url?: string | null;
          category: string;
          region: string;
          credit?: string | null;
          contributor_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          audio_url?: string;
          image_url?: string | null;
          category?: string;
          region?: string;
          credit?: string | null;
          contributor_id?: string | null;
          created_at?: string | null;
        };
      };
      music_pending: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          audio_url: string;
          image_url: string | null;
          category: string;
          region: string;
          credit: string | null;
          source: string | null;
          contributor_id: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          audio_url: string;
          image_url?: string | null;
          category: string;
          region: string;
          credit?: string | null;
          source?: string | null;
          contributor_id?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          audio_url?: string;
          image_url?: string | null;
          category?: string;
          region?: string;
          credit?: string | null;
          source?: string | null;
          contributor_id?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string | null;
          updated_at: string | null;
          role: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          role?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          role?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}


export type Culture = Database['public']['Tables']['cultures']['Row'];
export type Article = Database['public']['Tables']['articles']['Row'];
