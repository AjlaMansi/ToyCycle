import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigation.replace('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile')}</Text>
      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Dilni</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  btn: { backgroundColor: '#c62828', padding: 14, borderRadius: 8 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});