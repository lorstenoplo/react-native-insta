import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { ActivityIndicator, Colors, Avatar, Button } from "react-native-paper";
import { connect } from "react-redux";
import Navbar from "../shared/Navbar";
import { FontAwesome5, AntDesign, FontAwesome } from "@expo/vector-icons";
import * as timeago from "timeago.js";

const Feed = ({ navigation, usersLoaded, users, reduxFollowing }: any) => {
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    let posts: any = [];
    if (usersLoaded === reduxFollowing?.length) {
      for (let i = 0; i < reduxFollowing?.length; i++) {
        const user = users.find((el: any) => el.uid === reduxFollowing[i]);
        console.log(user);
        if (user !== undefined) {
          posts = [...posts, ...user.posts];
        }
      }
      posts.sort(function (x: any, y: any) {
        return x.creation - y.creation;
      });

      setPosts(posts);
      setLoading(false);
    }
    setRefresh(!refresh);
  }, [usersLoaded, reduxFollowing, users]);

  useEffect(() => {
    setRefresh(!refresh);
  }, [users]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={60} color={Colors.blue500} />
      </View>
    );
  }

  //console.log(posts);

  return (
    <View style={styles.container}>
      <Navbar home navigation={navigation} title="Instagram" />
      <View style={styles.galleryCont}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          extraData={refresh}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Profile", { uid: item.user.uid })
                }
              >
                <View style={styles.postUserInfo}>
                  {item.user.photoURL ? (
                    <Avatar.Image
                      style={styles.Avatar}
                      source={{ uri: item.user.photoURL }}
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
                    {item.user.name}
                  </Text>
                </View>
              </TouchableOpacity>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
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
                  <FontAwesome5
                    name="comment"
                    size={24}
                    color="rgba(0,0,0,0.8)"
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "InstaSans",
                    color: "gray",
                    fontSize: 12,
                  }}
                >
                  {timeago.format(
                    new Date(item.creation?.toDate()).toLocaleString()
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
                  {item.user.name}
                  {"   "}
                </Text>
                <Text
                  style={{
                    fontFamily: "InstaSans",
                    fontSize: 17,
                    marginTop: 10,
                    flex: 1,
                  }}
                >
                  {item.caption}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnCont: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
  },
  btn: {
    fontFamily: "InsaSans",
    flex: 1 / 2,
    marginHorizontal: 10,
  },
  galleryCont: {
    flex: 1,
    // paddingHorizontal: 5,
  },
  image: {
    minHeight: 300,
    flex: 1,
    aspectRatio: 1 / 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  post: {
    flex: 1,
    marginVertical: 10,
    maxWidth: 500,
    backgroundColor: "white",
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 0.5,
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
});

const mapStateToProps = (store: any) => ({
  currentUser: store.userState.currentUser,
  reduxFollowing: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
});

export default connect(mapStateToProps, null)(Feed);
