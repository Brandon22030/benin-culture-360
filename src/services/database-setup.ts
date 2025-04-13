import { supabase } from './supabase-client';

export const setupDatabase = async () => {
  try {
    // Vérifie si la table profiles existe
    const { data: tableExists, error: tableError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (tableError?.code === '42P01') { // Code d'erreur pour "table does not exist"
      console.log('Creating profiles table...');
      
      // Crée la table profiles
      const { error: createError } = await supabase
        .rpc('create_profiles_table');

      if (createError) {
        throw createError;
      }
    }

    // Configure les politiques RLS
    const { error: policyError } = await supabase
      .rpc('setup_profiles_policies');

    if (policyError) {
      throw policyError;
    }

    console.log('Database setup completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, error };
  }
};
