import React from "react";
import { Text, View } from "react-native";
import BtnLogout from "../../components/BtnLogout";

export default function DashboardAScreen() {
  return (
    <View>
      <Text>Bienvenue Admin</Text>
      <BtnLogout />
    </View>
  );
}
