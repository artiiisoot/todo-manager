import React from "react";
import { useNavigate } from "react-router-dom";

export const DetailHeader = ({ title }) => {
  const navigate = useNavigate();

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
