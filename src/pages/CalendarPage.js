import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { getHeaderState } from "../redux/reducers/headerReducer";

import { getFirestore, collection, getDocs } from "firebase/firestore";

import { TodayCard } from "./components/TodayCard";
import { ProjectCard } from "./components/ProjectCard ";
import { CalendarUI } from "./components/CalendarUI";

import { formatDate } from "../utils/dateUtils";

export const CalendarPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get("tab") || "todays";
  const [pageTitle, setPageTitle] = useState("Todays");
  const [activeTab, setActiveTab] = useState(defaultTab);

  const db = getFirestore();
  const todays = collection(db, "todays");
  const projects = collection(db, "projects");
  const [todaysData, setTodaysData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const today = new Date();
  const [date, setDate] = useState(today);
  const calendarDate = formatDate(date);

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
          createDate: formatDate(doc.data().createDate.toDate()),
          // createDate: doc.data().createDate,
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
    <div id="Calendar">
      <div className="header-bg"></div>

      <main className="flex flex-col gap-8">
        <CalendarUI date={date} setDate={setDate} />

        <div className="content calendar flex flex-col gap-2">
          <div className="content-title flex items-center justify-between">
            <p>Todays</p>
            <button onClick={() => navigate(`/tasks?tab=Todays`)}>
              See All
            </button>
          </div>

          {todaysData
            .filter((today) => today.createDate === calendarDate)
            .map((today, idx) => (
              <TodayCard
                key={idx}
                todayItem={today.data}
                id={today.id}
                handleClickDetail={handleClickDetail}
              />
            ))}
        </div>

        <div className="content calendar flex flex-col gap-2">
          <div className="content-title flex items-center justify-between">
            <p>Projects</p>
            <button onClick={() => navigate(`/tasks?tab=Projects`)}>
              See All
            </button>
          </div>

          {projectsData.map((project, idx) => (
            <ProjectCard
              key={idx}
              projectItem={project.data}
              id={project.id}
              handleClickDetail={handleClickDetail}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
