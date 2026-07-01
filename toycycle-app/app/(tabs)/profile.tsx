import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../../src/services/supabase";
import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) return;

      const user = data.session.user;

      setEmail(user.email || "");
      setUserId(user.id);

      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, city, phone")
        .eq("id", user.id)
        .single();

      if (p) {
        setFullName(p.full_name || "");
        setCity(p.city || "");
        setPhone(p.phone || "");
      }
    };

    init();
  }, []);

  async function saveProfile() {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, city, phone })
      .eq("id", userId);
    if (error) return Alert.alert("Error", error.message);
    setEditing(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("profile")}</Text>
        <TouchableOpacity
          onPress={() =>
            i18n.changeLanguage(i18n.language === "sq" ? "en" : "sq")
          }
        >
          <Text style={styles.lang}>
            {i18n.language === "sq" ? "EN" : "SQ"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.info}>📧 {email}</Text>
        {editing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder={t("full_name")}
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder={t("city")}
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.input}
              placeholder={t("phone")}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.btn} onPress={saveProfile}>
              <Text style={styles.btnText}>{t("submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Text style={styles.cancel}>{t("cancel")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>{fullName || "—"}</Text>
            {city ? <Text style={styles.info}>📍 {city}</Text> : null}
            {phone ? <Text style={styles.info}>📞 {phone}</Text> : null}
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#1565c0", marginTop: 8 }]}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.btnText}>
                ✏️ {t("edit_profile") || "Edit"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>{t("logout")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  lang: { color: "#888", fontWeight: "600" },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  info: { fontSize: 15, color: "#555", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  btn: {
    backgroundColor: "#c62828",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  cancel: { textAlign: "center", color: "#888", padding: 8 },
});
