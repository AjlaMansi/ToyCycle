import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useTranslation } from "react-i18next";

const BACKEND_URL = "https://toycycle-production.up.railway.app";

export default function ScanScreen() {
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setImage(res.assets[0].uri);
  }

  async function scanToy() {
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        name: "toy.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("lang", i18n.language);
      const { data } = await axios.post(`${BACKEND_URL}/scan`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data.data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
          <Text>{t('age')}: {result.age_range}</Text>
          <Text style={{marginTop:8}}>{result.description}</Text>
          {result.benefits && <Text style={{marginTop:8, fontWeight:'bold'}}>✅ {t('benefits')}:</Text>}
          {result.benefits?.map((b: string, i: number) => <Text key={i}>• {b}</Text>)}
          {result.risks && <Text style={{marginTop:8, fontWeight:'bold'}}>⚠️ {t('risks')}:</Text>}
          {result.risks?.map((r: string, i: number) => <Text key={i}>• {r}</Text>)}
          {result.skills_developed && <Text style={{marginTop:8, fontWeight:'bold'}}>🧠 {t('skills')}:</Text>}
          {result.skills_developed?.map((s: string, i: number) => <Text key={i}>• {s}</Text>)}
          {result.supervision_required && <Text style={{marginTop:8}}>👁️ {t('supervision')}: {result.supervision_required}</Text>}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  btn: { backgroundColor: "#2e7d32", padding: 14, borderRadius: 8, marginBottom: 12 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 8, padding: 12, marginBottom: 40 },
  cardTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 4 },
});