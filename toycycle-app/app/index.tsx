import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../src/services/supabase';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    else router.replace('/(tabs)');
  }

  async function handleRegister() {
    if (!fullName.trim()) return Alert.alert('Error', t('name_required'));
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, city, phone } }
    });
    if (error) Alert.alert('Error', error.message);
    else { Alert.alert('OK', t('check_email')); setIsRegistering(false); }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('welcome')}</Text>
      <TouchableOpacity onPress={() => i18n.changeLanguage(i18n.language === 'sq' ? 'en' : 'sq')}>
        <Text style={styles.lang}>{i18n.language === 'sq' ? 'English' : 'Shqip'}</Text>
      </TouchableOpacity>
      {isRegistering && (
        <>
          <TextInput style={styles.input} placeholder={t('full_name')} value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder={t('city')} value={city} onChangeText={setCity} />
          <TextInput style={styles.input} placeholder={t('phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </>
      )}
      <TextInput style={styles.input} placeholder={t('email')} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder={t('password')} value={password} onChangeText={setPassword} secureTextEntry />
      {isRegistering ? (
        <>
          <TouchableOpacity style={styles.btn} onPress={handleRegister}>
            <Text style={styles.btnText}>{t('register')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRegistering(false)}>
            <Text style={styles.switchText}>{t('back_to_login')}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>{t('login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#555' }]} onPress={() => setIsRegistering(true)}>
            <Text style={styles.btnText}>{t('register')}</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  lang: { textAlign: 'center', marginBottom: 16, color: '#888' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2e7d32', padding: 14, borderRadius: 8, marginBottom: 10 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  switchText: { textAlign: 'center', color: '#888', padding: 8 },
});