import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function LoginScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    else navigation.replace('Main');
  }

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('OK', 'Kontrolloni emailin tuaj!');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('welcome')}</Text>
      <TouchableOpacity onPress={() => i18n.changeLanguage(i18n.language === 'sq' ? 'en' : 'sq')}>
        <Text style={styles.lang}>{i18n.language === 'sq' ? 'English' : 'Shqip'}</Text>
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder={t('email')} value={email} onChangeText={setEmail} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder={t('password')} value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>{t('login')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, {backgroundColor: '#555'}]} onPress={handleRegister}>
        <Text style={styles.btnText}>{t('register')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  lang: { textAlign: 'center', marginBottom: 16, color: '#888' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2e7d32', padding: 14, borderRadius: 8, marginBottom: 10 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});