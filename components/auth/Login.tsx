import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Alert,
  StyleSheet,
  Image,
  Text,
  Button as Btn,
  TouchableOpacity,
} from "react-native";
import { auth } from "firebase";
import { Button, Colors, TextInput } from "react-native-paper";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<any>("");

  const signIn = async () => {
    try {
      const user = await auth().signInWithEmailAndPassword(email, password);
      console.log(user);
      return user;
    } catch (err) {
      setError(err.message);
      return err;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* <Image
          source={require("../../images/logoblack.png")}
          style={styles.image}
        /> */}
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          style={[styles.input, { marginBottom: 20 }]}
          mode="outlined"
          label="Password"
          secureTextEntry={true}
          onChangeText={(e) => setPassword(e)}
          value={password}
        />
        <Button
          focusable={false}
          color={Colors.blue500}
          onPress={signIn}
          mode="contained"
        >
          Sign In
        </Button>
        <Text>{error && <Text>{error}</Text>}</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 30,
    width: 100,
    marginHorizontal: "auto",
  },
  input: {
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    width: 300,
    height: 50,
  },
});

export default Login;