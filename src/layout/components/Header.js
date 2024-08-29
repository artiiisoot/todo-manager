import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { auth } from "../../firebase";
import { logout } from "../../redux/reducers/authReducer";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAlarm, setIsAlarm] = useState(true);
  const [isNavbar, setIsNavbar] = useState(false);

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

  const clickThumb = () => {
    setIsNavbar(true);
  };

  const closeNavbar = (e) => {
    e.stopPropagation();
    setIsNavbar(false);
  };

  const handleList = (item) => {
    navigate(item.route);

    // if (isAlarm) {
    //   setIsAlarm(false);
    // }
  };

  function handleLogout() {
    auth.signOut();
    localStorage.removeItem("accessToken");
    dispatch(logout());
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

        <div className="user-thumb" onClick={clickThumb}>
          <div className="thumb-img button-effect">
            <img
              src="https://djpms9a1go7nf.cloudfront.net/prod/uploads/thumbnail/images/10043263/167100535142741_md.png"
              alt=""
              className="aspect-square"
            />
          </div>

          {isAlarm && <span className="dot"></span>}
        </div>
      </div>

      {isNavbar && (
        <div id="NavBar" onClick={closeNavbar}>
          <div className="content flex flex-col fadeInRight">
            <div className="nav-header flex items-center justify-between">
              <h1>Todo Manager</h1>
              <span>version</span>
            </div>

            <div className="nav-body flex-1">
              {isNavList.map((item, idx) => (
                <div
                  className="list button-effect flex justify-between items-center"
                  onClick={() => handleList(item)}
                  key={idx}
                >
                  {item.name}

                  {/* {isAlarm && <span className="dot"></span>} */}
                </div>
              ))}
            </div>

            <div className="nav-footer button-effect" onClick={handleLogout}>
              <h1>Log out</h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
