import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import db from "../../firebase";
import { FontAwesome5 } from "@expo/vector-icons";

const Search = ({ navigation }: any) => {
  const [users, setUsers] = useState<any>([]);

  const getUsers = (search: string) => {
    db.collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <TextInput
              onChangeText={(search) => getUsers(search)}
              style={styles.searchBar}
              placeholder="Search for users"
            />
          </View>
          <FlatList
            style={styles.userCont}
            data={users}
            horizontal={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Profile", { uid: item.id })}
              >
                <View style={styles.result}>
                  <FontAwesome5 name="user-circle" size={40} color="black" />

                  <View style={styles.resultText}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            numColumns={1}
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: 80,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 2,
    paddingVertical: 6,
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: "white",
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: "#f1f3f4",
    flex: 1,
    borderRadius: 5,
    height: 10,
    paddingHorizontal: 10,
  },
  userCont: {
    paddingHorizontal: 10,
  },
  userName: {
    fontFamily: "InstaSansMed",
    fontSize: 18,
  },
  userEmail: {
    fontFamily: "InstaSans",
    color: "lightgray",
  },
  result: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 8,
    alignItems: "center",
  },
  resultText: {
    marginLeft: 20,
  },
});

export default Search;
