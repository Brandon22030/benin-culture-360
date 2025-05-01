import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

console.log('Environment Variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  PROCESS_SUPABASE_URL: process.env.SUPABASE_URL,
  PROCESS_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
});

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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