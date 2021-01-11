import React from "react";
import { View } from "react-native";
import Navbar from "../shared/Navbar";

const Following = ({ navigation }: any) => {
  return (
    <View>
      <Navbar navigation={navigation} title="Following" />
    </View>
  );
};

export default Following;
