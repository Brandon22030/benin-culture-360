import { createClient } from '@supabase/supabase-js';

// Créez un client Supabase avec la clé service (pas la clé anon)
const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_KEY // Vous devez ajouter cette clé dans votre .env
);

export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
};

export const deleteUsers = async (userIds: string[]) => {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUsers(userIds);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting users:', error);
    return { success: false, error };
  }
};
