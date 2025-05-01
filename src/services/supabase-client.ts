import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Configuration explicite et détaillée
const supabaseConfig = {
  supabaseUrl:
    import.meta.env?.VITE_SUPABASE_URL ||
    process.env?.SUPABASE_URL ||
    window.ENV?.VITE_SUPABASE_URL ||
    "https://itrimxcpgeksvbegfwmf.supabase.co",

  supabaseAnonKey:
    import.meta.env?.VITE_SUPABASE_ANON_KEY ||
    process.env?.SUPABASE_ANON_KEY ||
    window.ENV?.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cmlteGNwZ2Vrc3ZiZWdmd21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTQwMTUsImV4cCI6MjA1OTk3MDAxNX0.6fWQkYMq3vtD-oJnsooDiHR5fU8WsnLSB83G0Cpi2NQ",
};

console.error("Supabase Configuration Debug:", {
  url: supabaseConfig.supabaseUrl,
  anonKeyLength: supabaseConfig.supabaseAnonKey.length,
  origin: window.location.origin,
});

export const supabase = createClient<Database>(
  supabaseConfig.supabaseUrl,
  supabaseConfig.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
    },
    global: {
      headers: {
        "Access-Control-Allow-Origin": "https://benin-culture-360.pages.dev",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
      },
    },
  },
);

// Gestionnaire d'erreurs détaillé
supabase.auth.onAuthStateChange((event, session) => {
  console.error("Auth State Change:", {
    event,
    session,
    url: supabaseConfig.supabaseUrl,
    origin: window.location.origin,
  });
});
