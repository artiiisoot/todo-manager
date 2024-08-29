import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,

  // apiKey: "AIzaSyDGxvdXs_zjzwqa-5zuVLqOE9I059uHVR4",
  // authDomain: "todoapp-fdf75.firebaseapp.com",
  // projectId: "todoapp-fdf75",
  // storageBucket: "todoapp-fdf75.appspot.com",
  // messagingSenderId: "835085894913",
  // appId: "1:835085894913:web:dfbdc774fbf7ef09360700",
  // measurementId: "G-07LVWFW9PH"
  // databaseURL: "https://todo-manager-3de80.asia-northeast3.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 로그인 함수
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
// 로그아웃 함수
export const logout = () => signOut(auth);
// 인증 상태 변경 감지
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
