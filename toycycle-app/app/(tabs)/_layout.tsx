import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t('community') }}/>
      <Tabs.Screen name="toys" options={{ title: t('toys') }}/>
      <Tabs.Screen name="scan" options={{ title: t('scan') }}/>
      <Tabs.Screen name="profile" options={{ title: t('profile') }}/>
    </Tabs>
  );
}