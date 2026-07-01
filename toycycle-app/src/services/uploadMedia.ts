import * as ImagePicker from "expo-image-picker";
import { supabase } from "./supabase";
import { decode } from "base64-arraybuffer";

export async function pickAndUploadImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.8,
    base64: true,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  const fileName = `${Date.now()}.jpg`;

  if (!asset.base64) return null;

  const { error } = await supabase.storage
    .from("toy-media")
    .upload(fileName, decode(asset.base64), {
      contentType: "image/jpeg",
    });
  if (error) throw error;

  const { data } = supabase.storage.from("toy-media").getPublicUrl(fileName);

  return data.publicUrl;
}
