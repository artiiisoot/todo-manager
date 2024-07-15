import React from "react";
import { useDispatch } from "react-redux";

import { getModalState } from "../../../redux/reducers/modalReducer";

export const ModalHeader = () => {
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(getModalState({ isDialog: false }));
  }

  return (
    <div
      id="Header"
      className="page header-content flex flex-row items-center justify-end"
    >
      <div className="page-title flex flex-col">
        <p>title</p>
      </div>

      <button className="btn-white" onClick={handleClose}>
        Done
      </button>
    </div>
  );
};
