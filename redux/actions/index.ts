import firebase, { auth } from "firebase";
import { USER_STATE_CHANGE } from "../constants";
import db from "../../firebase";

export function fetchUser() {
  return (dispatch: any) => {
    db.collection("users")
      .doc(auth().currentUser?.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({
            type: USER_STATE_CHANGE,
            currentUser: snapshot.data(),
          });
        } else {
          console.log("does not exist");
        }
      });
  };
}
