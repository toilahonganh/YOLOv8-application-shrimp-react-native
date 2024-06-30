import "react-native-gesture-handler";
import React from "react";
import GetImageScreen from "./screens/GetImageScreen"
import HistoryScreen from "./screens/HistoryScreen"
import LoginScreen from "./screens/LoginScreen";
import ResultScreen from "./screens/ResultScreen"
import ActivityScreen from "./screens/ActivityScreen"
import LogoutScreen from "./screens/LogoutScreen"
import SignupScreen from "./screens/SignupScreen"
import Settings from "./screens/Settings";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";

const Stack = createStackNavigator();
const App = () => {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GetImage"
              component={GetImageScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Activity"
              component={ActivityScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Logout"
              component={LogoutScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </SafeAreaProvider>

  );
};

export default App;
