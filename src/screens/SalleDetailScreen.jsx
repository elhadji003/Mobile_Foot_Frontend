import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { useGetSalleByIdQuery } from "../backend/features/salle/salleApi";
import { useCreateReservationMutation } from "../backend/features/reservation/reservationApi";
import { FormatDateFR } from "../components/FormatDateFr";
import { SafeAreaView } from "react-native-safe-area-context";
import SalleMapScreen from "./SalleMapScreen";
import HeaderBackTitle from "../components/HeaderBackTitle";
import FootballLoader from "../components/FootballLoader";

export default function SalleDetailScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { salleId } = params;

  const { data: salle, isLoading } = useGetSalleByIdQuery(salleId);

  const [createReservation, { isLoading: reserving }] =
    useCreateReservationMutation();

  const creneauxList = salle?.creneaux ?? [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <FootballLoader />
      </View>
    );
  }

  const handleReserve = async (creneauId) => {
    try {
      await createReservation({
        salle: salleId,
        creneau: creneauId,
      }).unwrap();

      Alert.alert("Succès", "Réservation confirmée");
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        "Erreur",
        err?.data?.non_field_errors?.[0] || "Créneau indisponible",
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
      <HeaderBackTitle title={"Detail du Terrain"} />
      <ScrollView contentContainerStyle={styles.container}>
        <SalleMapScreen salle={salle} />
        <Text style={styles.title}>{salle.nom}</Text>
        <Text style={styles.adresse}>{salle.adresse}</Text>
        <Text>Prix</Text>
        <Text style={styles.prix}>{salle.prix} FCFA</Text>
        <Text
          style={styles.telephone}
          onPress={async () => {
            const url = `tel:${salle.telephone}`;
            const supported = await Linking.canOpenURL(url);
            if (supported) {
              Linking.openURL(url);
            } else {
              Alert.alert("Erreur", "Impossible de passer l'appel");
            }
          }}
        >
          {salle.telephone}
        </Text>
        <Text style={styles.subtitle}>Créneaux disponibles</Text>

        {creneauxList.length === 0 ? (
          <Text style={styles.empty}>Aucun créneau disponible</Text>
        ) : (
          creneauxList.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.date}>{FormatDateFR(item.date)}</Text>
              <Text style={styles.time}>
                {item.heure_debut} - {item.heure_fin}
              </Text>

              <TouchableOpacity
                style={[styles.button, !item.is_active && styles.disabled]} // Gris si PAS actif
                disabled={!item.is_active || reserving} // Bloqué si PAS actif
                onPress={() => handleReserve(item.id)}
              >
                <Text style={styles.buttonText}>
                  {item.is_active ? "Réserver" : "Déjà réservé"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // paddingTop: 30, // 🔹 espace au-dessus du header / notch
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    paddingHorizontal: 16,
  },

  adresse: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 6,
  },

  prix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1552e0ff",
    textAlign: "center",
    marginBottom: 20,
  },

  telephone: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1552e0ff", // bleu comme tes boutons / prix
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5, // un peu d'espacement pour la lisibilité
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  date: {
    fontWeight: "700",
    marginBottom: 4,
  },

  time: {
    color: "#555",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#1552e0ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  disabled: {
    backgroundColor: "#aaa",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
  },
});
