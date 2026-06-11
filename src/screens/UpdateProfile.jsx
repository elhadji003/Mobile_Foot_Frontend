import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../backend/features/user/userApi";
import { useNavigation } from "@react-navigation/native";
import HeaderBackTitle from "../components/HeaderBackTitle";

export default function UpdateProfile() {
  const navigation = useNavigation();

  const { data: user, isLoading } = useGetUserProfileQuery();
  const [update, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Pré-remplir les champs
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      await update({
        first_name: firstName,
        last_name: lastName,
        email,
      }).unwrap();
      alert("Profil mis à jour avec succès ✅");
      navigation.goBack(); // Retour au profil
    } catch (err) {
      const message =
        err?.data?.detail || err.message || "Erreur lors de la mise à jour";
      alert(message);
    }
  };

  if (isLoading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1552e0ff" />
      </View>
    );

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBackTitle title="Modifier mon profile" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Prénom"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Nom"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isUpdating && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
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
