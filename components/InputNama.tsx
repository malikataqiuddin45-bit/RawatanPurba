import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";

type Props = {
  value: string;
  onChange: (t: string) => void;
  onCalculate: () => void;
};

export default function InputNama({ value, onChange, onCalculate }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#e8f5f3",       // cerah
        borderColor: "#bfe3dd",
        borderWidth: 1,
        padding: 14,
        borderRadius: 16,
        marginTop: -12,
      }}
    >
      <Text style={{ color: "#0f3b3e", fontSize: 15, marginBottom: 8 }}>
        Nama (جاوي) / Name
      </Text>

      <View
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#9ad4cc",
          backgroundColor: "#ffffff",
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Contoh: Nur Malika binti Osman"
          placeholderTextColor="#5f8890"
          style={{
            color: "#0f3b3e",
            fontSize: 18,
            textAlign: "left",
          }}
        />
      </View>

      <Pressable
        onPress={onCalculate}
        style={{
          marginTop: 12,
          alignItems: "center",
          backgroundColor: "#dc2626",      // merah belerang
          borderRadius: 12,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: "#f59e0b",          // emas
          shadowColor: "#dc2626",
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          Kira Sekarang — احسب الآن
        </Text>
      </Pressable>
    </View>
  );
}
