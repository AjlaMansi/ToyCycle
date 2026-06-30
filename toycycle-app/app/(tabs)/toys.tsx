import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../src/services/supabase';
import { useTranslation } from 'react-i18next';

export default function ToysScreen() {
  const { t } = useTranslation();
  type Toy = { id: string; name: string; brand: string; category: string; condition: string; }
  const [toys, setToys] = useState<Toy[]>([]);

  useEffect(() => {
    supabase.from('toys').select('*').then(({ data }) => setToys(data || []));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('toys')}</Text>
      <FlatList
        data={toys}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text>{item.brand} · {item.category}</Text>
            <Text style={styles.condition}>{item.condition}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nuk ka lodra ende.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 12, marginBottom: 10 },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  condition: { color: '#2e7d32', marginTop: 4 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 }
});