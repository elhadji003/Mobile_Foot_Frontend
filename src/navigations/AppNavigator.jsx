// navigation/AppNavigator.jsx
import React from "react";
import { useSelector } from "react-redux";
import UserNavigator from "./UserNavigator";
import AdminNavigator from "./AdminNavigator";
import AuthNavigator from "./AuthNavigator";

export default function AppNavigator() {
  const { accessToken, role } = useSelector((state) => state.auth);

  // pas connecté
  if (!accessToken) return <AuthNavigator />;

  // admin connecté
  if (role === "admin") return <AdminNavigator />;

  // user connecté
  return <UserNavigator />;
}
