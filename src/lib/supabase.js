import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// supabase client — null if env vars not configured yet (falls back to localStorage)
export const supabase = url && key ? createClient(url, key) : null;
export const isSupabaseReady = !!(url && key);
