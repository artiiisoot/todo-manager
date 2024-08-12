import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { getHeaderState } from "../../redux/reducers/headerReducer";

import { useLocation, useNavigate } from "react-router-dom";

export const Tabbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isTabbarLeft, setIsTabbarLeft] = useState([
    {
      id: 1,
      name: "home",
      active: true,
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
      route: "/tasks?tab=Todays",
    },
    {
      id: 4,
      name: "settings",
      active: false,
      route: "/settings",
    },
  ]);
  const handleTabBar = (id) => {
    const allItems = [...isTabbarLeft, ...isTabbarRight];
    const clickedItem = allItems.find((tab) => tab.id === id);

    if (clickedItem) {
      setIsTabbarLeft((prevState) =>
        prevState.map((item) =>
          item.id === id
            ? { ...item, active: true }
            : { ...item, active: false }
        )
      );
      setIsTabbarRight((prevState) =>
        prevState.map((item) =>
          item.id === id
            ? { ...item, active: true }
            : { ...item, active: false }
        )
      );
      navigate(clickedItem.route);
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
              onClick={() => handleTabBar(item.id)}
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
              onClick={() => handleTabBar(item.id)}
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
