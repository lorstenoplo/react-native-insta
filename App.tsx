import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  DefaultTheme,
  Provider as PaperProvider,
  configureFonts,
} from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
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
import ChatScreen from "./components/shared/Chat";
import AboutScreen from "./components/shared/About";
import SaveScreen from "./components/main/Save";
import EditProfileScreen from "./components/main/EditProfile";
import CommentsScreen from "./components/main/Comments";
import PostScreen from "./components/shared/Post";
import { ActivityIndicator, Colors } from "react-native-paper";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { Camera } from "expo-camera";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.blue800,
    custom: Colors.white,
  },
  fonts: configureFonts({
    android: {
      regular: {
        fontFamily: "InstaSans",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "InstaSansMed",
        fontWeight: "700",
      },
      light: {
        fontFamily: "InstaSans",
        fontWeight: "normal",
      },
      thin: {
        fontFamily: "InstaSans",
        fontWeight: "normal",
      },
    },
    ios: {
      regular: {
        fontFamily: "InstaSans",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "InstaSansMed",
        fontWeight: "700",
      },
      light: {
        fontFamily: "InstaSans",
        fontWeight: "normal",
      },
      thin: {
        fontFamily: "InstaSans",
        fontWeight: "normal",
      },
    },
  }),
};

export default function App({ navigation }: any) {
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
        <ActivityIndicator size={60} color={Colors.blue500} />
      </View>
    );
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (!loggedIn && fontsLoaded) {
    return (
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <Stack.Navigator
            screenOptions={{ headerTitleStyle: { fontFamily: "InstaSans" } }}
            initialRouteName="Landing"
          >
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <Stack.Navigator
            screenOptions={{ headerTitleStyle: { fontFamily: "InstaSans" } }}
            initialRouteName="Main"
          >
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Add"
              navigation={navigation}
              component={AddScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen
              name="Save"
              navigation={navigation}
              component={SaveScreen}
            />
            <Stack.Screen
              name="EditProfile"
              navigation={navigation}
              component={EditProfileScreen}
            />
            <Stack.Screen
              name="Comments"
              navigation={navigation}
              component={CommentsScreen}
            />
            <Stack.Screen
              name="Post"
              navigation={navigation}
              component={PostScreen}
            />
          </Stack.Navigator>
        </PaperProvider>
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
