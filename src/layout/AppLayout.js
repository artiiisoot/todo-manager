import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Tabbar } from "./components/Tabbar";

export const AppLayout = () => {
  const location = useLocation();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (location.pathname === "/write" || location.pathname === "/detail") {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  }, [location]);

  return (
    <div id="ROOT">
      <Header></Header>
      
      <div className="wrapper">
        <Outlet />
      </div>

      {isHidden ? null : <Tabbar></Tabbar>}
    </div>
  );
};
