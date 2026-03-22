import { NavigationContainer } from "@react-navigation/native"; 
import { createNativeStackNavigator } from "@react-navigation/native-stack"; 
import { useAuth } from "../context/AuthContext"; 
import { colors } from "../theme";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import EventListScreen from "../screens/EventListScreen"; 
import EventDetailScreen from "../screens/EventDetailScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ReservationsScreen from "../screens/ReservationsScreen";
 
const Stack = createNativeStackNavigator(); 
 
export default function AppNavigator() { 
  const { user } = useAuth(); 
 
  return ( 
    <NavigationContainer> 
      <Stack.Navigator 
        key={user ? "main" : "auth"} 
        screenOptions={{ headerShown: false }} 
      > 
        {user ? ( 
          <> 
            <Stack.Screen name="EventList" component={EventListScreen} /> 
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: true, title: "Profil", headerTintColor: colors.primary, headerStyle: { backgroundColor: colors.card } }}
            />
            <Stack.Screen
              name="Reservations"
              component={ReservationsScreen}
              options={{ headerShown: true, title: "Mes réservations", headerTintColor: colors.primary, headerStyle: { backgroundColor: colors.card } }}
            />
            <Stack.Screen 
              name="EventDetail" 
              component={EventDetailScreen} 
              options={{ headerShown: true, title: "Détail", headerTintColor: colors.primary, headerStyle: { backgroundColor: colors.card } }} 
            /> 
          </> 
        ) : ( 
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )} 
      </Stack.Navigator> 
    </NavigationContainer> 
  );
}