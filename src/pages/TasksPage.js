import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { getHeaderState } from "../redux/reducers/headerReducer";

import { getFirestore, collection, getDocs } from "firebase/firestore";

import { TodayCard } from "./components/TodayCard";
import { ProjectCard } from "./components/ProjectCard ";

export const TasksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get("tab") || "todays";

  const db = getFirestore();
  const todays = collection(db, "todays");
  const projects = collection(db, "projects");
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
  const [pageTitle, setPageTitle] = useState("Todays");
  const [activeTab, setActiveTab] = useState(defaultTab);

  function handleWrite() {
    navigate("/write");
    dispatch(getHeaderState({ title: "Tasks" }));
  }

  function handleTabBtn(type) {
    console.log("click");

    switch (type) {
      case "Todays":
        setPageTitle(type);
        setActiveTab(type);
        navigate(`?tab=${type}`);
        break;

      case "Projects":
        setPageTitle(type);
        setActiveTab(type);
        navigate(`?tab=${type}`);
        break;

      default:
        break;
    }
  }

  function handleClickDetail(category, id) {
    dispatch(getHeaderState({ title: "Detail" }));
    navigate(`/detail?category=${category}&id=${id}`);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        // todays 문서 불러오기
        const todayData = await getDocs(todays);
        const todayTasks = todayData.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        // projects 문서 불러오기
        const projectData = await getDocs(projects);
        const projectTasks = projectData.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

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
    setActiveTab(queryParams.get("tab") || "todays");
  }, [location.search]);

  return (
    <div id="Tasks">
      <div className="header-page">
        <div className="tasks-progress">
          <div className="content-title flex items-center">
            <p>{pageTitle} Tasks</p>
          </div>
          <ul className="flex gap-2 items-center justify-end">
            <li>
              On Going <span>00</span>
            </li>
            <li className="disabled">/</li>
            <li className="disabled">
              Complete <span>00</span>
            </li>
          </ul>
        </div>
        <div id="Tab">
          {tabs.map((tab, idx) => (
            <div
              className={`tab-menu ${activeTab === tab.name ? "active" : ""}`}
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
          {activeTab === "Todays" && todaysData && todaysData.length > 0 ? (
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
          ) : activeTab === "Projects" &&
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
