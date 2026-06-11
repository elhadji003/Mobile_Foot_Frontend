// screens/LoginScreen.tsx
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
import { useLoginMutation } from "../../backend/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../backend/features/auth/authSlice";

const LoginScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading: loading }] = useLoginMutation();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Les champs doivent etre remplir !");
    }
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      console.log("role :", res?.role);
    } catch (err) {
      const message = "data" in err ? err.data?.detail : err.message;
      Alert.alert("Erreur", message || "Identifiants incorrects");
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
      <ImageBackground
        source={bgBox1}
        style={styles.box1}
        imageStyle={{ borderBottomRightRadius: 100 }}
      >
        <View style={styles.overlay}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={styles.title}>Bienvenue sur Deff Foot ⚽</Text>
            <Text style={styles.subtitle}>
              Réservez votre salle de football en quelques secondes
            </Text>
            <Text style={styles.subtitleBold}>Simple • Rapide • Fiable</Text>
          </Animated.View>
        </View>
      </ImageBackground>

      <View style={styles.middle}>
        <Ionicons name="football-outline" size={46} color="#1552e0ff" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.box2}>
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  autoCapitalize="none"
                  onChangeText={setEmail}
                />
                <TextInput
                  placeholder="Mot de passe"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.6 }]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Connexion..." : "Se connecter"}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                  Pas encore de compte ?{" "}
                  <Text
                    style={styles.link}
                    onPress={() => navigation.navigate("Register")}
                  >
                    S’inscrire
                  </Text>
                </Text>
              </Animated.View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  box1: { flex: 1, justifyContent: "center" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 30,
    justifyContent: "center",
    borderBottomRightRadius: 100,
  },
  title: {
    borderLeftWidth: 3,
    borderLeftColor: "#fff",
    paddingLeft: 12,
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, color: "#e0e7ff" },
  subtitleBold: {
    marginTop: 10,
    fontSize: 16,
    color: "#e0e7ff",
    fontWeight: "bold",
  },
  middle: {
    position: "absolute",
    zIndex: 2,
    top: "45%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 50,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  box2: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    borderTopLeftRadius: 100,
    justifyContent: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
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
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footerText: { textAlign: "center", marginTop: 20, color: "#555" },
  link: { color: "#1552e0ff", fontWeight: "bold" },
});

export default LoginScreen;
