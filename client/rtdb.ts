import firebase from "firebase";

const app = firebase.initializeApp({
//   apiKey: "BkyrkL6sIKSW2bw5lqhcfC2ecmjUCA6ssTGq07CN",
//   authDomain: "chat-app44-dc0bd.firebaseapp.com",
//   databaseURL: "https://chat-app44-dc0bd-default-rtdb.firebaseio.com",
});

const rtdb = firebase.database();

export { rtdb };
