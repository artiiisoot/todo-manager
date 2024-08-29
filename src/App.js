import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./redux/reducers/authReducer";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { AppLayout } from "./layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { CalendarPage } from "./pages/CalendarPage";
import { WritePage } from "./pages/WritePage";
import { TasksPage } from "./pages/TasksPage";
import { DetailPage } from "./pages/DetailPage";
import { DataBase } from "./pages/DataBase";
import { SigninPage } from "./pages/SigninPage";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const uid = useSelector((state) => state.auth.uid);
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(); // Firebase로부터 토큰을 새로 가져옴
        localStorage.setItem("accessToken", token); // 로컬 스토리지에 토큰 저장
        dispatch(login({ uid: user.uid, token })); // Redux에 로그인 상태 저장
      } else {
        localStorage.removeItem("accessToken"); // 로그아웃된 경우 로컬 스토리지에서 토큰 제거
        dispatch(logout());
      }
      setLoading(false); // 로딩 완료
    });
  }, [dispatch]);

  useEffect(() => {
    console.log("localStorage", localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    console.log("uid", uid);
    console.log("token", token);
  }, [uid, token]);

  useEffect(() => {
    if (location.pathname === "/settings") {
      alert("준비중");
      navigate("/");
    }
  }, [location]);

  const PrivateRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>; // 로딩 중일 때는 로딩 메시지 표시
    return token ? children : <Navigate to="/signin" replace />;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="write" element={<WritePage />} />
        <Route path="detail" element={<DetailPage />} />
        <Route path="test" element={<DataBase />} />
        <Route path="settings" element={<div>준비중</div>} />
      </Route>

      <Route path="signin" element={<SigninPage />} />
    </Routes>
  );
}

export default App;
