import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

//PROVIDER
import { useAuth } from "./AuthProvider";

// REDUX
import { useDispatch, useSelector } from "react-redux";

// FIRESTORE
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { setLoading, setLoadingImage } from "../redux/reducers/loadingReducer";

// COMPOENTS
import { formatDate } from "../utils/dateUtils";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const dispatch = useDispatch();
  const db = getFirestore();
  const { loading, loadingImage } = useSelector((state) => state.loading);
  const [todaysData, setTodaysData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const { uid } = useAuth(); // AuthContext에서 uid 가져오기
  const hasFetched = useRef(false); // 데이터를 이미 불러왔는지 추적하는 ref

  const updateData = async () => {
    if (!uid) return; // uid가 없다면 로직 실행 안 함
    dispatch(setLoading(true)); // 로딩 상태 true로 설정
    dispatch(setLoadingImage(true)); // 로딩 상태 true로 설정
    try {
      const todays = collection(db, "users", uid, "todays");
      const projects = collection(db, "users", uid, "projects");
      // todays 문서 불러오기
      const todayData = await getDocs(todays);
      let todayTasks = todayData.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
        createDate: formatDate(doc.data().createDate.toDate()),
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

      // projects 문서 불러오기
      const projectData = await getDocs(projects);
      let projectTasks = projectData.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
        createDate: formatDate(doc.data().createDate.toDate()),
      }));

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
    } finally {
      dispatch(setLoading(false)); // 로딩 상태 false로 설정
      dispatch(setLoadingImage(false)); // 로딩 완료 후 false로 설정
    }
  };

  useEffect(() => {
    updateData();
  }, [uid]); // uid가 변경될 때마다 데이터 갱신

  return (
    <DataContext.Provider value={{ todaysData, projectsData, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
