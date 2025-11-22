// lib/supabase/admin.ts
import { createServerClient } from '@supabase/ssr';
// Perhatikan: Ini BUKAN dari 'auth-helpers', tapi '@supabase/ssr' atau 'supabase-js'
// untuk client service role. Kita gunakan 'supabase-js' untuk kesederhanaan.
import { createClient } from '@supabase/supabase-js';

// Ganti dengan path tipe Anda jika ada
// import { Database } from '@/types/supabase';

// Validasi bahwa environment variables ada
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseServiceRoleKey) {
  throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");
}

/**
 * Ini adalah client Supabase ADMIN (Service Role) untuk SERVER-SIDE.
 * Client ini bisa melewati Row Level Security (RLS).
 * * !! PERINGATAN !!
 * JANGAN PERNAH impor atau gunakan ini di Client Component (file 'use client').
 * Ini HANYA untuk digunakan di Route Handlers (app/api) atau Server Actions.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);