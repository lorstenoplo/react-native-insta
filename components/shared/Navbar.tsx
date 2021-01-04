import React from "react";
import { Menu, Appbar } from "react-native-paper";
import { auth } from "../../firebase";
import { Feather } from "@expo/vector-icons";
import { clearData } from "../../redux/actions";

type NavbarProps = {
  navigation?: any;
  title: string;
  home?: boolean;
};

const Navbar = ({ navigation, title, home = false }: NavbarProps) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header
      style={{
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        borderColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 0.5,
      }}
    >
      <Appbar.Content title={title} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          home ? (
            <Appbar.Action
              icon="send"
              color="black"
              onPress={() => {
                navigation.navigate("Chat");
              }}
            />
          ) : (
            <Appbar.Action icon="menu" color="black" onPress={openMenu} />
          )
        }
      >
        <Menu.Item
          onPress={() => {
            navigation.navigate("Chat");
            closeMenu();
          }}
          title="Chat"
        />
        <Menu.Item
          onPress={() => {
            navigation.navigate("About");
            closeMenu();
          }}
          title="About App"
        />
        <Menu.Item
          onPress={() => {
            auth.signOut();
            clearData();
          }}
          title="Logout"
        />
      </Menu>
    </Appbar.Header>
  );
};

export default Navbar;
