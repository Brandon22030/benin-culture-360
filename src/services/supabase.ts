import { supabase } from './supabase-client';
import type { Database } from '@/types/database.types';
import { uploadImage } from './storage';

// Profiles
const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

const updateProfile = async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
};

// Articles
const createArticle = async (article: Database['public']['Tables']['articles']['Insert']) => {
  console.log('Creating article with data:', article);
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      cultures (*),
      profiles:author_id (
        username,
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Keep only one export of this function
export const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      cultures (*),
      profiles:author_id (
        username,
        full_name
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Cultures
const getCultures = async () => {
  const { data, error } = await supabase
    .from('cultures')
    .select('*');

  if (error) throw error;
  return data;
};

const createCulture = async (culture: Database['public']['Tables']['cultures']['Insert']) => {
  const { data, error } = await supabase
    .from('cultures')
    .insert(culture)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getCultureById = async (id: string) => {
  const { data, error } = await supabase
    .from('cultures')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

const isArticleEditable = (createdAt: string) => {
  const articleDate = new Date(createdAt);
  const now = new Date();
  const diffInHours = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

const updateArticle = async (articleId: string, updates: Database['public']['Tables']['articles']['Update']) => {
  const { data: article } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        username,
        full_name
      )
    `)
    .eq('id', articleId)
    .single();

  if (!article) throw new Error('Article non trouvé');
  if (!isArticleEditable(article.created_at)) throw new Error('L\'article ne peut plus être modifié après 24h');

  const { error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', articleId);

  if (error) throw error;
};

export {
  supabase,
  uploadImage,
  getProfile,
  updateProfile,
  getCultures,
  createArticle,
  createCulture,
  getCultureById,
  getArticles,
  updateArticle,
  isArticleEditable
};
