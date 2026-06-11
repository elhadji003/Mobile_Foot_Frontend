import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import bgBox1 from "../../../assets/bgLogin.png";
import {
  Alert,
  Animated,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRegisterMutation } from "../../backend/features/auth/authApi";

export default function RegisterScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, { isLoading }] = useRegisterMutation();
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      return Alert.alert("Erreur", "Veuillez remplir tous les champs");
    }

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        email: email,
        password: password,
        role: "user",
      }).unwrap();

      Alert.alert("Succès", "Compte créé avec succès ✅");
      navigation.navigate("Login");
    } catch (err) {
      const message = err?.data?.detail || "Erreur lors de l’inscription";
      Alert.alert("Erreur", message);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* IMAGE HEADER */}
      <ImageBackground source={bgBox1} style={styles.hero}>
        <View style={styles.overlay}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={styles.title}>Créer un compte ⚽</Text>
            <Text style={styles.subtitle}>
              Réserve ton terrain en quelques secondes
            </Text>
          </Animated.View>
        </View>
      </ImageBackground>

      {/* FORM CARD SUPERPOSÉE */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formWrapper}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                placeholder="Prénom"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                placeholder="Nom"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                placeholder="Téléphone"
                style={styles.input}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <TextInput
                placeholder="Email"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                placeholder="Mot de passe"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={[styles.button, isLoading && { opacity: 0.6 }]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Création..." : "S’inscrire"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.footerText}>
                Déjà un compte ?{" "}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate("Login")}
                >
                  Se connecter
                </Text>
              </Text>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  /* IMAGE */
  hero: {
    height: 400,
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 30,
    justifyContent: "center",
    borderBottomRightRadius: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#e0e7ff",
  },

  /* FORM CARD */
  formWrapper: {
    flex: 1,
    marginTop: -80, // 🔥 superposition
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
  },

  button: {
    backgroundColor: "#1552e0ff",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },

  link: {
    color: "#1552e0ff",
    fontWeight: "bold",
  },
});
