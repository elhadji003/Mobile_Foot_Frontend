import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetSalleByIdQuery } from "../backend/features/salle/salleApi";
import { useCreateReservationMutation } from "../backend/features/reservation/reservationApi";
import { FormatDateFR } from "../components/FormatDateFr";
import SalleMapScreen from "./SalleMapScreen";
import HeaderBackTitle from "../components/HeaderBackTitle";
import FootballLoader from "../components/FootballLoader";

const { width } = Dimensions.get("window");

export default function SalleDetailScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { salleId } = params;

  const { data: salle, isLoading } = useGetSalleByIdQuery(salleId);
  const [createReservation, { isLoading: reserving }] = useCreateReservationMutation();

  const creneauxList = salle?.creneaux ?? [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <FootballLoader />
      </View>
    );
  }

  // Sécurité pour éviter le crash si la salle n'est pas trouvée après le chargement
  if (!salle) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <HeaderBackTitle title="Détail du Terrain" />
        <View style={styles.center}>
          <Text style={styles.errorText}>Impossible de charger les informations du terrain.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleReserve = async (creneauId) => {
    try {
      await createReservation({
        salle: salleId,
        creneau: creneauId,
      }).unwrap();

      Alert.alert("Succès 🎉", "Votre réservation a été confirmée avec succès !");
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        "Erreur",
        err?.data?.non_field_errors?.[0] || "Ce créneau n'est plus disponible.",
      );
    }
  };

  const makeCall = async () => {
    if (!salle?.telephone) return;
    const url = `tel:${salle.telephone}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Erreur", "Votre appareil ne permet pas de passer des appels directement.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBackTitle title="Détail du Terrain" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Section Carte / Visuel */}
        <View style={styles.mapWrapper}>
          <SalleMapScreen salle={salle} />
        </View>

        {/* Section Informations Principales */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{salle?.nom}</Text>
          
          <View style={styles.locationContainer}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.adresse}>{salle?.adresse}</Text>
          </View>

          <View style={styles.priceBadge}>
            <Text style={styles.prix}>{salle?.prix ? `${salle.prix} FCFA` : "Tarif non spécifié"}</Text>
          </View>

          {/* Bouton d'action Contact rapide */}
          {salle?.telephone && (
            <TouchableOpacity style={styles.phoneButton} onPress={makeCall}>
              <Text style={styles.phoneIcon}>📞</Text>
              <Text style={styles.phoneText}>Contacter le terrain ({salle.telephone})</Text>
            </TouchableOpacity>
          )}
        </View>

        <Divider />

        {/* Section Créneaux */}
        <View style={styles.slotsSection}>
          <Text style={styles.subtitle}>📅 Créneaux disponibles</Text>

          {creneauxList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun créneau disponible pour le moment.</Text>
            </View>
          ) : (
            creneauxList.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.date}>{FormatDateFR(item.date)}</Text>
                  <Text style={styles.time}>
                    🕒 {item.heure_debut} - {item.heure_fin}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.button, !item.is_active && styles.disabled]}
                  disabled={!item.is_active || reserving}
                  onPress={() => handleReserve(item.id)}
                >
                  <Text style={styles.buttonText}>
                    {item.is_active ? "Réserver" : "Complet"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Composant de séparation visuelle épuré
const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  mapWrapper: {
    width: width,
    height: 220,
    backgroundColor: "#e9ecef",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoSection: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#212529",
    textAlign: "center",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  pinIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  adresse: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 20,
  },
  priceBadge: {
    backgroundColor: "#e7f0ff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginBottom: 20,
  },
  prix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1552e0",
  },
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e4e8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  phoneIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1552e0",
  },
  divider: {
    height: 1,
    backgroundColor: "#edd",
    opacity: 0.1,
    marginHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#dee2e6",
  },
  slotsSection: {
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  date: {
    fontSize: 15,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: "#495057",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#1552e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#ced4da",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  emptyText: {
    textAlign: "center",
    color: "#6c757d",
    fontSize: 14,
  },
});