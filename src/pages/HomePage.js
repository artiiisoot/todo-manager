import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { getHeaderState } from "../redux/reducers/headerReducer";

import { getFirestore, collection, getDocs } from "firebase/firestore";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { TodayCard } from "./components/TodayCard";
import { ProjectCard } from "./components/ProjectCard ";

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const db = getFirestore();
  const tasks = collection(db, "tasks");
  const projects = collection(db, "projects");
  const [tasksData, setTasksData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);

  function handleWrite() {
    navigate("/write");
    dispatch(getHeaderState({ title: "Tasks" }));
  }

  useEffect(() => {
    const getTodayData = async () => {
      const data = await getDocs(tasks);
      const getTaskData = data.docs.map((doc) => doc.data());

      return setTasksData(getTaskData);
    };

    const getProjectsData = async () => {
      const data = await getDocs(projects);
      const getTaskData = data.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setProjectsData(...projectsData, getTaskData);
    };
    console.log("projectsData", projectsData);

    getTodayData();
    getProjectsData();
  }, []);

  return (
    <div id="Home">
      <div className="header-bg"></div>

      <main>
        <div className="search-bar">
          <input type="text" placeholder="Find your Task, Projects ..." />
        </div>

        <div className="content today">
          <div className="content-title white flex items-center justify-between">
            <p>Today’s Tasks</p>
            <button>See All</button>
          </div>

          {tasksData.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={16}
              slidesPerView={1.2}
            >
              {tasksData.map((task, idx) => (
                <SwiperSlide key={idx}>
                  <TodayCard task={task} id={idx} />
                </SwiperSlide>
              ))}
            </Swiper>
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

        <div className="content project">
          <div className="content-title black flex items-center justify-between">
            <p>Projects</p>
            <button>See All</button>
          </div>

          {projectsData.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={16}
              slidesPerView={1.08}
            >
              {projectsData.map((project, idx) => (
                <SwiperSlide key={idx}>
                  <ProjectCard project={project.data} id={project.id} />
                </SwiperSlide>
              ))}
            </Swiper>
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
