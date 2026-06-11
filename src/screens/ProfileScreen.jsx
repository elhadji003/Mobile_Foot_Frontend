import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import profile from "../../assets/foot1.png";
import { useGetUserProfileQuery } from "../backend/features/user/userApi";
import BtnLogout from "../components/BtnLogout";
import FootballLoader from "../components/FootballLoader";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const { data: user, isLoading } = useGetUserProfileQuery();

  const handleNoDispo = () => {
    Alert.alert("Cette fonctionnalité n'est pas encore disponible");
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FootballLoader />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Carte Profil */}
        <View style={styles.card}>
          <View>
            <Text style={styles.name}>
              {user?.first_name} {user?.last_name}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("UpdateProfile")}
            >
              <Text style={styles.buttonUpd}>Modifier le profil</Text>
            </TouchableOpacity>
          </View>
          <Image source={profile} style={styles.profile} />
        </View>

        {/* Informations */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Mes informations</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail" size={24} color="#1552e0ff" />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call" size={24} color="#1552e0ff" />
            <Text style={styles.infoText}>
              {user?.phone_number || "Non renseigné"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="football" size={24} color="#1552e0ff" />
            <Text style={styles.infoText}>
              Réservations actives: {user?.active_reservations ?? 0}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.quickActions}>
          <ActionBtn
            label="Les Modes de Paiements"
            icon="card-outline"
            onPress={() => navigation.navigate("ModePaiement")}
          />
          <ActionBtn
            label="Changer mot de passe"
            icon="lock-closed-outline"
            onPress={() => navigation.navigate("UpdatePwd")}
          />
          <ActionBtn
            label="Historique réservations"
            icon="time-outline"
            onPress={() => navigation.navigate("ReservationHistory")}
          />
          {/* <ActionBtn
            label="Mes Terrains Favoris"
            icon="bookmark-outline"
            onPress={() => navigation.navigate("Settings")}
          /> */}
          <ActionBtn
            label="Paramètres"
            icon="settings"
            onPress={() => navigation.navigate("Settings")}
          />
          <ActionBtn
            label="Signaler un problème"
            icon="hand-left-outline"
            danger
            onPress={handleNoDispo}
          />
          <BtnLogout />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ActionBtn = ({ label, icon, onPress, danger = false }) => (
  <TouchableOpacity style={styles.navigateBtn} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
    <Ionicons name={icon} size={24} color={danger ? "#f50505ff" : "#fff"} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  scroll: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1552e0ff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  buttonUpd: {
    color: "#1552e0ff",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1552e0ff",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  quickActions: {
    marginBottom: 20,
  },
  navigateBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1552e0ff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
});
