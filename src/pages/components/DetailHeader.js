import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const DetailHeader = () => {
  const navigate = useNavigate();
  const title = useSelector((state) => state.header.value.title);

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div
      id="Header"
      className="page header-content flex flex-row items-center justify-between"
    >
      <button className="icon material-icons-outlined" onClick={handleBack}>
        arrow_back_ios
      </button>

      <div className="page-title flex flex-col">
        <p>{title}</p>
      </div>

      <button className="icon material-icons-outlined">more_horiz</button>
    </div>
  );
};
