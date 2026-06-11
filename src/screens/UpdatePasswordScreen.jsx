import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useChangePasswordMutation } from "../backend/features/auth/authApi";
import { useNavigation } from "@react-navigation/native";
import HeaderBackTitle from "../components/HeaderBackTitle";

export default function UpdatePasswordScreen() {
  const navigator = useNavigation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleUpdate = async () => {
    if (!oldPassword || !newPassword) {
      return Alert.alert("Erreur", "Veuillez remplir tous les champs");
    }

    if (oldPassword === newPassword) {
      return Alert.alert(
        "Erreur",
        "Le nouveau mot de passe doit être différent de l’ancien"
      );
    }

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      }).unwrap();

      Alert.alert("Succès", "Mot de passe mis à jour ✅");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const message =
        err?.data?.detail || err.message || "Erreur lors de la mise à jour";
      Alert.alert("Erreur", message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBackTitle title="Changer mon mot de passe" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Ancien mot de passe */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ancien mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Ancien mot de passe"
              secureTextEntry={!showOldPassword}
            />
            <TouchableOpacity
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              <Ionicons
                name={showOldPassword ? "eye-off" : "eye"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nouveau mot de passe */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nouveau mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye-off" : "eye"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton */}
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Mettre à jour</Text>
          )}
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
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1552e0ff",
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1552e0ff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
