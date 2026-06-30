import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://wvcieaemzlavvomigeju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Y2llYWVtemxhdnZvbWlnZWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjAyOTMsImV4cCI6MjA5ODI5NjI5M30.jZb902rk_lSiaTdDX3QHfBMGlxTFeRmf6LXDXJZ2BI4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});