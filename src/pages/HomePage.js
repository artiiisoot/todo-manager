import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
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
  const uid = useSelector((state) => state.auth.uid);
  const db = getFirestore();
  const todays = collection(db, "users", uid, "todays");
  const projects = collection(db, "users", uid, "projects");
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
    navigate(`/detail?uid=${uid}&category=${category}&id=${id}`);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        // todays 문서 불러오기
        const todayData = await getDocs(todays);
        let todayTasks = todayData.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        console.log("todayTasks", todayTasks);

        // // projects 문서 불러오기
        const projectData = await getDocs(projects);
        let projectTasks = projectData.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        console.log("projectTasks", projectTasks);

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

        // // 상태 업데이트
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
