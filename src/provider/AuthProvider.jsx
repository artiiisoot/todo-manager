import React, { createContext, useContext, useEffect, useState } from "react";

//FIREBASE AUTH
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUid(user?.uid);
      setPhotoURL(user?.photoURL);

      console.log("user.uid", user?.uid);
      console.log("user.photoURL", user?.photoURL);

      // setLoading(false); // 유저 상태를 확인한 후 로딩 완료
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // if(loading) return <LoadingUI />
  return (
    <AuthContext.Provider value={{ user, uid }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
