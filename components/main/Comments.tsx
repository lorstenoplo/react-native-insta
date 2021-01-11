import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import db, { auth } from "../../firebase";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import firebase from "firebase";
import * as timeago from "timeago.js";

const Comments = ({ route, navigation }: any) => {
  const [comments, setComments] = useState<any>([]);
  const [postId, setPostId] = useState<string>("");
  const [text, setText] = useState<string>("");

  const { uid } = route.params;

  const dbRef = db
    .collection("posts")
    .doc(uid)
    .collection("userPosts")
    .doc(route.params?.postId)
    .collection("comments");

  useEffect(() => {
    if (route.params.postId !== postId) {
      dbRef.orderBy("creation", "desc").onSnapshot(
        (snapshot) => {
          let comments = snapshot.docs.map((comment) => {
            const id = comment.id;
            const data = comment.data();
            return { id, ...data };
          });
          setComments(comments);
        },
        (err) => {
          return Alert.alert("Opps!", err.message, [
            { text: "Ok", onPress: () => navigation.popToTop() },
          ]);
        }
      );
      setPostId(route.params.postId);
    }
  }, [route.params.postId]);

  const addComment = () => {
    if (text.trim() !== "") {
      dbRef
        .add({
          creater: auth.currentUser?.displayName,
          text,
          photoUrl: auth.currentUser?.photoURL,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => setText(""))
        .catch((err) =>
          Alert.alert("Opps!", err.message, [{ text: "Understood" }])
        );
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.container,
          { backgroundColor: "white", paddingHorizontal: 10 },
        ]}
      >
        <FlatList
          data={comments}
          extraData={comments}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
          horizontal={false}
          renderItem={({ item }) => (
            <View style={styles.commentCont}>
              {item.photoUrl ? (
                <Avatar.Image source={{ uri: item.photoUrl }} size={35} />
              ) : (
                <FontAwesome5 name="user-circle" size={35} color="black" />
              )}
              <View
                style={{ alignItems: "flex-start", marginLeft: 10, flex: 1 }}
              >
                <Text style={styles.comment}>
                  <Text style={{ fontFamily: "InstaSansMed", color: "black" }}>
                    {item.creater}
                  </Text>
                  {"  "}
                  {item.text}{" "}
                </Text>
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
            </View>
          )}
        />
      </View>
      <View style={styles.bottomCont}>
        {auth.currentUser?.photoURL ? (
          <Avatar.Image
            source={{ uri: auth.currentUser?.photoURL }}
            size={30}
            style={styles.Avatar}
          />
        ) : (
          <FontAwesome5
            style={styles.Avatar}
            name="user-circle"
            size={30}
            color="black"
          />
        )}
        <TextInput
          placeholder="Type your comment..."
          onChangeText={(text) => setText(text)}
          style={styles.container}
          value={text}
        />
        <TouchableOpacity onPress={addComment}>
          <Ionicons name="ios-send-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCont: {
    flexDirection: "row",
    padding: 10,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "lightgray",
    borderTopWidth: 0.5,
  },
  Avatar: {
    marginRight: 10,
  },
  commentCont: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 5,
  },
  comment: {
    fontFamily: "InstaSans",
    flex: 1,
    color: "rgba(0,0,0,0.7)",
    marginBottom: 5,
  },
});

export default Comments;
