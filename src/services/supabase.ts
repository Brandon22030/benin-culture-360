import { supabase } from './supabase-client';
import type { Database } from '@/types/database.types';
import { uploadImage } from './storage';

// Profiles
const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error in getProfile:', error);
    return null;
  }
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
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
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
  getArticleById
};
