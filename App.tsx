import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import * as firebase from "firebase";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import { auth } from "./firebase";

const store = createStore(rootReducer, applyMiddleware(thunk));

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import { ActivityIndicator, Colors } from "react-native-paper";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const Stack = createStackNavigator();

export default function App() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  const getFonts = () => {
    Font.loadAsync({
      InstaSans: require("./assets/psrg.ttf"),
      InstaSansMed: require("./assets/psbold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoaded(true);
        setLoggedIn(true);
      } else {
        setLoaded(true);
        setLoggedIn(false);
      }
    });
    getFonts();
  }, []);

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator focusable={false} color={Colors.blue50} />
      </View>
    );
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (!loggedIn && fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Add" component={AddScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
