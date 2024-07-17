import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getHeaderState } from "../../../redux/reducers/headerReducer";
import { getModalState } from "../../../redux/reducers/modalReducer";

export const ModalHeader = () => {
  const dispatch = useDispatch();
  const modalTitle = useSelector((state) => state.modal.value.title);

  function handleClose() {
    dispatch(getModalState({ type: "", title: "", open: false }));
  }

  return (
    <div
      id="Header"
      className="page header-content flex flex-row items-center justify-end"
    >
      <div className="page-title flex flex-col">
        <p>{modalTitle}</p>
      </div>

      <button className="btn-white" onClick={handleClose}>
        Done
      </button>
    </div>
  );
};
