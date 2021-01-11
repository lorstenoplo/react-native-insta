import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as timeago from "timeago.js";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";

const Post = ({ route, navigation }: any) => {
  const [postInfo, setPostInfo] = useState<any>();

  useEffect(() => {
    if (postInfo !== route.params.postInfo) setPostInfo(route.params.postInfo);
  }, [route.params.postInfo]);

  if (route.params.user) {
    return (
      <View style={styles.post}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", { uid: route.params?.uid })
          }
        >
          <View style={styles.postUserInfo}>
            {route.params.user.photoURL || route.params.user.photoUrl ? (
              <Avatar.Image
                style={styles.Avatar}
                source={{
                  uri: route.params.user.photoUrl || route.params.user.photoURL,
                }}
                size={40}
              />
            ) : (
              <FontAwesome5
                style={styles.Avatar}
                name="user-circle"
                size={30}
                color="black"
              />
            )}
            <Text style={{ fontFamily: "InstaSansMed", fontSize: 20 }}>
              {route.params.user.displayName || route.params.user.name}
            </Text>
          </View>
        </TouchableOpacity>
        <Image style={styles.image} source={{ uri: postInfo?.downloadURL }} />
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign
              style={{ marginRight: 20 }}
              name="hearto"
              size={24}
              color="black"
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Comments", {
                  postId: postInfo?.id,
                  uid: route.params.uid,
                })
              }
            >
              <FontAwesome5 name="comment" size={24} color="rgba(0,0,0,0.8)" />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontFamily: "InstaSans",
              color: "gray",
              fontSize: 12,
            }}
          >
            {timeago.format(
              new Date(postInfo?.creation?.toDate()).toLocaleString()
            )}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "InstaSansMed",
              fontSize: 17,
              marginTop: 10,
            }}
          >
            {route.params.user.displayName || route.params.user.name}
            {"  "}
          </Text>
          <Text
            style={{
              fontFamily: "InstaSans",
              fontSize: 17,
              marginTop: 10,
              flex: 1,
            }}
          >
            {postInfo?.caption}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.post}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Profile", { uid: postInfo?.user.uid })
        }
      >
        <View style={styles.postUserInfo}>
          {postInfo?.user.photoURL ? (
            <Avatar.Image
              style={styles.Avatar}
              source={{ uri: postInfo?.user.photoURL }}
              size={40}
            />
          ) : (
            <FontAwesome5
              style={styles.Avatar}
              name="user-circle"
              size={30}
              color="black"
            />
          )}
          <Text style={{ fontFamily: "InstaSansMed", fontSize: 20 }}>
            {postInfo?.user.name}
          </Text>
        </View>
      </TouchableOpacity>
      <Image style={styles.image} source={{ uri: postInfo?.downloadURL }} />
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign
            style={{ marginRight: 20 }}
            name="hearto"
            size={24}
            color="black"
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Comments", {
                postId: postInfo?.id,
                uid: postInfo?.user.uid,
              })
            }
          >
            <FontAwesome5 name="comment" size={24} color="rgba(0,0,0,0.8)" />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: "InstaSans",
            color: "gray",
            fontSize: 12,
          }}
        >
          {timeago.format(
            new Date(postInfo?.creation?.toDate()).toLocaleString()
          )}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "InstaSansMed",
            fontSize: 17,
            marginTop: 10,
          }}
        >
          {postInfo?.user.name}
          {"  "}
        </Text>
        <Text
          style={{
            fontFamily: "InstaSans",
            fontSize: 17,
            marginTop: 10,
            flex: 1,
          }}
        >
          {postInfo?.caption}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    flex: 1,
    marginVertical: 15,
    backgroundColor: "white",
    borderColor: "rgba(0,0,0,0.1)",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  postUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  Avatar: {
    marginRight: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 16 / 9,
    maxWidth: "100%",
  },
});

export default Post;
