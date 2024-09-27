import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// PROVIDER
import { useAuth } from "../provider/AuthProvider";
import { useData } from "../provider/DataProvider";

// REDUX
import { useDispatch } from "react-redux";
import { getHeaderState } from "../redux/reducers/headerReducer";

// FIREBASE
import { getAuth } from "firebase/auth";

// COMPONENTS
import { TodayCard } from "./components/TodayCard";
import { ProjectCard } from "./components/ProjectCard ";
import { CalendarUI } from "./components/CalendarUI";
import { formatDate } from "../utils/dateUtils";

export const CalendarPage = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const queryParams = new URLSearchParams(location.search);

  const { user, uid } = useAuth();
  const { todaysData, projectsData, updateData } = useData();

  const today = new Date();
  const [date, setDate] = useState(today);
  const calendarDate = formatDate(date);

  function handleWrite() {
    navigate("/write");
    dispatch(getHeaderState({ title: "Tasks" }));
  }

  function handleClickDetail(category, id) {
    dispatch(getHeaderState({ title: "Detail" }));
    navigate(`/detail?id=${uid}&category=${category}&id=${id}`);
  }

  // 데이터를 업데이트하기 위한 useEffect
  useEffect(() => {
    if (user) {
      updateData(); // user, uid, urls가 변경될 때 데이터를 업데이트
      getAuth();
    }
  }, [user, uid]); //

  // useEffect(() => {
  //   setActiveTab(queryParams.get("tab") || "todays");
  // }, [location.search]);

  return (
    <div id="Calendar">
      <div className="header-bg"></div>

      <main className="flex flex-col gap-8">
        <CalendarUI
          date={date}
          setDate={setDate}
          todaysData={todaysData}
          projectsData={projectsData}
        />

        <div className="content calendar flex flex-col gap-2">
          <div className="content-title flex items-center justify-between">
            <p>Todays</p>
            <button onClick={() => navigate(`/tasks?tab=Todays`)}>
              See All
            </button>
          </div>

          {todaysData.filter((today) => today.createDate === calendarDate)
            .length > 0 ? (
            todaysData
              .filter((today) => today.createDate === calendarDate)
              .map((today, idx) => (
                <TodayCard
                  key={idx}
                  todayItem={today.data}
                  id={today.id}
                  handleClickDetail={handleClickDetail}
                />
              ))
          ) : (
            <div
              id="TodayCard"
              className="no-data content-item button-effect flex items-center justify-center"
              onClick={handleWrite}
            >
              <h1>Please add your todo list</h1>
            </div>
          )}
        </div>

        <div className="content calendar flex flex-col gap-2">
          <div className="content-title flex items-center justify-between">
            <p>Projects</p>
            <button onClick={() => navigate(`/tasks?tab=Projects`)}>
              See All
            </button>
          </div>

          {projectsData.filter((project) => project.createDate === calendarDate)
            .length > 0 ? (
            projectsData
              .filter((project) => project.createDate === calendarDate)
              .map((project, idx) => (
                <ProjectCard
                  key={idx}
                  projectItem={project.data}
                  id={project.id}
                  handleClickDetail={handleClickDetail}
                />
              ))
          ) : (
            <div
              id="TodayCard"
              className="no-data content-item button-effect flex items-center justify-center"
              onClick={handleWrite}
            >
              <h1>Please add your todo list</h1>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
