import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// PROVIDER
import { useAuth } from "../provider/AuthProvider";
import { useData } from "../provider/DataProvider";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { getHeaderState } from "../redux/reducers/headerReducer";

// FIREBASE
import { getAuth } from "firebase/auth";

// COMPONENTS
import { TodayCard } from "./components/TodayCard";
import { ProjectCard } from "./components/ProjectCard ";
import { LoadingUI } from "./components/LoadingUI";

// SWIPER
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { setLoading } from "../redux/reducers/loadingReducer";

export const HomePage = () => {
  const { user, uid } = useAuth();
  const { todaysData, projectsData, updateData } = useData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, loadingImage } = useSelector((state) => state.loading);

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

  // 데이터를 업데이트하기 위한 useEffect
  useEffect(() => {
    if (user) {
      updateData(); // user, uid, urls가 변경될 때 데이터를 업데이트
      getAuth();
      dispatch(setLoading(true));
    }
  }, [user, uid]); // urls를 추가하는 경우, urls 상태도 여기 추가 가능

  function handleWrite() {
    navigate("/write");
    dispatch(getHeaderState({ title: "Tasks" }));
  }

  function handleClickDetail(category, id) {
    dispatch(getHeaderState({ title: "Detail" }));
    navigate(`/detail?uid=${uid}&category=${category}&id=${id}`);
  }

  if (!user) {
    return <div>Please login</div>;
  }

  return (
    <>
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
                <div>
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
                </div>
              ) : null}
            </div>
          ))}
        </main>
      </div>

      {loading && <LoadingUI />}
    </>
  );
};
