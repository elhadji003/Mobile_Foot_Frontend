import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

export default function SalleMapScreen({ salle }) {
  const lat = Number(salle?.latitude);
  const lng = Number(salle?.longitude);
  const isValid = Number.isFinite(lat) && Number.isFinite(lng);

  const openMap = () => {
    if (!isValid) return;
    Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, !isValid && styles.disabled]}
      onPress={openMap}
      disabled={!isValid}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>🗺️</Text>
      <View>
        <Text style={styles.title}>Voir sur la carte</Text>
        <Text style={styles.sub}>
          {isValid ? "Ouvre Google Maps" : "Localisation non disponible"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: "#1552e0",
  },
  disabled: { backgroundColor: "#ced4da" },
  icon: { fontSize: 32 },
  title: { fontSize: 16, fontWeight: "700", color: "#fff" },
  sub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },
});
