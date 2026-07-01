import { Stack } from 'expo-router';
import '../src/i18n';
import { useEffect } from 'react';
import { supabase } from '../src/services/supabase';


export default function RootLayout() {
  useEffect(() => {
  supabase.auth.getSession();
}, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}