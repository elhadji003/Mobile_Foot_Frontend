import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  TouchableOpacity, // ✅ ajouter
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import HeaderBackTitle from "../components/HeaderBackTitle";
import { useGetReservationsQuery } from "../backend/features/reservation/reservationApi";
import FootballLoader from "../components/FootballLoader";

const statusConfig = {
  confirmed: { label: "Confirmée", color: "#2ecc71", bg: "#eafaf1" },
  pending: { label: "En attente", color: "#f39c12", bg: "#fef9e7" },
  cancelled: { label: "Annulée", color: "#e74c3c", bg: "#fdedec" },
};

export default function ReservationScreen() {
  const { data, isLoading, error } = useGetReservationsQuery();

  const reservations = data?.results ?? [];

  const confirmed = reservations.filter((r) => r.status === "confirmed").length;
  const pending = reservations.filter((r) => r.status === "pending").length;
  const cancelled = reservations.filter((r) => r.status === "cancelled").length;

  const formatTime = (t) => (t ? t.slice(0, 5) : "");

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  if (isLoading) {
    return (
      <View style={styles.center}>
        <FootballLoader />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <HeaderBackTitle title="Mes Réservations" />
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            ⚠️ Impossible de charger vos réservations.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBackTitle title="Mes Réservations" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: "#2ecc71" }]}>
            <Text style={[styles.statNumber, { color: "#2ecc71" }]}>
              {confirmed}
            </Text>
            <Text style={styles.statLabel}>Confirmées</Text>
          </View>

          <View style={[styles.statCard, { borderTopColor: "#f39c12" }]}>
            <Text style={[styles.statNumber, { color: "#f39c12" }]}>
              {pending}
            </Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>

          <View style={[styles.statCard, { borderTopColor: "#e74c3c" }]}>
            <Text style={[styles.statNumber, { color: "#e74c3c" }]}>
              {cancelled}
            </Text>
            <Text style={styles.statLabel}>Annulées</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.sectionTitle}>
          {reservations.length} réservation(s)
        </Text>

        {/* Empty state */}
        {reservations.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              Aucune réservation pour le moment.{"\n"}
              Réserve ton premier terrain ⚽🔥
            </Text>
          </View>
        ) : (
          reservations.map((res) => {
            const config = statusConfig[res.status] ?? {
              label: res.status,
              color: "#999",
              bg: "#f5f5f5",
            };

            const heureDebut = formatTime(res.creneau_details?.heure_debut);
            const heureFin = formatTime(res.creneau_details?.heure_fin);

            const date = res.creneau_details?.date
              ? formatDate(res.creneau_details.date)
              : "";

            return (
              <Pressable
                key={res.id}
                style={[styles.card, { borderTopColor: config.color }]}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name="football-outline"
                      size={20}
                      color="#1552e0"
                    />
                  </View>

                  <Text style={styles.terrainName}>
                    {res.salle_details?.nom ?? `Terrain #${res.salle}`}
                  </Text>

                  {res.salle_details?.telephone && (
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`tel:${res.salle_details.telephone}`)
                      }
                      style={styles.phoneBtn}
                    >
                      <Ionicons name="call-outline" size={14} color="#1552e0" />
                      <Text style={styles.phoneText}>
                        {res.salle_details.telephone}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <View style={[styles.badge, { backgroundColor: config.bg }]}>
                    <Text style={[styles.badgeText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>

                {/* Body */}
                <View style={styles.cardBody}>
                  {res.salle_details?.adresse && (
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#999"
                      />
                      <Text style={styles.infoText}>
                        {res.salle_details.adresse}
                      </Text>
                    </View>
                  )}

                  {res.salle_details?.prix && (
                    <View style={styles.infoRow}>
                      <Ionicons name="cash-outline" size={14} color="#999" />
                      <Text style={styles.infoText}>
                        {res.salle_details.prix} FCFA / heure
                      </Text>
                    </View>
                  )}

                  {date && (
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#999"
                      />
                      <Text style={styles.infoText}>{date}</Text>
                    </View>
                  )}

                  {heureDebut && (
                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={14} color="#999" />
                      <Text style={styles.infoText}>
                        {heureDebut} – {heureFin}
                      </Text>
                    </View>
                  )}

                  {res.creneau_details?.nombre_joueur && (
                    <View style={styles.infoRow}>
                      <Ionicons name="people-outline" size={14} color="#999" />
                      <Text style={styles.infoText}>
                        {res.creneau_details.nombre_joueur} joueurs
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })
        )}
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
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 15,
    color: "#e74c3c",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderTopWidth: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderTopWidth: 3,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },

  terrainName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  phoneBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  phoneText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1552e0",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  cardBody: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  infoText: {
    fontSize: 13,
    color: "#555",
  },
});
