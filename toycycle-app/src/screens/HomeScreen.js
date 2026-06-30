import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../services/supabase';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    supabase.from('posts').select('*, profiles(full_name)').order('created_at', { ascending: false })
      .then(({ data }) => setPosts(data || []));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('community')}</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.profiles?.full_name || 'Anonymous'}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nuk ka postime ende.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 12, marginBottom: 10 },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardSub: { color: '#888', marginBottom: 4 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 }
});