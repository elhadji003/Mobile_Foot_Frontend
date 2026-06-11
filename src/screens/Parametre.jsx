import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { authApi } from "../backend/features/auth/authApi";
import { logout as logoutAction } from "../backend/features/auth/authSlice";
import {
  useDeleteUserAccountMutation,
  useGetUserProfileQuery,
  userApi,
} from "../backend/features/user/userApi";
import BtnLogout from "../components/BtnLogout";
import FootballLoader from "../components/FootballLoader";
import HeaderBackTitle from "../components/HeaderBackTitle";

const SETTINGS_STORAGE_KEY = "footsall_user_settings";

const DEFAULT_SETTINGS = {
  matchReminders: true,
  paymentBackup: true,
  offerNotifications: false,
};

export default function Parametre() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: user, isLoading, isFetching, refetch } = useGetUserProfileQuery();
  const [deleteAccount, { isLoading: isDeleting }] =
    useDeleteUserAccountMutation();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

        if (savedSettings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...JSON.parse(savedSettings),
          });
        }
      } catch (error) {
        Alert.alert(
          "Erreur",
          "Impossible de charger vos préférences pour le moment."
        );
      }
    };

    loadSettings();
  }, []);

  const updateSetting = async (key, value) => {
    const nextSettings = {
      ...settings,
      [key]: value,
    };

    setSettings(nextSettings);

    try {
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(nextSettings)
      );
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible d'enregistrer cette préférence pour le moment."
      );
    }
  };

  const handleUnavailable = () => {
    Alert.alert("Bientôt disponible", "Cette option arrive prochainement.");
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      Alert.alert("Erreur", "Veuillez saisir votre mot de passe.");
      return;
    }

    try {
      await deleteAccount(deletePassword).unwrap();
      setShowDeleteModal(false);
      setDeletePassword("");
      dispatch(logoutAction());
      dispatch(authApi.util.resetApiState());
      dispatch(userApi.util.resetApiState());
      Alert.alert("Compte supprimé", "Votre compte a bien été supprimé.");
    } catch (error) {
      const message =
        error?.data?.detail ||
        error?.message ||
        "Impossible de supprimer le compte pour le moment.";

      Alert.alert("Erreur", message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <FootballLoader />
      </View>
    );
  }

  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBackTitle title="Paramètres" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={28} color="#1552e0ff" />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{fullName || "Mon compte"}</Text>
            <Text style={styles.profileEmail}>
              {user?.email || "Adresse email non renseignée"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={refetch}
            style={styles.refreshBtn}
            disabled={isFetching}
          >
            {isFetching ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="refresh" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <SettingsSection title="Compte">
          <SettingsAction
            icon="person-outline"
            title="Modifier le profil"
            subtitle="Nom, prénom et email"
            onPress={() => navigation.navigate("UpdateProfile")}
          />
          <SettingsAction
            icon="card-outline"
            title="Modes de paiement"
            subtitle="Wave et Orange Money"
            onPress={() => navigation.navigate("ModePaiement")}
          />
          <SettingsAction
            icon="time-outline"
            title="Historique des réservations"
            subtitle="Anciennes réservations et statuts"
            onPress={() => navigation.navigate("ReservationHistory")}
          />
        </SettingsSection>

        <SettingsSection title="Préférences">
          <SettingsSwitch
            icon="alarm-outline"
            title="Rappels de match"
            subtitle="Alerte avant une réservation"
            value={settings.matchReminders}
            onValueChange={(value) => updateSetting("matchReminders", value)}
          />
          <SettingsSwitch
            icon="card-outline"
            title="Moyen de paiement favori"
            subtitle="Conserver le dernier choix"
            value={settings.paymentBackup}
            onValueChange={(value) => updateSetting("paymentBackup", value)}
          />
          <SettingsSwitch
            icon="megaphone-outline"
            title="Offres et annonces"
            subtitle="Promotions et nouveautés FootSall"
            value={settings.offerNotifications}
            onValueChange={(value) =>
              updateSetting("offerNotifications", value)
            }
          />
        </SettingsSection>

        <SettingsSection title="Sécurité">
          <SettingsAction
            icon="lock-closed-outline"
            title="Changer le mot de passe"
            subtitle="Sécuriser l'accès au compte"
            onPress={() => navigation.navigate("UpdatePwd")}
          />
          <SettingsAction
            danger
            icon="trash-outline"
            title="Supprimer mon compte"
            subtitle="Action définitive"
            onPress={() => setShowDeleteModal(true)}
          />
        </SettingsSection>

        <SettingsSection title="Aide">
          <SettingsAction
            icon="help-circle-outline"
            title="Signaler un problème"
            subtitle="Contacter l'équipe FootSall"
            onPress={handleUnavailable}
          />
          <SettingsAction
            icon="information-circle-outline"
            title="À propos"
            subtitle="FootSall mobile 1.0.0"
            onPress={handleUnavailable}
          />
        </SettingsSection>

        <BtnLogout />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalWrapper}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowDeleteModal(false)}
          />

          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons name="trash-outline" size={26} color="#e53935" />
            </View>

            <Text style={styles.modalTitle}>Supprimer le compte</Text>
            <Text style={styles.modalText}>
              Entrez votre mot de passe pour confirmer cette action.
            </Text>

            <TextInput
              value={deletePassword}
              onChangeText={setDeletePassword}
              placeholder="Mot de passe"
              secureTextEntry
              style={styles.passwordInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.deleteBtn]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.deleteText}>Supprimer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const SettingsSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const SettingsAction = ({ danger = false, icon, onPress, subtitle, title }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View
      style={[
        styles.rowIcon,
        danger ? styles.rowIconDanger : styles.rowIconPrimary,
      ]}
    >
      <Ionicons name={icon} size={22} color={danger ? "#e53935" : "#1552e0ff"} />
    </View>

    <View style={styles.rowText}>
      <Text style={[styles.rowTitle, danger && styles.dangerText]}>
        {title}
      </Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>

    <Ionicons name="chevron-forward" size={20} color="#a0a4ad" />
  </TouchableOpacity>
);

const SettingsSwitch = ({ icon, onValueChange, subtitle, title, value }) => (
  <View style={styles.row}>
    <View style={[styles.rowIcon, styles.rowIconPrimary]}>
      <Ionicons name={icon} size={22} color="#1552e0ff" />
    </View>

    <View style={styles.rowText}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>

    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#d8dbe2", true: "#a8c1ff" }}
      thumbColor={value ? "#1552e0ff" : "#f4f4f5"}
    />
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1552e0ff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  profileIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  profileEmail: {
    color: "#dfe8ff",
    fontSize: 14,
    marginTop: 4,
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f4",
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowIconPrimary: {
    backgroundColor: "#edf3ff",
  },
  rowIconDanger: {
    backgroundColor: "#fff0f0",
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#24262d",
  },
  rowSubtitle: {
    fontSize: 13,
    color: "#7a7f8d",
    marginTop: 3,
  },
  dangerText: {
    color: "#e53935",
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(18, 24, 38, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff0f0",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#24262d",
  },
  modalText: {
    color: "#6f7480",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 14,
  },
  passwordInput: {
    backgroundColor: "#f5f6fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9dce4",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#eef0f4",
  },
  deleteBtn: {
    backgroundColor: "#e53935",
  },
  cancelText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "700",
  },
  deleteText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
