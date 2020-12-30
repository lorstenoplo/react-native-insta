import React, { useEffect } from "react";
import { Text } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const Main = ({ currentUser, fetchUser }: any) => {
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Tab.Navigator
      activeColor="#333"
      inactiveColor="gray"
      labeled={false}
      initialRouteName="Feed"
      barStyle={{ backgroundColor: "#fff" }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-variant"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="mainAdd"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Add");
          },
        })}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="pluscircle" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = (store: any) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch: any) =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
