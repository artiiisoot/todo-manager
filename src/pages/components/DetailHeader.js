import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { resetState } from "../../redux/reducers/taskReducer";

export const DetailHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const title = useSelector((state) => state.header.value.title);

  const [showMore, setShowMore] = useState(false);

  function storeReset() {
    dispatch(resetState());
  }

  const handleBack = () => {
    storeReset();
    navigate(-1);
  };

  function handleMore() {
    //
    setShowMore(!showMore);
  }

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

      <button className="icon material-icons-outlined" onClick={handleMore}>
        more_horiz
      </button>

      {showMore && (
        <div className="more-list">
          <button className="btn-flat primary">DELETE</button>
        </div>
      )}
    </div>
  );
};
