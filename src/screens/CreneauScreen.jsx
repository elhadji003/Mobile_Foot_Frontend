// screens/CreneauxScreen.jsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useCreateReservationMutation } from "../backend/features/reservation/reservationApi";
import { useGetCreneauxBySalleQuery } from "../backend/features/creneau/creneauApi";

export default function CreneauxScreen() {
  const { params } = useRoute();
  const { salleId, salleNom } = params ?? {};

  const {
    data: creneaux,
    isLoading,
    isError,
  } = useGetCreneauxBySalleQuery(salleId);

  const [createReservation, { isLoading: reserving }] =
    useCreateReservationMutation();

  const creneauxList = creneaux?.results ?? [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Erreur de chargement</Text>
      </View>
    );
  }

  if (creneauxList.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Aucun créneau disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{salleNom}</Text>

      <FlatList
        data={creneauxList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            disabled={reserving}
            onPress={() =>
              createReservation({
                salle: salleId,
                creneau: item.id,
              })
            }
          >
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.time}>
              {item.heure_debut} - {item.heure_fin}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    padding: 16,
    backgroundColor: "#1552e0ff",
    borderRadius: 10,
    marginBottom: 10,
  },
  date: { color: "#fff", fontWeight: "700" },
  time: { color: "#fff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
