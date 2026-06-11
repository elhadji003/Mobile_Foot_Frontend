
/* ================== DATA SIMULÉE ================== */
const reservations = [
  {
    id: 1,
    terrain: "Terrain Almadies",
    startTime: new Date(Date.now() + 25 * 60 * 1000), // commence dans 25 min
    duree: 60, // minutes
    prix: "5 000 FCFA",
    status: "payé",
  },
  {
    id: 2,
    terrain: "Terrain Yoff",
    startTime: new Date(Date.now() - 20 * 60 * 1000), // commencé il y a 20 min
    duree: 60,
    prix: "6 000 FCFA",
    status: "payé",
  },
];

import React, { useEffect, useState } from "react";
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

export default function ReservationScreen() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000); // update chaque minute

    return () => clearInterval(interval);
  }, []);

  const getStatusMessage = (startTime: Date) => {
    const diff = Math.floor((startTime.getTime() - now) / 60000);

    if (diff <= -15) {
      return { text: "Réservation libérée", color: "#e74c3c" };
    }

    if (diff <= 30 && diff > 0) {
      return {
        text: `⏰ Match dans ${diff} min`,
        color: "#f39c12",
      };
    }

    if (diff <= 0 && diff > -15) {
      return {
        text: "⚠️ En retard (15 min max)",
        color: "#e67e22",
      };
    }

    return { text: "Réservation confirmée", color: "#2ecc71" };
  };

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBackTitle title="Mes Réservations" />

      <ScrollView contentContainerStyle={styles.content}>
        {reservations.map((item) => {
          const message = getStatusMessage(item.startTime);

          return (
            <TouchableOpacity key={item.id} style={styles.card}>
              <View>
                <Text style={styles.terrain}>{item.terrain}</Text>
                <Text style={styles.info}>
                  Début : {item.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Text style={styles.price}>{item.prix}</Text>
                <Text style={[styles.alert, { color: message.color }]}>
                  {message.text}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          );
        })}
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
    borderTopWidth: 1,
    borderTopColor: "#1552e0ff",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
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
  alert: {
  marginTop: 6,
  fontSize: 13,
  fontWeight: "600",
},

});
