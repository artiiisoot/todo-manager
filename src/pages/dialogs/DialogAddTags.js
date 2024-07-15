import React from "react";

import { ModalHeader } from "./components/ModalHeader";

export const DialogAddTags = () => {
  return (
    <div id="Dialog-AddTags" className="modal">
      <div className="modal-dialog">
        <div className="modal-header">
          <ModalHeader />
        </div>
        <div className="modal-body">
          <input type="text" placeholder="Search for the option" />

          <p>Select an option or create one</p>
        </div>
        <div className="modal-footer">footer</div>
      </div>
    </div>
  );
};
