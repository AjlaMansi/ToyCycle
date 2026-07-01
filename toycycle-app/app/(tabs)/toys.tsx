import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { supabase } from "../../src/services/supabase";
import { useTranslation } from "react-i18next";
import { showImageWarning } from "../../src/components/safetyWarning";
import { pickAndUploadImage } from "../../src/services/uploadMedia";

type Toy = {
  id: string;
  name: string;
  brand: string;
  category: string;
  condition: string;
  status: "donate" | "request" | "exchange";
  image_url?: string | null;
  profiles: { full_name: string } | null;
};

export default function ToysScreen() {
  const { t, i18n } = useTranslation();
  const [toys, setToys] = useState<Toy[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [expandedToy, setExpandedToy] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState<"donate" | "request" | "exchange">(
    "donate",
  );

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id ?? null);
      loadToys();
    };

    init();
  }, []);

  async function loadToys() {
    const { data } = await supabase
      .from("toys")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });
    setToys(data || []);
  }
  function toggleToyExpand(id: string) {
    setExpandedToy((prev) => (prev === id ? null : id));
  }
  async function addToy() {
    if (!name.trim()) return;

    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id;

    if (!userId) {
      Alert.alert("Error", "No user session found");
      return;
    }

    const { error } = await supabase.from("toys").insert({
      name,
      brand,
      category,
      condition,
      status,
      user_id: userId,
      image_url: imageUrl,
    });

    if (error) return Alert.alert("Error", error.message);

    setName("");
    setBrand("");
    setCategory("");
    setCondition("");
    setImageUrl(null);
    setStatus("donate");
    setShowModal(false);
    loadToys();
  }

  const statusColor = {
    donate: "#2e7d32",
    request: "#1565c0",
    exchange: "#e65100",
  };
  const statusLabel = {
    donate: t("donate"),
    request: t("request_toy"),
    exchange: t("exchange"),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("toys")}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() =>
              i18n.changeLanguage(i18n.language === "sq" ? "en" : "sq")
            }
          >
            <Text style={styles.lang}>
              {i18n.language === "sq" ? "EN" : "SQ"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={toys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isExpanded = expandedToy === item.id;
          return (
            <TouchableOpacity onPress={() => toggleToyExpand(item.id)}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: statusColor[item.status] },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {statusLabel[item.status]}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardSub}>
                  {item.profiles?.full_name || "Anonymous"}
                </Text>
                {item.brand || item.category ? (
                  <Text>
                    {item.brand}
                    {item.category ? ` · ${item.category}` : ""}
                  </Text>
                ) : null}
                {item.condition ? (
                  <Text style={styles.condition}>{item.condition}</Text>
                ) : null}
                {item.image_url && isExpanded && (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.toyImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>{t("no_toys")}</Text>}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{t("add_toy")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("toy_name")}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder={t("toy_brand")}
              value={brand}
              onChangeText={setBrand}
            />
            <TextInput
              style={styles.input}
              placeholder={t("toy_category")}
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              style={styles.input}
              placeholder={t("toy_condition")}
              value={condition}
              onChangeText={setCondition}
            />
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#1565c0" }]}
              onPress={() =>
                showImageWarning(async () => {
                  const url = await pickAndUploadImage();
                  if (url) setImageUrl(url);
                })
              }
            >
              <Text style={styles.btnText}>📸 Add Toy Image</Text>
            </TouchableOpacity>
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={styles.toyImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.statusRow}>
              {(["donate", "request", "exchange"] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusBtn,
                    { backgroundColor: status === s ? statusColor[s] : "#eee" },
                  ]}
                  onPress={() => setStatus(s)}
                >
                  <Text
                    style={{
                      color: status === s ? "#fff" : "#555",
                      fontSize: 12,
                    }}
                  >
                    {statusLabel[s]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.btn} onPress={addToy}>
              <Text style={styles.btnText}>{t("submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 22, fontWeight: "bold" },
  lang: { color: "#888", fontWeight: "600" },
  addBtn: {
    backgroundColor: "#2e7d32",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontSize: 24, lineHeight: 28 },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: { fontWeight: "bold", fontSize: 16, flex: 1 },
  cardSub: { color: "#888", fontSize: 12, marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  condition: { color: "#555", marginTop: 4, fontSize: 13 },
  empty: { textAlign: "center", color: "#aaa", marginTop: 40 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  toyImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  statusRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  statusBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  btn: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  cancelText: { textAlign: "center", color: "#888", padding: 8 },
});
