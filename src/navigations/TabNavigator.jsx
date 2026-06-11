import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/DashboardScreen";
import ReservationScreen from "../screens/ReservationScreen";
import Parametre from "../screens/Parametre";

const Tab = createBottomTabNavigator();

/* ================= ICON MAPPING ================= */
const getIconName = (routeName, focused) => {
  switch (routeName) {
    case "Dashboard":
      return focused ? "speedometer" : "speedometer-outline";
    case "Reservation":
      return focused ? "calendar" : "calendar-outline";
    case "Profile":
      return focused ? "person" : "person-outline";
    default:
      return "ellipse";
  }
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1552e0ff",
          height: 64,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused }) => {
          const isSpecial =
            route.name === "Reservation" ||
            route.name === "Profile" ||
            route.name === "Dashboard";

          return (
            <View
              style={{
                width: isSpecial ? 64 : 56,
                height: isSpecial ? 58 : 40,
                backgroundColor: focused ? "#ffffff" : "transparent",
                borderRadius: isSpecial ? 14 : 20,
                alignItems: "center",
                justifyContent: "center",

                ...(isSpecial && focused
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      elevation: 8,
                    }
                  : {}),
              }}
            >
              <Ionicons
                name={getIconName(route.name, focused)}
                size={isSpecial ? 26 : 22}
                color={focused ? "#1552e0ff" : "#ffffff"}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Reservation" component={ReservationScreen} />
      <Tab.Screen name="Profile" component={Parametre} />
    </Tab.Navigator>
  );
}
