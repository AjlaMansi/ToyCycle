import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'https://toycycle-production.up.railway.app';

export default function ScanScreen() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const res = await ImagePicker.launchCameraAsync({ base64: false, quality: 0.7 });
    if (!res.canceled) setImage(res.assets[0].uri);
  }

  async function scanToy() {
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', { uri: image, name: 'toy.jpg', type: 'image/jpeg' });
      const { data } = await axios.post(`${BACKEND_URL}/scan`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data.data);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('scan')}</Text>
      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>📷 Fotografo lodrën</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image}/>}
      {image && (
        <TouchableOpacity style={styles.btn} onPress={scanToy}>
          <Text style={styles.btnText}>🔍 Skano me AI</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" color="#2e7d32"/>}
      {result && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{result.name}</Text>
          <Text>{result.brand} · {result.category}</Text>
          <Text>Mosha: {result.age_range}</Text>
          <Text style={{marginTop:8}}>{result.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  btn: { backgroundColor: '#2e7d32', padding: 14, borderRadius: 8, marginBottom: 12 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 12 },
  cardTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 }
});