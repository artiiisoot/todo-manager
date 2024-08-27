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
      active: false,
      path: "/",
    },
    {
      id: 2,
      name: "calendar_month",
      active: false,
      path: "/calendar",
    },
  ]);
  const [isTabbarRight, setIsTabbarRight] = useState([
    {
      id: 3,
      name: "format_list_bulleted",
      active: false,
      path: "/tasks",
    },
    {
      id: 4,
      name: "settings",
      active: false,
      path: "/settings",
    },
  ]);
  const handleTabBar = (clickItem) => {
    // 좌측 탭바 상태 업데이트
    setIsTabbarLeft((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === clickItem.id
          ? { ...tab, active: true }
          : { ...tab, active: false }
      )
    );

    // 우측 탭바 상태 업데이트
    setIsTabbarRight((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === clickItem.id
          ? { ...tab, active: true }
          : { ...tab, active: false }
      )
    );

    // 클릭된 탭에 해당하는 경로로 이동
    navigate(clickItem.path);
  };

  function handleWrite() {
    navigate("/write");
    dispatch(getHeaderState({ title: "Tasks" }));
  }

  useEffect(() => {
    // 현재 경로가 "/tasks"일 때 "/tasks?tab=Todays"로 리디렉트
    if (location.pathname === "/tasks" && !location.search.includes("tab=")) {
      navigate("/tasks?tab=Todays", { replace: true });
    }
  }, [location, navigate]);

  // location.pathname이 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    // 좌측 탭바 상태 업데이트
    setIsTabbarLeft((prevTabs) =>
      prevTabs.map((tab) =>
        tab.path === location.pathname
          ? { ...tab, active: true }
          : { ...tab, active: false }
      )
    );

    // 우측 탭바 상태 업데이트
    setIsTabbarRight((prevTabs) =>
      prevTabs.map((tab) =>
        tab.path === location.pathname
          ? { ...tab, active: true }
          : { ...tab, active: false }
      )
    );
  }, [location.pathname]);

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
              onClick={() => handleTabBar(item)}
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
              onClick={() => handleTabBar(item)}
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
