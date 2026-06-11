import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "../layouts/Layout";
import UpdateProfile from "../screens/UpdateProfile";
import UpdatePasswordScreen from "../screens/UpdatePasswordScreen";
import ModePaiments from "../screens/ModePaiments";
import HistoriqueReservations from "../screens/HistoriqueReservations";
import Parametre from "../screens/Parametre";
import CreneauxScreen from "../screens/CreneauScreen";
import SalleDetailScreen from "../screens/SalleDetailScreen";

const Stack = createNativeStackNavigator();

export default function UserNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={Layout} />
      <Stack.Screen
        name="ReservationHistory"
        component={HistoriqueReservations}
      />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      <Stack.Screen name="UpdatePwd" component={UpdatePasswordScreen} />
      <Stack.Screen name="ModePaiement" component={ModePaiments} />
      <Stack.Screen name="Settings" component={Parametre} />
      <Stack.Screen name="Creneaux" component={CreneauxScreen} />
      <Stack.Screen name="SalleDetail" component={SalleDetailScreen} />
    </Stack.Navigator>
  );
}
