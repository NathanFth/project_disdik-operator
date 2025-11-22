"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Client Supabase khusus komponen React (use client)
export const supabase = createClientComponentClient();
