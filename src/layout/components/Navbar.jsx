import React from "react";
import { useNavigate } from "react-router-dom";

import { setIsNavbar } from "../../redux/reducers/headerReducer";
import { logout } from "../../redux/reducers/authReducer";

import { useDispatch } from "react-redux";

import { auth } from "../../firebase";

export const Navbar = ({ isNavList }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function closeNavbar(e) {
    e.stopPropagation();
    dispatch(setIsNavbar(false));
  }

  function handleList(item) {
    navigate(item.route);
  }
  function handleLogout() {
    auth.signOut();
    localStorage.removeItem("accessToken");
    dispatch(logout());
  }

  return (
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
  );
};
