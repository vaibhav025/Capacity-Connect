import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.local';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';
export const supabase = createClient(url, key);
export const isDemo = !import.meta.env.VITE_SUPABASE_URL;
