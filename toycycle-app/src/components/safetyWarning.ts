import { Alert } from "react-native";

export function showImageWarning(onConfirm: () => void) {
  Alert.alert(
    "⚠️ Safety Warning",
    "Do not upload images of children. This app protects privacy and safety.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: onConfirm }
    ]
  );
}