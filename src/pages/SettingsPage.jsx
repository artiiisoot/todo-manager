import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//REDUX
import { useDispatch, useSelector } from "react-redux";
import { getHeaderState } from "../redux/reducers/headerReducer";

//FIREBASE
import { useAuth } from "../provider/AuthProvider";

//COMPONENT
import { DetailHeader } from "./components/DetailHeader";

export const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { title: headerTitle, type: headerType } = useSelector(
    (state) => state.header
  );

  const { user, uid } = useAuth();

  const [list] = useState([
    {
      name: "account",
      icon: "person",
    },
  ]);

  function handlePage(name) {
    navigate(`/account?&list=${name}&uid=${uid}`);
  }

  useEffect(() => {
    dispatch(getHeaderState({ title: "Settings", type: "settings" }));
  }, [dispatch]);

  return (
    <>
      <DetailHeader title={headerTitle} type={headerType} />

      <main className="settings">
        <ul>
          {list.map((item, idx) => (
            <li onClick={() => handlePage(item.name)} key={idx}>
              <i className="icons icons-sm material-icons-outlined">
                {item.icon}
              </i>
              <p>{item.name}</p>
            </li>
          ))}
          <li className="ver">
            <p>ver.0.0.0</p>
          </li>
        </ul>
      </main>
    </>
  );
};
