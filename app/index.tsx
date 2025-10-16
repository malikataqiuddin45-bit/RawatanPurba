import React, { useMemo, useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import ForensikHeader from "../components/ForensikHeader";
import InputNama from "../components/InputNama";
import HasilKad from "../components/HasilKad";
import { calculateName } from "../lib/calcHuruf";
import { maksudMap } from "../lib/maksud";

export default function IndexScreen() {
  const [nama, setNama] = useState("");
  const calc = useMemo(() => {
    const t = nama.trim();
    return t ? calculateName(t) : null;
  }, [nama]);

  const number = calc?.reduced ?? null;
  const meaning = number ? (maksudMap[number] ?? null) : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#f6fffd" }}>
      <ForensikHeader />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: 18 }}>
          <InputNama value={nama} onChange={setNama} onCalculate={() => setNama(v=>v.trim())} />
          <HasilKad number={number} meaning={meaning} name={nama} />
          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
