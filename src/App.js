import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "./redux/reducers/authReducer";

import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { AppLayout } from "./layout/AppLayout";
import { PrivateRoute } from "./pages/route/PrivateRoute";
import { HomePage } from "./pages/HomePage";
import { CalendarPage } from "./pages/CalendarPage";
import { WritePage } from "./pages/WritePage";
import { TasksPage } from "./pages/TasksPage";
import { DetailPage } from "./pages/DetailPage";
import { DataBase } from "./pages/DataBase";
import { SigninPage } from "./pages/SigninPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AccountPage } from "./pages/AccountPage";

const AUTO_LOGOUT_TIME = 15 * 60 * 1000; // 15분 (단위: 밀리초)

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const db = getFirestore();
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  const resetTimer = useCallback(() => {
    setLastActivityTime(Date.now());
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [resetTimer]);

  useEffect(() => {
    const checkAutoLogout = () => {
      if (Date.now() - lastActivityTime > AUTO_LOGOUT_TIME) {
        localStorage.removeItem("accessToken");
        dispatch(logout());
        navigate("/signin");
      }
    };

    const interval = setInterval(checkAutoLogout, 1000);
    return () => clearInterval(interval);
  }, [lastActivityTime, dispatch, navigate]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(); // Firebase로부터 토큰을 새로 가져옴
        localStorage.setItem("accessToken", token); // 로컬 스토리지에 토큰 저장

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          dispatch(login({ uid: user.uid, token, level: userData.level }));
        }
      } else {
        localStorage.removeItem("accessToken"); // 로그아웃된 경우 로컬 스토리지에서 토큰 제거
        dispatch(logout());
      }
      setLoading(false); // 로딩 완료
    });
  }, [dispatch]);

  // useEffect(() => {
  //   const auth = getAuth();

  //   const handleLogout = () => {
  //     auth
  //       .signOut(auth)
  //       .then(() => {
  //         console.log("User logged out");
  //       })
  //       .catch((error) => {
  //         console.error("Error logging out:", error);
  //       });
  //   };

  //   const handleBeforeUnload = () => {
  //     handleLogout();
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (location.pathname === "/settings") {
  //     alert("준비중");
  //     navigate("/");
  //   }
  // }, [location]);

  useEffect(() => {
    if (location.pathname === "/") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute loading={loading}>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="write" element={<WritePage />} />
        <Route path="detail" element={<DetailPage />} />
        <Route
          path="test"
          element={
            <PrivateRoute requiredLevel={1}>
              <DataBase />
            </PrivateRoute>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

      <Route path="signin" element={<SigninPage />} />
    </Routes>
  );
}

export default App;
