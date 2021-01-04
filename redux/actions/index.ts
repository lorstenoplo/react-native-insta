import db, { auth } from "../../firebase";
import {
  CLEAR_DATA,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
} from "../constants";

export function clearData() {
  return (dispatch: any) => {
    dispatch({
      type: CLEAR_DATA,
    });
  };
}

export function fetchUser() {
  return (dispatch: any) => {
    db.collection("users")
      .doc(auth.currentUser?.uid)
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
export function fetchUserPosts() {
  return (dispatch: any) => {
    db.collection("posts")
      .doc(auth.currentUser?.uid)
      .collection("userPosts")
      .orderBy("creation", "desc")
      .onSnapshot((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return { id, ...data };
        });
        dispatch({
          type: USER_POSTS_STATE_CHANGE,
          posts,
        });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch: any) => {
    db.collection("following")
      .doc(auth.currentUser?.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({
          type: USER_FOLLOWING_STATE_CHANGE,
          following,
        });
        for (let i = 0; i < following.length; i++) {
          dispatch(getUsersData(following[i]));
        }
      });
  };
}

export function getUsersData(uid: any) {
  return (dispatch: any, getState: any) => {
    const found = getState().usersState.users?.some(
      (el: any) => el.uid === uid
    );
    if (!found) {
      db.collection("users")
        .doc(uid)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            if (user) {
              user.uid = snapshot.id;
              dispatch({
                type: USERS_DATA_STATE_CHANGE,
                user,
              });
              dispatch(fetchUsersFollowingPosts(uid));
            }
          } else {
            console.log("does not exist");
          }
        });
    }
  };
}

export function fetchUsersFollowingPosts(uid: any) {
  return (dispatch: any, getState: any) => {
    db.collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "desc")
      .onSnapshot((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        const user = getState().usersState.users.find(
          (el: any) => el?.uid === uid
        );
        let posts = snapshot.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return { id, ...data, user };
        });
        dispatch({
          type: USERS_POSTS_STATE_CHANGE,
          posts,
          uid,
        });
      });
  };
}
