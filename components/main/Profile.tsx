import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import db, { auth } from "../../firebase";
import { Avatar, Button, ActivityIndicator, Colors } from "react-native-paper";
import Navbar from "../shared/Navbar";
import { connect } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";

const Profile = ({
  navigation,
  posts,
  route,
  reduxFollowing,
  currentUser,
}: any) => {
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [following, setFollowing] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [bio, setBio] = useState<any>("");

  useEffect(() => {
    if (route.params.uid === auth.currentUser?.uid) {
      setUser(auth.currentUser);
      setUserPosts(posts);
      setLoading(false);
      setRefresh(!refresh);
      db.collection("users")
        .doc(auth.currentUser?.uid)
        .onSnapshot((snapshot) => {
          setBio(snapshot.data()?.bio);
        });
    }
  }, [posts, route.params.uid]);

  useEffect(() => {
    if (route.params.uid !== auth.currentUser?.uid) {
      db.collection("users")
        .doc(route.params?.uid)
        .get()
        .then((snapshot) => {
          setLoading(false);
          if (snapshot.exists) {
            setUser(snapshot.data());
            setBio(user?.bio);
          } else {
            console.log("does not exist");
          }
        });

      db.collection("posts")
        .doc(route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "desc")
        .onSnapshot((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const id = doc.id;
            const data = doc.data();
            return { id, ...data };
          });
          setUserPosts(posts);
          setRefresh(!refresh);
        });

      if (reduxFollowing.indexOf(route.params.uid) > -1) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
  }, [route.params.uid, reduxFollowing]);

  useEffect(() => {
    setRefresh(!refresh);
  }, [userPosts]);

  const onFollow = () => {
    db.collection("following")
      .doc(auth.currentUser?.uid)
      .collection("userFollowing")
      .doc(route.params.uid)
      .set({})
      .then(() => setFollowing(true))
      .catch((err) =>
        Alert.alert("Opps!, could not Login", err.message, [{ text: "Ok" }])
      );
  };

  //console.log(bio);

  const onUnfollow = () => {
    db.collection("following")
      .doc(auth.currentUser?.uid)
      .collection("userFollowing")
      .doc(route.params.uid)
      .delete()
      .then(() => setFollowing(false))
      .catch((err) =>
        Alert.alert("Opps!, could not Login", err.message, [{ text: "Ok" }])
      );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={60} color={Colors.blue500} />
      </View>
    );
  }

  //console.log(userPosts);
  //console.log("posts from redux", posts);

  const TwoBtn = () => (
    <>
      {following ? (
        <Button
          style={styles.btn}
          uppercase={false}
          mode="outlined"
          color={Colors.green500}
          onPress={onUnfollow}
        >
          Following
        </Button>
      ) : (
        <Button
          style={styles.btn}
          uppercase={false}
          mode="outlined"
          color="black"
          onPress={onFollow}
        >
          Follow
        </Button>
      )}
      <Button
        style={styles.btn}
        uppercase={false}
        mode="outlined"
        color="black"
        onPress={() => navigation.navigate("Chat")}
      >
        Chat
      </Button>
    </>
  );

  const OneBtn = () => (
    <Button
      style={styles.btn2}
      uppercase={false}
      mode="outlined"
      color="black"
      onPress={() => navigation.navigate("EditProfile", { user })}
    >
      Edit Profile
    </Button>
  );

  const imgSrc = user?.photoURL;
  //console.log(userPosts);

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} title={user?.name || user?.displayName} />

      <View style={styles.topContainer}>
        {imgSrc ? (
          <Avatar.Image source={{ uri: imgSrc }} />
        ) : (
          <FontAwesome5 name="user-circle" size={60} color="black" />
        )}
        <View style={styles.topRightCont}>
          {!bio ? (
            <>
              <Text style={styles.label}>
                Name :{" "}
                <Text style={styles.text}>
                  {user?.displayName || user?.name}
                </Text>
              </Text>
              <Text style={styles.label}>
                Email : <Text style={styles.text}>{user?.email}</Text>
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>
                Name :{" "}
                <Text style={styles.text}>
                  {user?.displayName || user?.name}
                </Text>
              </Text>
              <Text style={styles.label}>
                <Text style={styles.text}>{user?.bio || bio}</Text>
              </Text>
            </>
          )}
        </View>
      </View>

      {route.params.uid === auth.currentUser?.uid ? (
        <View style={styles.btnCont}>
          <OneBtn />
        </View>
      ) : (
        <View style={styles.btnCont}>
          <TwoBtn />
        </View>
      )}

      <View style={styles.galleryCont}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          horizontal={false}
          data={userPosts}
          extraData={refresh}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Post", {
                  postInfo: item,
                  user: user,
                  uid: route.params.uid,
                })
              }
            >
              <Image style={styles.image} source={{ uri: item?.downloadURL }} />
            </TouchableOpacity>
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
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
  },
  topRightCont: {
    marginLeft: 30,
    flex: 1,
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "InstaSans",
    fontSize: 20,
  },
  label: {
    fontFamily: "InstaSansMed",
    fontSize: 20,
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
  btn2: {
    fontFamily: "InsaSans",
    flex: 1,
    marginHorizontal: 10,
  },
  galleryCont: {
    flex: 1,
    paddingHorizontal: 15,
  },
  image: {
    flex: 1 / 3,
    aspectRatio: 1 / 1,
    height: 100,
    margin: 5,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (store: any) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  reduxFollowing: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);
