import React from "react";
import {
  StyleSheet,
  View,
  Linking,
  Platform,
  TouchableOpacity,
  Text, // <--- Il manquait cet import !
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function SalleMapScreen({ salle }) {
  // On définit la fonction à l'intérieur pour accéder à { salle }
  const openMap = () => {
    if (!salle?.latitude || !salle?.longitude) return;

    const lat = salle.latitude;
    const lng = salle.longitude;
    const label = salle.nom;

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const browserUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        Linking.openURL(browserUrl);
      }
    });
  };

  return (
    <TouchableOpacity
      style={styles.mapContainer}
      onPress={openMap}
      activeOpacity={0.8}
    >
      <MapView
        pointerEvents="none"
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(salle.latitude),
          longitude: parseFloat(salle.longitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(salle.latitude),
            longitude: parseFloat(salle.longitude),
          }}
          title={salle.nom}
        />
      </MapView>

      <View style={styles.mapOverlay}>
        <Text style={styles.mapOverlayText}>
          Cliquez pour ouvrir l'itinéraire
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginVertical: 15,
    backgroundColor: "#ddd",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
  },
  mapOverlayText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});
