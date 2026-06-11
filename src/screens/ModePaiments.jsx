import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import HeaderBackTitle from "../components/HeaderBackTitle";

export default function ModalPaiement() {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBackTitle title="Mode de paiement" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Nos mode de paiement</Text>

        {/* Wave */}
        <TouchableOpacity style={styles.card}>
          <View style={styles.left}>
            <Ionicons name="cash-outline" size={28} color="#1dc8ff" />
            <Text style={styles.cardText}>Wave</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>

        {/* Orange Money */}
        <TouchableOpacity style={styles.card}>
          <View style={styles.left}>
            <Ionicons name="wallet-outline" size={28} color="#ff7900" />
            <Text style={styles.cardText}>Orange Money</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2, // Android
    shadowColor: "#000", // iOS
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
