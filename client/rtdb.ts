import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "XEJLGi5IIeRTo3FufrvU2MyhOc7ko87P06BSh2vl",
  authDomain: "piedra-d355.firebaseapp.com",
  databaseURL: "https://piedra-d355-default-rtdb.firebaseio.com/",
});

const rtdb = firebase.database();

export { rtdb };
