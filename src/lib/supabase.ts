// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your-supabase-url'; // Replace with your Supabase URL
const supabaseKey = 'your-supabase-key'; // Replace with your Supabase Key
export const supabase = createClient(supabaseUrl, supabaseKey);
