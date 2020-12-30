import React from "react";
import { View, Text, Button } from "react-native";
import { auth } from "../../firebase";

const Profile = () => {
  return (
    <View>
      <Text>Profile</Text>
      <Button title="logout" onPress={() => auth.signOut()} />
    </View>
  );
};

export default Profile;
