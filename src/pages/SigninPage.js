import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";

import { login } from "../redux/reducers/authReducer";

export const SigninPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSigninStart, setIsSigninStart] = useState(false);
  const [isSignupStart, setIsSignupStart] = useState(false);
  const [email, setEmail] = useState("artiiisoot@gmail.com");
  const [password, setPassword] = useState("1q2w3e");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  async function changeMode() {
    if (!isSigninStart || !isSignupStart) {
      setIsSignupStart(true);
      setIsSigninStart(false);

      if (isSignupStart) {
        setIsSigninStart(true);
        setIsSignupStart(false);
      } else {
        setIsSigninStart(false);
        setIsSignupStart(true);
      }
    }
  }

  async function handleSubmit(type) {
    if (type === "signin") {
      setIsSigninStart(true);
    } else {
      const auth = getAuth();
      if (isSigninStart) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          // userCredential.user가 undefined인지 확인
          if (!userCredential || !userCredential.user) {
            throw new Error("User credential is undefined");
          }
          const user = userCredential.user;

          // Firebase로부터 사용자 토큰을 가져옵니다.
          const token = await user.getIdToken();
          localStorage.setItem("accessToken", token);
          console.log("user", user);
          setEmail("");
          setPassword("");
          // 로그인 액션을 디스패치합니다. 여기서 올바른 uid와 token을 전달합니다.
          dispatch(login({ uid: user.uid, token }));
          alert("로그인 성공!");
          navigate("/");
        } catch (error) {
          console.error("로그인 실패:", error.message);
          alert("로그인에 실패했습니다.");
        }
      } else if (isSignupStart) {
        try {
          if (password === passwordConfirm) {
            setError("");
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
            const token = await user.getIdToken();
            localStorage.setItem("accessToken", token);
            setEmail("");
            setPassword("");
            setPasswordConfirm("");
            dispatch(login());
            alert("회원가입 성공!");
            navigate("/");
          } else {
            setError("비밀번호가 일치하지 않습니다.");
          }
        } catch (error) {
          console.error("회원가입 실패:", error.message);
          alert("회원가입에 실패했습니다.");
        }
      }
    }
  }
  return (
    <div id="LoginPage">
      <div className="container">
        <div className="login">
          <div className="title">
            <h5
              className={`${
                isSigninStart || isSignupStart ? "text-sm" : "text-xl"
              }`}
            >
              Todo Manager
            </h5>
            {isSigninStart || isSignupStart ? (
              <h5 className="text-xl">
                {isSigninStart ? "Sign in" : "Sign up"}
              </h5>
            ) : null}
          </div>

          {isSigninStart || isSignupStart ? (
            <div className="item-group">
              <div className="input-group">
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
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                />
                {isSignupStart ? (
                  <input
                    type="password"
                    placeholder="PASSWORD CONFIRM"
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      setError("");
                    }}
                    required
                  />
                ) : null}
                {error && <span className="error-msg">{error}</span>}
              </div>
            </div>
          ) : null}
        </div>

        <div className="button-group">
          <button
            className="btn-white"
            onClick={() =>
              handleSubmit(isSigninStart || isSignupStart ? null : "signin")
            }
          >
            {isSigninStart ? "Confirm" : isSignupStart ? "Confirm " : "Sign in"}
          </button>

          <p>
            Don’t have an account?{" "}
            <span onClick={changeMode}>
              {isSignupStart ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
