import { createClient } from '@supabase/supabase-js';

// Use environment variables if present, otherwise use placeholders to prevent crash.
// Note: Real functionality requires actual Supabase credentials.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
