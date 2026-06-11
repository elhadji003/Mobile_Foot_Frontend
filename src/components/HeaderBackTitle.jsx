import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HeaderBackTitle({ title, onBackPress }) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#1552e0ff" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightSpace} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backBtn: {
    padding: 6,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#1552e0ff",
  },
  rightSpace: {
    width: 30,
  },
});
