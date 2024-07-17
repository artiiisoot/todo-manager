import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { getHeaderState } from "../../redux/reducers/headerReducer";

import { useNavigate } from "react-router-dom";

export const Tabbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isTabbarLeft, setIsTabbarLeft] = useState([
    {
      id: 1,
      name: "home",
      active: false,
      route: "/",
    },
    {
      id: 2,
      name: "calendar_month",
      active: false,
      route: "/calender",
    },
  ]);
  const [isTabbarRight, setIsTabbarRight] = useState([
    {
      id: 3,
      name: "format_list_bulleted",
      active: false,
      route: "/list",
    },
    {
      id: 4,
      name: "settings",
      active: false,
      route: "/settings",
    },
  ]);
  const handleTabBar = (tabArray, id) => {
    const activeList = tabArray.map((item) =>
      item.id === id ? { ...item, active: true } : { ...item, active: false }
    );

    const move = () => {
      tabArray.map((item) => (item.id === id ? navigate(item.route) : null));
    };

    if (tabArray === isTabbarLeft) {
      setIsTabbarLeft(activeList);
      move();
    }
    if (tabArray === isTabbarRight) {
      setIsTabbarRight(activeList);
      move();
    }
  };

  function handleWrite() {
    navigate("/write");
    dispatch(getHeaderState({ title: "Tasks" }));
  }

  return (
    <div id="TabBar">
      <div className="content flex justify-between">
        <div className="flex flex-row">
          {isTabbarLeft.map((item, idx) => (
            <button
              className={`icons material-icons-outlined ${
                item.active ? "active" : ""
              }`}
              key={idx}
              onClick={() => handleTabBar(isTabbarLeft, item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="flex flex-row">
          {isTabbarRight.map((item, idx) => (
            <button
              className={`icons material-icons-outlined ${
                item.active ? "active" : ""
              }`}
              key={item.id}
              onClick={() => handleTabBar(isTabbarRight, item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <button
        id="Add"
        className="icons material-icons-outlined"
        onClick={handleWrite}
      >
        add
      </button>
    </div>
  );
};
