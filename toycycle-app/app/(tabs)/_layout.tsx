import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#f6fff7", "#e8f5e9", "#ffffff"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarItemStyle: {
              marginTop: 4,
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={22} color={color} />
            ),
            headerShown: false,
            tabBarActiveTintColor: "#4A90E2",
            tabBarInactiveTintColor: "#999",
            tabBarStyle: {
              backgroundColor: "#fff",
              borderTopWidth: 0,
              elevation: 10,
              height: 70,
              paddingBottom: 10,
              paddingTop: 6,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginBottom: 5,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: t("community"),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="toys"
            options={{
              title: t("toys"),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cube-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="scan"
            options={{
              title: t("scan"),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="scan-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: t("profile"),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </LinearGradient>
  );
}
