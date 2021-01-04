import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

export default function Add({ navigation }: any) {
  const [hasCameraPermission, setHasCameraPermission] = useState<any>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<any>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState<any>(null);
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <Text>Wait..</Text>;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return (
      <SafeAreaView>
        <Text>Please Grant access</Text>;
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({
        quality: 0.6,
      });
      setImage(data.uri);
      //if (image !== null) navigation.navigate("Save", { image });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6,
    });

    if (!result.cancelled) {
      await setImage(result.uri);
      //navigation.navigate("Save", { image });
    }
  };

  if (image) {
    return (
      <View style={styles.container2}>
        <Image source={{ uri: image }} style={styles.img} />
        <View style={styles.imgOptions}>
          <TouchableOpacity onPress={() => setImage(null)}>
            <MaterialIcons name="cancel" size={65} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Save", { image })}
          >
            <AntDesign name="checkcircleo" size={60} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => setCamera(ref)}
        ratio="15:9"
        style={styles.camera}
        type={type}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.leftButton}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Ionicons name="camera-reverse-outline" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.centerBtn} onPress={takePicture}>
            <FontAwesome name="circle-thin" size={85} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightBtn} onPress={pickImage}>
            <FontAwesome name="photo" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    height: 50,
  },
  leftButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  centerBtn: {
    alignSelf: "flex-end",
  },
  rightBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  container2: {
    flex: 1,
    padding: 10,
  },
  img: {
    maxWidth: 340,
    flex: 1,
    aspectRatio: 16 / 9,
  },
  imgOptions: {
    flexDirection: "row",
    flex: 1,
    marginVertical: 30,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
