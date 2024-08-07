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
  const todays = collection(db, "todays");
  const projects = collection(db, "projects");
  const [taskType, setTaskType] = useState([
    {
      name: "Todays",
      className: "today",
    },
    {
      name: "Projects",
      className: "project",
    },
  ]);
  const [todaysData, setTodaysData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);

  function handleWrite() {
    navigate("/write");
    dispatch(getHeaderState({ title: "Tasks" }));
  }

  useEffect(() => {
    const getTodayData = async () => {
      const data = await getDocs(todays);
      const getTaskData = data.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setTodaysData(...todaysData, getTaskData);
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

  function handleClickDetail(id) {
    dispatch(getHeaderState({ title: "Detail" }));
    navigate(`/detail/?id=${id}`);
  }
  return (
    <div id="Home">
      <div className="header-bg"></div>

      <main>
        <div className="search-bar">
          <input type="text" placeholder="Find your Task, Projects ..." />
        </div>

        {taskType.map((type, idx) => (
          // <div className="content today" key={idx}>
          <div className={`content ${type.className}`} key={idx}>
            <div className="content-title flex items-center justify-between">
              <p>{type.name}</p>
              <button onClick={() => navigate(`/tasks?tab=${type.name}`)}>
                See All
              </button>
            </div>

            {/* TODAYS TASKS */}
            {type.name === "Todays" ? (
              <>
                {todaysData.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={16}
                    slidesPerView={1.2}
                  >
                    {todaysData.map((item, idx) => (
                      <SwiperSlide
                        key={idx}
                        onClick={() => handleClickDetail(item.id)}
                      >
                        <TodayCard item={item.data} />
                        {/* {console.log("item", item)} */}
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
              </>
            ) : type.name === "Projects" ? (
              <>
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
              </>
            ) : null}
          </div>
        ))}
      </main>
    </div>
  );
};
