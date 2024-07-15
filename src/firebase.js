import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,

  apiKey: "AIzaSyAxzjqkxQ80swHHyQJS9KP1zfUjebCgYUc",
  authDomain: "todo-manager-3de80.firebaseapp.com",
  projectId: "todo-manager-3de80",
  storageBucket: "todo-manager-3de80.appspot.com",
  messagingSenderId: "958750918271",
  appId: "1:958750918271:web:6433e470143b8281bae14a",
  measurementId: "G-0PSLJ8J9SJ"
  // databaseURL: "https://todo-manager-3de80.asia-northeast3.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
