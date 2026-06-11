import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Title from "../components/Title";
import { useNavigation } from "@react-navigation/native";
import logo from "../../assets/foot1.png";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header / Logo */}
      <View style={styles.header}>
        <Title name="FootSall" />
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Welcome Message */}
      <View style={styles.message}>
        <Text style={styles.welcome}>Bienvenue 👋</Text>
        <Text style={styles.subtitle}>Réservez votre salle avant de venir</Text>
      </View>

      {/* Loader */}
      <View style={styles.loaderContainer}>
        <View style={styles.loader}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  message: {
    alignItems: "center",
  },
  welcome: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  loaderContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 50,
  },
  loader: {
    width: "70%",
    height: "100%",
    backgroundColor: "#00f",
  },
});
