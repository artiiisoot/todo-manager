import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { ModalHeader } from "./components/ModalHeader";

export const DialogAddGroup = () => {
  const dispatch = useDispatch();

  return (
    <div id="Dialog-AddGroup" className="modal">
      <div className="modal-header">
        <ModalHeader />
      </div>
      <div className="modal-body"></div>
    </div>
  );
};
