import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoadingUI } from "../components/LoadingUI";

export const PrivateRoute = ({ loading, children, requiredLevel }) => {
  const { token, level } = useSelector((state) => state.auth);

  if (loading) return <LoadingUI />;

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (level < requiredLevel) {
    alert("접근이 불가능합니다.");
    return <Navigate to="/" replace />;
  }

  return children;
};
