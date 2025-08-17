import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AgeCalculatorApp() {
  const [dob, setDob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const calculateYMD = (fromDate, toDate) => {
    let y = toDate.getFullYear() - fromDate.getFullYear();
    let m = toDate.getMonth() - fromDate.getMonth();
    let d = toDate.getDate() - fromDate.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonth = (toDate.getMonth() - 1 + 12) % 12;
      const prevMonthYear = prevMonth === 11 ? toDate.getFullYear() - 1 : toDate.getFullYear();
      d += daysInMonth(prevMonthYear, prevMonth);
    }
    if (m < 0) {
      m += 12;
      y -= 1;
    }
    return { years: y, months: m, days: d };
  };

  const formatDateHuman = (d) => {
    return d.toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCalculate = () => {
    if (!dob) {
      setError("অনুগ্রহ করে জন্মতারিখ দিন।");
      return;
    }
    const today = new Date();
    const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (dob > cleanToday) {
      setError("ভবিষ্যতের তারিখ দেয়া যাবে না।");
      return;
    }

    const { years, months, days } = calculateYMD(dob, cleanToday);
    const totalDays = Math.floor((cleanToday - dob) / (1000 * 60 * 60 * 24));
    setResult({
      todayStr: formatDateHuman(cleanToday),
      years,
      months,
      days,
      totalDays,
    });
    setError("");
  };

  const handleClear = () => {
    setDob(null);
    setResult(null);
    setError("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.dot} />
          <Text style={styles.title}>জন্মতারিখ থেকে বয়স ক্যালকুলেটর</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>জন্মতারিখ নির্বাচন করুন</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: dob ? "#e5e7eb" : "#94a3b8" }}>
              {dob ? formatDateHuman(dob) : "তারিখ বাছাই করুন"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDob(selectedDate);
              }}
            />
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleCalculate}>
              <Text style={styles.btnText}>হিসাব করুন</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={handleClear}>
              <Text style={styles.btnText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {result && (
          <View style={styles.result}>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>আজকের তারিখ</Text>
              <Text style={styles.big}>{result.todayStr}</Text>
            </View>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>বয়স (বছর–মাস–দিন)</Text>
              <Text style={styles.big}>
                {result.years} বছর {result.months} মাস {result.days} দিন
              </Text>
            </View>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>মোট দিন</Text>
              <Text style={styles.big}>{result.totalDays.toLocaleString()}</Text>
              <Text style={styles.muted}>
                (~ {(result.totalDays / 365.2425).toFixed(2)} বছর)
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.footer}>নোট: ভবিষ্যতের কোনো তারিখ দিলে ত্রুটি দেখানো হবে।</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: "#111827cc",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.15)",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "rgba(148,163,184,0.12)",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22c55e",
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  form: { padding: 20 },
  label: { fontSize: 14, color: "#94a3b8", marginBottom: 8 },
  input: {
    backgroundColor: "#0b1220",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    padding: 12,
    marginBottom: 16,
  },
  actions: { flexDirection: "row", gap: 10 },
  primaryBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  ghostBtn: {
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  btnText: { fontWeight: "600", color: "#fff" },
  error: {
    color: "#fecaca",
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  result: { padding: 20, borderTopWidth: 1, borderColor: "rgba(148,163,184,0.2)" },
  resultCard: { marginBottom: 16 },
  resultTitle: { fontSize: 14, fontWeight: "600", color: "#94a3b8", marginBottom: 4 },
  big: { fontSize: 20, fontWeight: "800", color: "#e5e7eb" },
  muted: { color: "#94a3b8" },
  footer: { color: "#94a3b8", fontSize: 12, paddingHorizontal: 20 },
});
