import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLogoutMutation } from "../backend/features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../backend/features/auth/authSlice";
import { authApi } from "../backend/features/auth/authApi";
import { useNavigation } from "@react-navigation/native";

export default function BtnLogout() {
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.auth.refreshToken);

  const handleLogout = async () => {
    try {
      if (refresh) {
        await logoutApi(refresh).unwrap();
      }
    } catch (e) {
    } finally {
      dispatch(logoutAction());
      dispatch(authApi.util.resetApiState());
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <TouchableOpacity
        onPress={handleLogout}
        disabled={isLoading}
        style={{
          backgroundColor: "#e53935",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Se déconnecter
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
