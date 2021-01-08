import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Alert, View } from "react-native";
import { auth } from "../../firebase";
import db from "../../firebase";
import { TextInput, Button, Colors } from "react-native-paper";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  let mounted = true;

  useEffect(() => {
    return function cleanUp() {
      mounted = false;
    };
  }, []);

  const signUp = async () => {
    setLoading(true);
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      const currUser = auth.currentUser;
      //console.log(user);

      await db.collection("users").doc(auth.currentUser?.uid).set({
        name,
        email,
      });

      await auth.currentUser?.updateProfile({
        displayName: name,
      });
      if (mounted) setLoading(false);

      return user;
    } catch (err) {
      setLoading(false);
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
          focusable={false}
          mode="contained"
          style={styles.button}
          onPress={signUp}
          loading={loading}
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
    marginHorizontal: "auto",
  },
});

export default Register;
