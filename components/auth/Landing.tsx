import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Button, TextInput } from "react-native-paper";

const img = require("../../images/landing.jpg");

const Landing = ({ navigation }: any) => {
  return (
    <ImageBackground source={img} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <View style={styles.button}>
          <Text style={styles.text}>Register with Email</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <View style={styles.button}>
          <Text style={styles.text}>Login</Text>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingVertical: 200,
  },
  button: {
    width: 300,
    paddingHorizontal: "auto",
    paddingVertical: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginVertical: 10,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "InstaSansMed",
  },
});

export default Landing;
