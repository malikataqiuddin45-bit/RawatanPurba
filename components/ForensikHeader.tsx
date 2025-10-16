import React from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ForensikHeader() {
  return (
    <LinearGradient
      colors={["#0f3b3e", "#115e59"]} // teal gelap → hijau teal
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingTop: 58, paddingBottom: 24, paddingHorizontal: 22, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}
    >
      <Text style={{ color: "#fde68a", fontSize: 13, letterSpacing: 1.1 }}>
        ANCIENT WISDOM • MODERN TECH
      </Text>
      <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800", marginTop: 6 }}>
        Forensik Nama Belerang Merah
      </Text>
      <Text style={{ color: "rgba(255,255,255,0.9)", marginTop: 4 }}>
        Kalkulator Arab 
      </Text>
    </LinearGradient>
  );
}
