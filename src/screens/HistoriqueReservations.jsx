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

/* ================== DATA SIMULÉE ================== */
const reservations = [
  {
    id: 1,
    terrain: "Terrain Almadies",
    date: "12 Jan 2026",
    heure: "18:00 - 19:00",
    prix: "5 000 FCFA",
    status: "payé",
  },
  {
    id: 2,
    terrain: "Terrain Yoff",
    date: "08 Jan 2026",
    heure: "20:00 - 21:00",
    prix: "6 000 FCFA",
    status: "annulé",
  },
  {
    id: 3,
    terrain: "Terrain Parcelles",
    date: "02 Jan 2026",
    heure: "17:00 - 18:00",
    prix: "4 500 FCFA",
    status: "en attente",
  },
];

export default function HistoriqueReservations() {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBackTitle title="Historique" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Mes réservations</Text>

        {reservations.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <View>
              <Text style={styles.terrain}>{item.terrain}</Text>
              <Text style={styles.info}>
                {item.date} • {item.heure}
              </Text>
              <Text style={styles.price}>{item.prix}</Text>
            </View>

            <View style={styles.right}>
              <Text
                style={[
                  styles.status,
                  item.status === "payé" && styles.paid,
                  item.status === "annulé" && styles.cancelled,
                  item.status === "en attente" && styles.pending,
                ]}
              >
                {item.status}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        ))}
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
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  terrain: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  paid: {
    color: "#2ecc71",
  },
  cancelled: {
    color: "#e74c3c",
  },
  pending: {
    color: "#f39c12",
  },
});
