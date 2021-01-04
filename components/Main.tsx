import React, { useEffect } from "react";
import { Text } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchUser,
  fetchUserFollowing,
  fetchUserPosts,
  clearData,
} from "../redux/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/Search";
import FollowingScreen from "./main/Following";
import { auth } from "../firebase";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const Main = ({
  currentUser,
  fetchUser,
  fetchUserPosts,
  theme,
  fetchUserFollowing,
  clearData,
}: any) => {
  useEffect(() => {
    fetchUser();
    fetchUserPosts();
    fetchUserFollowing();
    clearData();
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
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={24} color={color} />
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
        name="Shorts"
        component={FollowingScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="heart" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Profile", { uid: auth.currentUser?.uid });
          },
        })}
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
  bindActionCreators(
    { fetchUser, fetchUserPosts, fetchUserFollowing, clearData },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
