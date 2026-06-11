import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Important
import { useGetSallesQuery } from "../backend/features/salle/salleApi";
import { useNavigation } from "@react-navigation/native";
import FootballLoader from "../components/FootballLoader";
import terrainBg from "../../assets/terrainR1.png";

export default function DashboardScreen() {
  const { data: salles, isLoading } = useGetSallesQuery();
  const navigation = useNavigation();

  const terrains = salles?.results ?? [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <FootballLoader />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bonjour,</Text>
        <Text style={styles.title}>Terrains disponibles</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {terrains.length === 0 ? (
          <Text style={styles.emptyText}>Aucun terrain trouvé</Text>
        ) : (
          terrains.map((terrain) => (
            <TouchableOpacity
              key={terrain.id}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("SalleDetail", { salleId: terrain.id })
              }
              style={styles.card}
            >
              <ImageBackground
                source={terrainBg}
                style={styles.image}
                imageStyle={{ borderRadius: 20 }}
              >
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>
                    {parseInt(terrain.prix)} FCFA
                  </Text>
                </View>
              </ImageBackground>

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <View>
                    <Text style={styles.terrainName}>{terrain.nom}</Text>
                    <Text style={styles.locationText}>
                      📍 {terrain.adresse || "Sénégal"}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Disponible</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 24,
    // Ombre Premium
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    height: 180,
    width: "100%",
    justifyContent: "flex-end",
  },
  priceTag: {
    backgroundColor: "#1552e0ff",
    alignSelf: "flex-start",
    margin: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  terrainName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#777",
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
});
