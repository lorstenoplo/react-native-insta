import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Alert, View } from "react-native";
import { auth } from "../../firebase";
import db from "../../firebase";
import { TextInput, Button, Colors } from "react-native-paper";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signUp = async () => {
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);

      //console.log(user);

      await db.collection("users").doc(auth.currentUser?.uid).set({
        name,
        email,
      });

      return user;
    } catch (err) {
      return Alert.alert("Opps!, could not Login", err.message, [
        { text: "Understood" },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Name"
          value={name}
          onChangeText={(e) => setName(e)}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Password"
          secureTextEntry={true}
          onChangeText={(e) => setPassword(e)}
          value={password}
        />
        <Button
          color={Colors.blue500}
          focusable={false}
          mode="contained"
          style={styles.button}
          onPress={signUp}
        >
          Sign Up
        </Button>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "auto",
  },
  input: {
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: 300,
    height: 50,
  },
  button: {
    width: 300,
    marginTop: 5,
    height: 40,
    marginHorizontal: "auto",
  },
});

export default Register;
