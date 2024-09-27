import React, { createContext, useContext, useEffect, useState } from "react";

//FIREBASE AUTH
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { LoadingUI } from "../pages/components/LoadingUI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      setUid(user?.uid);

      console.log("user.uid", user?.uid);

      setLoading(false); // 유저 상태를 확인한 후 로딩 완료
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // if(loading) return <LoadingUI />
  return (
    <AuthContext.Provider value={{ user, uid, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
