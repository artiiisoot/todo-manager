import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTransName } from "../../redux/reducers/taskReducer";
import { getModalState } from "../../redux/reducers/modalReducer";

export const SelectOption = ({ id, items }) => {
  const dispatch = useDispatch();

  function handleAdd() {
    switch (id) {
      case "state":
        dispatch(
          getModalState({ type: "state", title: "Add State", open: true })
        );
        break;
      case "group":
        dispatch(
          getModalState({ type: "group", title: "Add Goup", open: true })
        );
        break;
      case "tags":
        dispatch(getModalState({ type: "tag", title: "Add Tags", open: true }));
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    console.log("items", items);
  }, [items]);
  return (
    <div
      className={`result ${id === "tags" ? "" : "flex"}`}
      onClick={handleAdd}
    >
      {id === "state" && (
        <>
          {items ? (
            <div className={id}>
              <p className={items.name}>{getTransName(items.name)}</p>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </>
      )}

      {id === "group" && (
        <>
          {items ? (
            <div className={id}>
              <p className="ellipsis-1">{items.name}</p>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </>
      )}

      {id === "tags" && (
        <>
          {items && items.length > 0 ? (
            items.map((item, idx) => (
              <div className={`chip ${id}`} key={idx}>
                <p className="ellipsis-1">{item.name}</p>
              </div>
            ))
          ) : (
            <p>Empty</p>
          )}
        </>
      )}
    </div>
  );
};
