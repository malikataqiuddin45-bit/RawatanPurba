import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, Share, Pressable, ScrollView, Animated, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

type Props = {
  number?: number | null;
  meaning?: string | null;
  name?: string | null;   // <-- penting
};

export default function HasilKad({ number, meaning, name }: Props) {
  const visible = !!number;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    if (visible) Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [number]);

  // Share/Copy text: sertakan Nama (jika ada)
  const shareMessage = useMemo(() => {
    if (!number) return "";
    const lines = [
      "Forensik Nama Belerang Merah",
      name && name.trim().length ? `Nama: ${name}` : undefined,
      `Nombor: ${number}`,
      meaning ? `Maksud:\n${meaning}` : undefined,
    ].filter(Boolean);
    return lines.join("\n");
  }, [number, meaning, name]);

  const doCopy = async () => {
    if (!number) return;
    try {
      await Clipboard.setStringAsync(shareMessage);
      Alert.alert("Disalin ✅", "Teks telah disalin ke papan klip.");
    } catch (e) {
      Alert.alert("Ralat", "Clipboard gagal.");
    }
  };

  const doShare = async () => {
    if (!number) return;
    try { await Share.share({ message: shareMessage }); } catch {}
  };

  if (!visible) return null;

  return (
    <Animated.View style={{ opacity: fade, alignItems: "center", marginTop: 22, width: "100%" }}>
      <View style={{
        width: 230, height: 230, borderRadius: 115, alignItems: "center", justifyContent: "center",
        backgroundColor: "#f0faf8", borderColor: "#14b8a6", borderWidth: 2,
        shadowColor: "#14b8a6", shadowOpacity: 0.25, shadowRadius: 16, elevation: 4,
      }}>
        <Text style={{ color: "#0f766e", fontSize: 16, marginBottom: 6 }}>Nombor Anda</Text>
        <Text style={{ color: "#0d9488", fontSize: 68, fontWeight: "800" }}>{number}</Text>
      </View>

      <View style={{ marginTop: 14, backgroundColor: "#ffffff", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#e2e8f0", width: "100%" }}>
        <Text style={{ color: "#0f3b3e", fontWeight: "700", marginBottom: 8 }}>Maksud ({number})</Text>
        <ScrollView style={{ maxHeight: 220 }}>
          <Text style={{ color: "#1f2937", lineHeight: 22 }}>{meaning ?? "—"}</Text>
        </ScrollView>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <Pressable onPress={doCopy} style={{ flex: 1, alignItems: "center", backgroundColor: "#0ea5e9", borderRadius: 10, paddingVertical: 10 }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Copy</Text>
          </Pressable>
          <Pressable onPress={doShare} style={{ flex: 1, alignItems: "center", backgroundColor: "#10b981", borderRadius: 10, paddingVertical: 10 }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Share</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
