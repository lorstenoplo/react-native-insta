import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
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

export default function Add({ navigation, flashMode }: any) {
  const [hasCameraPermission, setHasCameraPermission] = useState<any>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<any>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [capturing, setCapturing] = useState<any>(null);

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
      setCapturing(false);
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
      <ImageBackground source={{ uri: image }} style={styles.container2}>
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
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => setCamera(ref)}
        ratio="15:9"
        style={styles.camera}
        type={type}
        flashMode={flashMode}
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
          <TouchableWithoutFeedback
            onPress={takePicture}
            onPressIn={() => setCapturing(false)}
          >
            <View
              style={[styles.captureBtn, capturing && styles.captureBtnActive]}
            >
              {capturing && <View style={styles.captureBtnInternal} />}
            </View>
          </TouchableWithoutFeedback>
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
    alignSelf: "flex-end",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    height: 50,
  },
  leftButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  rightBtn: {
    marginBottom: 20,
  },
  container2: {
    flex: 1,
  },
  img: {
    maxWidth: 340,
    flex: 1,
    aspectRatio: 16 / 9,
  },
  imgOptions: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "white",
    height: 100,
    width: 170,
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: "#FFFFFF",
  },
  captureBtnActive: {
    width: 80,
    height: 80,
  },
  captureBtnInternal: {
    width: 74,
    height: 74,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: "red",
    borderColor: "transparent",
  },
});
