import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../../src/services/supabase";
import { useTranslation } from "react-i18next";
import { showImageWarning } from "../../src/components/safetyWarning";
import { pickAndUploadImage } from "../../src/services/uploadMedia";

type Post = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  image_url?: string | null;   // 👈 ADD THIS
  profiles: { full_name: string } | null;
  post_likes: { id: string; user_id: string }[];
};

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id ?? null);
      loadPosts();
    };

    init();
  }, []);

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles(full_name), post_likes(id, user_id)")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  }

  async function createPost() {
    if (!title.trim() || !body.trim()) return;

    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id;
    setImageUrl(null);

    if (!userId) {
      Alert.alert("Error", "No user session found");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      title,
      body,
      user_id: userId,
      image_url: imageUrl,
    });

    if (error) return Alert.alert("Error", error.message);

    setTitle("");
    setBody("");
    setImageUrl(null);
    setShowModal(false);
    loadPosts();
  }

  async function toggleLike(post: Post) {
    if (!userId) return;
    const liked = post.post_likes.some((l) => l.user_id === userId);
    if (liked)
      await supabase
        .from("post_likes")
        .delete()
        .match({ post_id: post.id, user_id: userId });
    else
      await supabase
        .from("post_likes")
        .insert({ post_id: post.id, user_id: userId });
    loadPosts();
  }

  async function loadComments(postId: string) {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(full_name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments((prev) => ({ ...prev, [postId]: data || [] }));
  }

  async function addComment(postId: string) {
    if (!newComment.trim()) return;
    await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: userId, body: newComment });
    setNewComment("");
    loadComments(postId);
  }

  function toggleExpand(postId: string) {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }
    setExpandedPost(postId);
    loadComments(postId);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("community")}</Text>
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
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          
          const liked = item.post_likes.some((l) => l.user_id === userId);
          const isExpanded = expandedPost === item.id;
          
          return (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>
                {item.profiles?.full_name || "Anonymous"}
              </Text>
              <Text style={styles.cardBody}>{item.body}</Text>
              {item.image_url && isExpanded && (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.postImage}
                />
              )}
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => toggleLike(item)}>
                  <Text style={{ color: liked ? "#e53935" : "#aaa" }}>
                    {liked ? "❤️" : "🤍"} {item.post_likes.length}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                  <Text style={styles.commentToggle}>
                    💬 {t("comments")} {isExpanded ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
              </View>
              {isExpanded && (
                <View style={styles.commentsSection}>
                  {(comments[item.id] || []).map((c) => (
                    <View key={c.id} style={styles.commentRow}>
                      <Text style={styles.commentAuthor}>
                        {c.profiles?.full_name || "Anonymous"}:{" "}
                      </Text>
                      <Text style={{ flex: 1 }}>{c.body}</Text>
                    </View>
                  ))}
                  <View style={styles.commentInput}>
                    <TextInput
                      style={styles.commentField}
                      placeholder={t("add_comment")}
                      value={newComment}
                      onChangeText={setNewComment}
                    />
                    <TouchableOpacity
                      onPress={() => addComment(item.id)}
                      style={styles.sendBtn}
                    >
                      <Text style={{ color: "#fff" }}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>{t("no_posts")}</Text>}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modal}>
            
            <Text style={styles.modalTitle}>{t("create_post")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("post_title")}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder={t("post_body")}
              value={body}
              onChangeText={setBody}
              multiline
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
              <Text style={styles.btnText}>📸 Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={createPost}>
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
  postImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10,
    marginTop: 10,
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
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardSub: { color: "#888", marginBottom: 4, fontSize: 12 },
  cardBody: { marginBottom: 8 },
  cardActions: { flexDirection: "row", gap: 16 },
  commentToggle: { color: "#555" },
  commentsSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  commentRow: { flexDirection: "row", marginBottom: 4 },
  commentAuthor: { fontWeight: "600", fontSize: 13 },
  commentInput: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  commentField: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 6,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: "#2e7d32",
    padding: 8,
    borderRadius: 6,
    marginLeft: 6,
  },
  empty: { textAlign: "center", color: "#aaa", marginTop: 40 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
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
  btn: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  cancelText: { textAlign: "center", color: "#888", padding: 8 },
});
