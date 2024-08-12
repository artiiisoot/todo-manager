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
  const [triggerFetch, setTriggerFetch] = useState(false);
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
                    {todaysData.map((today, idx) => (
                      <SwiperSlide key={idx}>
                        <TodayCard
                          todayItem={today.data}
                          id={today.id}
                         
                          handleClickDetail={handleClickDetail}
                        />
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
                        <ProjectCard
                          projectItem={project.data}
                          id={project.id}
                          handleClickDetail={handleClickDetail}
                        />
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
