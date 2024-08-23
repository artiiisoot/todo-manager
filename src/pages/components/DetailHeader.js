import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject, listAll } from "firebase/storage";

import { resetState } from "../../redux/reducers/taskReducer";

export const DetailHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const itemCategory = queryParams.get("category");
  const itemId = queryParams.get("id");
  const title = useSelector((state) => state.header.value.title);

  const db = getFirestore();
  const storage = getStorage();
  const todays = collection(db, "todays");
  const projects = collection(db, "projects");
  const [tasksData, setTasksData] = useState([]);

  const [showMore, setShowMore] = useState(false);

  function storeReset() {
    dispatch(resetState());
  }

  const handleBack = () => {
    storeReset();
    navigate(-1);
  };

  function handleMore() {
    setShowMore(!showMore);
  }

  async function handleDelete() {
    console.log("click");
    let docRef;

    switch (itemCategory) {
      case "Today":
        try {
          docRef = doc(todays, itemId);
          await deleteDoc(docRef);
        } catch (error) {
          console.error("Error deleting document or file: ", error);
        }
        navigate(-1);
        break;
      case "Project":
        try {
          // docRef = doc(projects, itemId);
          // await deleteDoc(docRef);

          const imageDocRef = ref(storage, `images/${itemId}`);
          const listResponse = await listAll(imageDocRef);
          const deletePromises = listResponse.items.map(itemRef => deleteObject(itemRef));


          console.log("File deleted successfully");
        } catch (error) {
          console.error("Error deleting file:", error);
        }
        navigate(-1);
        break;

      default:
        break;
    }
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let data;
  //     let getTaskData;

  //     switch (itemCategory) {
  //       case "Today":
  //         data = await getDocs(todays);
  //         getTaskData = data.docs.map((doc) => ({
  //           id: doc.id,
  //           data: doc.data(),
  //         }));
  //         setTasksData(getTaskData);
  //         break;

  //       case "Project":
  //         data = await getDocs(projects);
  //         getTaskData = data.docs.map((doc) => ({
  //           id: doc.id,
  //           data: doc.data(),
  //         }));
  //         setTasksData(getTaskData);
  //         break;

  //       default:
  //         setTasksData([]);
  //         break;
  //     }
  //   };

  //   const items = tasksData.filter((item)=> item.id !== itemId)

  //   fetchData();
  // }, [itemCategory]);

  // useEffect(() => {
  //   console.log("itemCategory", itemCategory);
  //   console.log("itemId", itemId);
  // }, [itemCategory, itemId]);

  return (
    <div
      id="Header"
      className="page header-content flex flex-row items-center justify-between"
    >
      <button className="icon material-icons-outlined" onClick={handleBack}>
        arrow_back_ios
      </button>

      <div className="page-title flex flex-col">
        <p>{title}</p>
      </div>

      <button className="icon material-icons-outlined" onClick={handleMore}>
        more_horiz
      </button>

      {showMore && (
        <div className="more-list">
          <button className="btn-flat primary" onClick={handleDelete}>
            DELETE
          </button>
        </div>
      )}
    </div>
  );
};
