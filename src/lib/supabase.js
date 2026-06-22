import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = window.__ENV?.SUPABASE_URL  || '';
const supabaseKey  = window.__ENV?.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
