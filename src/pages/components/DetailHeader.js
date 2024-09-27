import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject, listAll } from "firebase/storage";
import { getAuth } from "firebase/auth";

import { resetState, setImage } from "../../redux/reducers/taskReducer";
import { useAuth } from "../../provider/AuthProvider";
import { uploadProfileImage } from "../../store/userThunks";
import { setLoading } from "../../redux/reducers/loadingReducer";

export const DetailHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const itemCategory = queryParams.get("category");
  const itemId = queryParams.get("id");
  const { title: headerTitle, type: headerType } = useSelector(
    (state) => state.header
  );

  const image = useSelector((state) => state.task.value.image);
  const { url, status, error } = useSelector((state) => state.user);

  const db = getFirestore();
  const { user, uid } = useAuth();
  const storage = getStorage();
  const todays = collection(db, "users", uid, "todays");
  const projects = collection(db, "users", uid, "projects");
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
    let docRef;

    switch (itemCategory) {
      case "Today":
        try {
          dispatch(setLoading(true));

          docRef = doc(todays, itemId);
          await deleteDoc(docRef);
        } catch (error) {
          console.error("Error deleting document or file: ", error);
        } finally {
          dispatch(setLoading(false));
        }
        navigate(-1);
        break;
      case "Project":
        try {
          dispatch(setLoading(true));

          docRef = doc(projects, itemId);
          await deleteDoc(docRef);
          const imageDocRef = ref(storage, `images/${uid}/${itemId}`);
          const listResponse = await listAll(imageDocRef);
          const deletePromises = listResponse.items.map((itemRef) =>
            deleteObject(itemRef)
          );

          console.log("File deleted successfully");
        } catch (error) {
          console.error("Error deleting file:", error);
        }finally {
          dispatch(setLoading(false));
        }
        navigate(-1);
        break;

      default:
        break;
    }
  }

  function handleDone() {
    console.log("click");
    if (image) {
      dispatch(uploadProfileImage({ storage, db, user, image, uid }));
      dispatch(resetState());
      navigate('/')
    } else {
      return;
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
        <p>{headerTitle}</p>
      </div>

      {headerType === "default" && (
        <button className="icon material-icons-outlined" onClick={handleMore}>
          more_horiz
        </button>
      )}
      {headerType === "account" && (
        <button className="btn-flat primary" onClick={handleDone}>
          Done
        </button>
      )}

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
