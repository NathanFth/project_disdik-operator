import { supabase } from '@/lib/supabase/lib/client';

export const authService = {
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, message: 'Terjadi kesalahan sistem' };
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async getSession() {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (err) {
      return null;
    }
  },

  async getUser() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id_profile', user.id)
        .single();

      if (profileError) {
        console.error('Gagal mengambil profile:', profileError.message);
        return { ...user, role: null, profile: null };
      }

      return {
        ...user,
        profile: profile,
        role: profile?.role,
      };
    } catch (err) {
      return null;
    }
  },
};
