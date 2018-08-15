
import firebase from 'firebase/app';

const app = firebase.initializeApp({
  apiKey: "AIzaSyDNHYF2GGTf07kfNTKqTlTx25v8VeFGpmY",
  authDomain: "save-the-sheeps.firebaseapp.com",
  databaseURL: "https://save-the-sheeps.firebaseio.com",
  projectId: "save-the-sheeps",
  storageBucket: "save-the-sheeps.appspot.com",
  messagingSenderId: "693383222482"
})

export default app;