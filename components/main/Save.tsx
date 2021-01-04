import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from "react-native-paper";
import db, { storage, auth } from "../../firebase";
import * as firebase from "firebase";

const Save = ({ route, navigation }: any) => {
  const { image } = route.params;
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const savePostData = (downloadURL: any) => {
    db.collection("posts")
      .doc(auth.currentUser?.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => navigation.popToTop())
      .then(() => setLoading(false))
      .catch((err) =>
        Alert.alert("Opps!, could not Login", err.message, [{ text: "Ok" }])
      );
  };

  const uploadImage = async () => {
    setLoading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const childStorageRef = `post/${auth.currentUser}/${Math.random().toString(
      36
    )}`;

    const task = storage.ref().child(childStorageRef).put(blob);

    const taskProgress = (snapshot: any) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot: any) => {
        savePostData(snapshot);
        //console.log(snapshot);
      });
    };

    const taskError = (error: any) => {
      Alert.alert("Opps!, an error occured", error, [{ text: "Ok" }]);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };
  //console.log(image);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.inputCont}>
            <TextInput
              placeholder="Write a caption"
              onChangeText={(caption) => setCaption(caption)}
              style={styles.input}
              multiline
            />
            <Image source={{ uri: image }} style={styles.img} />
          </View>
          <Button
            disabled={loading}
            loading={loading}
            mode="contained"
            onPress={uploadImage}
          >
            Save
          </Button>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  img: {
    height: 50,
    width: 50,
    aspectRatio: 1 / 1,
    marginVertical: 20,
  },
  input: {
    marginVertical: 10,
    fontFamily: "InstaSans",
    fontSize: 20,
    flex: 1,
  },
  inputCont: {
    flexDirection: "row",
    width: "100%",
  },
});

export default Save;
