import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore";

import { login } from "../redux/reducers/authReducer";

export const SigninPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const db = getFirestore();
  const [isLanding, setIsLanding] = useState(true);
  const [isSigninStart, setIsSigninStart] = useState(false);
  const [isSignupStart, setIsSignupStart] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword() {
    return password.length >= 6; // 최소 6자 이상
  }

  async function changeMode() {
    if (isLanding) {
      setIsLanding(false);
      setIsSigninStart(false);
      setIsSignupStart(true);
    } else if (isSigninStart) {
      setIsSigninStart(false);
      setIsSignupStart(true);
    } else if (isSignupStart) {
      setIsSigninStart(true);
      setIsSignupStart(false);
    }
  }

  async function handleSubmit() {
    // 랜딩페이지 일때
    if (isLanding) {
      setIsLanding(!isLanding);
      setIsSigninStart(true);
    }
    // 사인 인 스타트 일때
    if (isSigninStart) {
      if (!validateEmail(email)) {
        setError("올바른 이메일 주소를 입력해 주세요.");
        return;
      }
      if (!validatePassword(password)) {
        setError("비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }
      try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Firebase로부터 사용자 토큰을 가져옵니다.
        const token = await user.getIdToken();
        localStorage.setItem("accessToken", token);
        setEmail("");
        setPassword("");
        // 로그인 액션을 디스패치합니다. 여기서 올바른 uid와 token을 전달합니다.
        dispatch(login({ uid: user.uid, token }));
        // alert("로그인 성공!");
        navigate("/");
      } catch (error) {
        console.error("로그인 실패:", error.message);
        setError("이메일 주소와 비밀번호를 확인해주세요.");
      }
    }
    // 사인 업 스타트 일때
    if (isSignupStart) {
      if (!validateEmail(email)) {
        setError("올바른 이메일 주소를 입력해 주세요.");
        return;
      }
      if (!validatePassword(password)) {
        setError("비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }
      if (password !== passwordConfirm) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const token = await user.getIdToken();
        localStorage.setItem("accessToken", token);

        const userLevel = 1; // 기본 사용자 레벨 설정 (1은 일반 사용자, 10은 관리자 등)
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          level: userLevel,
          createdAt: new Date().toISOString(),
        });

        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        dispatch(login({ uid: user.uid, token, level: userLevel }));

        // alert("회원가입 성공!");
        navigate("/");
      } catch (error) {
        console.error("회원가입 실패:", error.message);
        alert("회원가입에 실패했습니다.");
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  useEffect(() => {
    // document.addEventListener('keydown', )
  });
  // useEffect(() => {
  //   console.log("랜딩 상태 : ", isLanding);
  //   console.log("사인 인 상태 : ", isSigninStart);
  //   console.log("사인 업 상태 : ", isSignupStart);
  // }, [isLanding, isSigninStart, isSignupStart]);
  return (
    <div id="LoginPage">
      <div className="container">
        {isLanding ? (
          <div className="login">
            <div className="title">
              <h5 className="text-xl">Todo Manager</h5>
            </div>
          </div>
        ) : (
          <div className="login">
            <div className="title">
              <h5 className="text-sm">Todo Manager</h5>
              <h5 className="text-xl">
                {isSigninStart ? "Sign in" : "Sign up"}
              </h5>
            </div>

            <div className="item-group">
              <div className="input-group">
                <div className="input">
                  <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </div>
                <div className="input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    required
                  />
                  <button
                    className="icons material-icons"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    visibility
                  </button>
                </div>
                {isSignupStart ? (
                  <div className="input">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="PASSWORD CONFIRM"
                      value={passwordConfirm}
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                        setError("");
                      }}
                      onKeyDown={handleKeyDown}
                      required
                    />
                    <button
                      className="icons material-icons"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      visibility
                    </button>
                  </div>
                ) : null}
                {error && <span className="error-msg fadeInDown">{error}</span>}
              </div>
            </div>
          </div>
        )}

        <div className="button-group">
          <button className="btn-white" onClick={handleSubmit}>
            {isLanding ? "Sign in" : "Confirm"}
          </button>

          <p>
            {!isSignupStart
              ? `Don’t have an account?${" "}`
              : `Do you have an account?${" "}`}

            <span onClick={changeMode}>
              {isSignupStart ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
