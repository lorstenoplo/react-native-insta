import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOxP8VVslzaBCtq8OjXZvP_iFqBCs5J58",
  authDomain: "insta-clone-native.firebaseapp.com",
  projectId: "insta-clone-native",
  storageBucket: "insta-clone-native.appspot.com",
  messagingSenderId: "859778720829",
  appId: "1:859778720829:web:8f721aae0e3e4ef370f654",
  measurementId: "G-B4NP75ZPHG",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export default db;
export { auth, firebaseConfig, storage };
