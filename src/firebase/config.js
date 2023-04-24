import firebase from "firebase/app";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBTgUYwSJ0t_zesLUkX_tdJbDntifWBxlc",
  authDomain: "kanban-frontendmentor.firebaseapp.com",
  projectId: "kanban-frontendmentor",
  storageBucket: "kanban-frontendmentor.appspot.com",
  messagingSenderId: "743354444984",
  appId: "1:743354444984:web:8a89893980adf8c7a1984d",
};
//init firebase
firebase.initializeApp(firebaseConfig);
const projectFirestore = firebase.firestore();
//timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export { projectFirestore, timestamp };
