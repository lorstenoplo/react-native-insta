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
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const user = await auth().signInWithEmailAndPassword(email, password);
      console.log(user);
      setLoading(false);
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
          loading={loading}
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
