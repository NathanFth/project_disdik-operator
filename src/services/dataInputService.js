import { supabase } from '@/lib/supabase/lib/client';

export const dataInputService = {
  async submitData(schoolType, formData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const payload = {
        user_id: user.id,
        school_type: schoolType,
        npsn: formData.npsn,
        report_data: formData,
        status: 'submitted',
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('school_reports')
        .upsert(payload, { onConflict: 'npsn' })
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  },

  async getKecamatan() {
    return [
      'Garut Kota',
      'Karangpawitan',
      'Wanaraja',
      'Tarogong Kaler',
      'Tarogong Kidul',
      'Banyuresmi',
      'Samarang',
      'Pasirwangi',
    ];
  },
};
