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
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { TouchableRipple, Appbar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default function Add({ navigation }: any) {
  const [hasCameraPermission, setHasCameraPermission] = useState<any>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<any>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [galleryImage, setGalleryImage] = useState<any>(null);
  const [capturing, setCapturing] = useState<any>(null);
  const [flashMode, setFlashMode] = useState<any>(null);

  const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
    setFlashMode(CameraFlashModes.off);
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

  const Navbar = () => (
    <View style={styles.nav}>
      <View style={styles.leftNav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "InstaSans",
            marginLeft: 10,
            color: "black",
            fontSize: 20,
          }}
        >
          {" "}
          Add photo{" "}
        </Text>
      </View>
      <View style={styles.rightNav}>
        <TouchableOpacity
          onPress={() =>
            setFlashMode(
              flashMode === CameraFlashModes.on
                ? CameraFlashModes.off
                : CameraFlashModes.on
            )
          }
        >
          <Ionicons
            name={
              flashMode == CameraFlashModes.on ? "md-flash" : "md-flash-off"
            }
            color="black"
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

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
      await setGalleryImage(result.uri);
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

  if (galleryImage) {
    return (
      <View style={styles.container2}>
        <Image
          source={{ uri: galleryImage }}
          style={{ width: winWidth, aspectRatio: 16 / 9, flex: 1 }}
        />
        <View style={styles.imgOptions2}>
          <TouchableOpacity onPress={() => setGalleryImage(null)}>
            <MaterialIcons name="cancel" size={85} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Save", { image: galleryImage })}
          >
            <AntDesign name="checkcircleo" size={80} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
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
            <Ionicons name="camera-reverse-outline" size={37} color="white" />
          </TouchableOpacity>
          <TouchableWithoutFeedback
            onPress={takePicture}
            onPressIn={() => setCapturing(true)}
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
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    height: 50,
  },
  leftButton: {
    alignItems: "center",
    marginBottom: 14,
    alignSelf: "flex-end",
  },
  rightBtn: {
    marginBottom: 20,
    alignSelf: "flex-end",
  },
  container2: {
    width: winWidth,
    height: winHeight,
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  img: {
    maxWidth: 340,
    flex: 1,
    aspectRatio: 16 / 9,
  },
  imgOptions: {
    flexDirection: "row",
    marginVertical: 25,
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "white",
    height: 100,
    width: 170,
  },
  imgOptions2: {
    flexDirection: "row",
    marginVertical: 25,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    flex: 1,
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 80,
    borderColor: "#FFFFFF",
    alignSelf: "flex-end",
  },
  captureBtnActive: {
    width: 80,
    height: 80,
  },
  captureBtnInternal: {
    width: 76,
    height: 76,
    borderWidth: 4,
    borderRadius: 76,
    backgroundColor: "red",
    borderColor: "transparent",
  },
  nav: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
    height: 80,
  },
  leftNav: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
  },
  rightNav: {},
});
