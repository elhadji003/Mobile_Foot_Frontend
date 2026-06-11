import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardAScreen from "../screens/admin/DashboardAScreen";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={DashboardAScreen} />
    </Stack.Navigator>
  );
}
