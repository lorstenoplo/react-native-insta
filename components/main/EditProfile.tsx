import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Avatar, TextInput, Colors, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { users } from "../../redux/reducers/users";
import db, { auth, storage } from "../../firebase";
import { FontAwesome5 } from "@expo/vector-icons";

const EditProfile = ({ route, navigation }: any) => {
  const { user } = route.params;
  const [hasGalleryPermission, setHasGalleryPermission] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [bio, setBio] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
    setImage(user.photoURL);
    db.collection("users")
      .doc(auth.currentUser?.uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data?.bio !== undefined) {
          setBio(data?.bio);
        }
        return data?.bio;
      })
      .catch(() => false);
  }, []);

  if (hasGalleryPermission === null) {
    return <Text>Wait..</Text>;
  }
  if (hasGalleryPermission === false) {
    return (
      <SafeAreaView>
        <Text>Please Grant access</Text>;
      </SafeAreaView>
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
    });

    if (!result.cancelled) {
      await setImage(result.uri);
    }
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
        auth.currentUser?.updateProfile({
          photoURL: snapshot,
        });
        db.collection("users").doc(user.uid).update({
          photoURL: snapshot,
        });
      });
    };

    const taskError = (error: any) => {
      Alert.alert("Opps!, an error occured", error, [{ text: "Ok" }]);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const updateProfile = async () => {
    if (user.photoURL !== image) {
      await uploadImage();
      await setLoading(false);
      await navigation.navigate("Profile");
    }

    db.collection("users")
      .doc(user.uid)
      .set({
        name: user.displayName || user.name,
        email: user.email,
        bio,
      })
      .then(() => {
        setLoading(false);
        navigation.navigate("Profile");
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          <View style={{ alignItems: "center", minWidth: 290 }}>
            {image ? (
              <Avatar.Image source={{ uri: image }} />
            ) : (
              <FontAwesome5 name="user-circle" size={60} color="black" />
            )}
            <Text style={styles.text}>Change Profile Photo</Text>
          </View>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          mode="outlined"
          value={user.displayName || user.name}
          disabled
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder="Enter your Bio"
          label="Bio"
          value={bio}
          onChangeText={(e) => setBio(e)}
          multiline
        />
        <Button
          onPress={updateProfile}
          loading={loading}
          style={styles.btn}
          mode="contained"
        >
          Update profile
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  text: {
    color: Colors.blue600,
    fontSize: 13,
    fontFamily: "InstaSans",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    width: 300,
    marginTop: 10,
  },
  btn: {
    marginTop: 20,
    width: 300,
  },
});

export default EditProfile;
