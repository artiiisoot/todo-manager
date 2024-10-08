import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getHeaderState } from "../redux/reducers/headerReducer";

import { getFirestore, collection, getDocs } from "firebase/firestore";

import { TodayCard } from "./components/TodayCard";
import { ProjectCard } from "./components/ProjectCard ";

export const TasksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.auth.uid);
  const queryParams = new URLSearchParams(location.search);
  // const defaultTab = queryParams.get("tab") || "todays";

  const db = getFirestore();
  const todays = collection(db, "users", uid, "todays");
  const projects = collection(db, "users", uid, "projects");
  const [todaysData, setTodaysData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [tabs, setTabs] = useState([
    {
      name: "Todays",
    },
    {
      name: "Projects",
    },
  ]);
  // const [activeTab, setActiveTab] = useState(defaultTab);
  const [currentTab, setCurrentTab] = useState("");

  function handleWrite() {
    navigate("/write");
    dispatch(getHeaderState({ title: "Tasks" }));
  }

  function handleTabBtn(type) {
    switch (type) {
      case "Todays":
        setCurrentTab(type);
        navigate(`?tab=${type}`);
        break;

      case "Projects":
        setCurrentTab(type);
        navigate(`?tab=${type}`);
        break;

      default:
        break;
    }
  }

  function handleClickDetail(category, id) {
    dispatch(getHeaderState({ title: "Detail" }));
    navigate(`/detail?uid=${uid}&category=${category}&id=${id}`);
  }

  const onGoingCount =
    currentTab === "Todays"
      ? todaysData.filter(
          (task) =>
            task.data.state.name === "before" ||
            task.data.state.name === "start"
        ).length
      : currentTab === "Projects"
      ? projectsData.filter(
          (task) =>
            task.data.state.name === "before" ||
            task.data.state.name === "start"
        ).length
      : null;

  const onCompleteCount =
    currentTab === "Todays"
      ? todaysData.filter((task) => task.data.state.name === "complete").length
      : projectsData.filter((task) => task.data.state.name === "complete")
          .length;

  useEffect(() => {
    const paramsName = queryParams.get("tab");
    switch (paramsName) {
      case "Todays":
        setCurrentTab(paramsName);
        break;
      case "Projects":
        setCurrentTab(paramsName);
        break;

      default:
        break;
    }
  }, [queryParams]);

  useEffect(() => {
    const getData = async () => {
      try {
        // todays 문서 불러오기
        const todayData = await getDocs(todays);
        let todayTasks = todayData.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        // projects 문서 불러오기
        const projectData = await getDocs(projects);
        let projectTasks = projectData.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        todayTasks = todayTasks.sort((a, b) => {
          const isAStart =
            a.data.state.name === "before" || a.data.state.name === "start";
          const isBStart =
            b.data.state.name === "before" || b.data.state.name === "start";

          if (isAStart && !isBStart) {
            return -1; // a가 b보다 상위로
          } else if (!isAStart && isBStart) {
            return 1; // b가 a보다 상위로
          } else {
            // 둘 다 "start"가 아니거나 둘 다 "start"일 경우 createDate로 정렬
            return a.data.createDate - b.data.createDate;
          }
        });

        projectTasks = projectTasks.sort((a, b) => {
          const isAStart =
            a.data.state.name === "before" || a.data.state.name === "start";
          const isBStart =
            b.data.state.name === "before" || b.data.state.name === "start";

          if (isAStart && !isBStart) {
            return -1; // a가 b보다 상위로
          } else if (!isAStart && isBStart) {
            return 1; // b가 a보다 상위로
          } else {
            // 둘 다 "start"가 아니거나 둘 다 "start"일 경우 createDate로 정렬
            return a.data.createDate - b.data.createDate;
          }
        });

        // 상태 업데이트
        setTodaysData(todayTasks);
        setProjectsData(projectTasks);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    getData(); // 컴포넌트가 마운트될 때 데이터 불러오기
  }, []);

  useEffect(() => {
    setCurrentTab(queryParams.get("tab") || "todays");
  }, [location.search]);

  return (
    <div id="Tasks">
      <div className="header-page">
        <div className="tasks-progress">
          <div className="content-title flex items-center">
            <p>{currentTab} Tasks</p>
          </div>
          {currentTab === "Todays" ? (
            <ul className="flex gap-2 items-center justify-end">
              <li>
                On Going <span>0{onGoingCount}</span>
              </li>
              <li className="disabled">/</li>
              <li className="disabled">
                Complete <span>0{onCompleteCount}</span>
              </li>
            </ul>
          ) : currentTab === "Projects" ? (
            <ul className="flex gap-2 items-center justify-end">
              <li>
                On Going <span>0{onGoingCount}</span>
              </li>
              <li className="disabled">/</li>
              <li className="disabled">
                Complete <span>0{onCompleteCount}</span>
              </li>
            </ul>
          ) : null}
        </div>
        <div id="Tab">
          {tabs.map((tab, idx) => (
            <div
              className={`tab-menu ${currentTab === tab.name ? "active" : ""}`}
              key={idx}
              onClick={() => handleTabBtn(tab.name)}
            >
              {tab.name}
            </div>
          ))}
        </div>
      </div>

      <main className="pages">
        <div className="content today flex flex-col gap-2">
          {currentTab === "Todays" && todaysData && todaysData.length > 0 ? (
            <>
              {todaysData.map((today, idx) => (
                <TodayCard
                  key={idx}
                  todayItem={today.data}
                  id={today.id}
                  handleClickDetail={handleClickDetail}
                />
              ))}
            </>
          ) : currentTab === "Projects" &&
            projectsData &&
            projectsData.length > 0 ? (
            <>
              {projectsData.map((project, idx) => (
                <ProjectCard
                  key={idx}
                  projectItem={project.data}
                  id={project.id}
                  handleClickDetail={handleClickDetail}
                />
              ))}
            </>
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
