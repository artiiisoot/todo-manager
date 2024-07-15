import React, { useEffect, useState } from "react";

import { getFirestore, collection, getDocs } from "firebase/firestore";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { TodayCard } from "./components/TodayCard";

export const HomePage = () => {
  const db = getFirestore();
  const tasks = collection(db, "tasks");
  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getDocs(tasks);
      const getTaskData = data.docs.map((doc) => doc.data());

      console.log("Data", getTaskData);

      return setTasksData(getTaskData);
    };

    getData();
  }, []);

  return (
    <div id="Home">
      <div className="header-bg"></div>

      <main>
        <div className="search-bar">
          <input type="text" placeholder="Find your Task, Projects ..." />
        </div>

        <div className="content">
          <div className="content-title white flex items-center justify-between">
            <p>Today’s Tasks</p>
            <button>See All</button>
          </div>

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
        </div>
      </main>
    </div>
  );
};
