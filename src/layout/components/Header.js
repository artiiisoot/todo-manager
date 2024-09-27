import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setIsNavbar } from "../../redux/reducers/headerReducer";

import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { Navbar } from "./Navbar";
import { useAuth } from "../../provider/AuthProvider";

export const Header = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const db = getFirestore();
  const uid = useSelector((state) => state.auth.uid);
  const isNavbar = useSelector((state) => state.header.isNavbar);
  const [isAlarm, setIsAlarm] = useState(false);
  // const [isNavbar, setIsNavbar] = useState(false);

  const [isNavList, setIsNavList] = useState([
    {
      id: 1,
      name: "Home",
      active: true,
      route: "/",
    },
    {
      id: 2,
      name: "Calendar",
      active: false,
      route: "/calendar",
    },
    {
      id: 3,
      name: "Tasks",
      active: false,
      route: "/tasks?tab=Todays",
    },
    {
      id: 4,
      name: "Settings",
      active: false,
      route: "/settings",
    },
  ]);

  function openNavbar(e) {
    e.stopPropagation();
    dispatch(setIsNavbar(true));
  }

  return (
    <>
      <div
        id="Header"
        className="header-content flex flex-row items-center justify-between"
      >
        <div className="profile-text flex flex-col">
          <p>UserName</p>
          <p>You have 00 Tasks</p>
        </div>

        <div className="user-thumb" onClick={openNavbar}>
          <div className="thumb-img button-effect">
            <img src={user.photoURL} alt="" className="aspect-square" />
          </div>

          {isAlarm && <span className="dot"></span>}
        </div>
      </div>

      {isNavbar && <Navbar isNavList={isNavList} />}
    </>
  );
};
