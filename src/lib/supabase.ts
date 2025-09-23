
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anonymous Key');
  console.error('Please make sure you have connected your Supabase project in Lovable');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
