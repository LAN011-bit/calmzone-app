import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco de dados
export interface Post {
  id: string;
  user_hash: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
  liked_by?: string[]; // Array de user_hashes que curtiram
}

export interface Message {
  id: string;
  user_hash: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
}

export interface Mood {
  id: string;
  user_hash: string;
  mood: 'feliz' | 'neutro' | 'triste' | 'ansioso' | 'calmo';
  note?: string;
  created_at: string;
}
