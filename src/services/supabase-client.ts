import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Ajoutez une déclaration globale pour window.ENV
declare global {
  interface Window {
    ENV?: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  }
}

const supabaseUrl = 
  import.meta.env?.VITE_SUPABASE_URL || 
  process.env?.SUPABASE_URL || 
  window.ENV?.VITE_SUPABASE_URL ||
  'https://itrimxcpgeksvbegfwmf.supabase.co';

const supabaseAnonKey = 
  import.meta.env?.VITE_SUPABASE_ANON_KEY || 
  process.env?.SUPABASE_ANON_KEY || 
  window.ENV?.VITE_SUPABASE_ANON_KEY ||
  'votre_clé_anonyme';

console.log('Resolved Supabase URL:', supabaseUrl);
console.log('Resolved Supabase Anon Key:', supabaseAnonKey ? '[REDACTED]' : 'MISSING');

if (!supabaseUrl) {
  console.error('Supabase URL is missing from all sources');
  throw new Error('Supabase URL is required. Please check your environment variables.');
}

if (!supabaseAnonKey) {
  console.error('Supabase Anon Key is missing from all sources');
  throw new Error('Supabase Anon Key is required. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);