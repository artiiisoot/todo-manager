import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getFirestore, collection, getDocs } from "firebase/firestore";

import { TodayCard } from "./components/TodayCard";
import { ProjectCard } from "./components/ProjectCard ";

export const TasksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const defaultTab = query.get("tab") || "todays";

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
  function handleClickDetail(e, id) {
    console.log(e.target);
    console.log("click");
    navigate(`/detail/${id}`);
  }

  useEffect(() => {
    const getTodayData = async () => {
      const data = await getDocs(todays);
      const getTaskData = data.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setTodaysData(getTaskData);
    };

    const getProjectsData = async () => {
      const data = await getDocs(projects);
      const getTaskData = data.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setProjectsData(...projectsData, getTaskData);
    };

    getTodayData();
    getProjectsData();
  }, []);

  useEffect(() => {
    setActiveTab(query.get("tab") || "todays");
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
          {activeTab === "Todays" && (
            <>
              {todaysData.map((item, idx) => (
                <TodayCard
                  item={item.data}
                  id={idx}
                  onClick={() => handleClickDetail(item.id)}
                />
                // console.log("task", task.data)
              ))}
            </>
          )}
          {activeTab === "Projects" && (
            <>
              {projectsData.map((project, idx) => (
                <ProjectCard project={project.data} id={idx} />
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
