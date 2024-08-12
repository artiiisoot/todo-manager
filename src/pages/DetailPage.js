import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getTaskData, resetState } from "../redux/reducers/taskReducer";

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { DetailHeader } from "./components/DetailHeader";
import { SelectOption } from "./components/SelectOption";
import { DialogAddStates } from "./dialogs/DialogAddStates";
import { DialogAddTags } from "./dialogs/DialogAddTags";
import { DialogAddGroup } from "./dialogs/DialogAddGroup";

export const DetailPage = () => {
  const dispatch = useDispatch();
  const headerTitle = useSelector((state) => state.header.value.title);
  const headerType = useSelector((state) => state.header.value.type);
  const modalType = useSelector((state) => state.modal.value.type);
  const modalOpen = useSelector((state) => state.modal.value.open);
  const categoryList = useSelector((state) => state.task.value.categoryList);
  const taskCategory = useSelector((state) => state.task.value.category);
  const taskState = useSelector((state) => state.task.value.state);
  const taskGroup = useSelector((state) => state.task.value.group);
  const taskTags = useSelector((state) => state.task.value.tags);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemCategory = queryParams.get("category");
  const itemId = queryParams.get("id");

  const db = getFirestore();
  const todays = collection(db, "todays");
  const projects = collection(db, "projects");
  const [tasksData, setTasksData] = useState([]);
  const [itemData, setItemData] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  async function submitTaskData() {
    if (taskCategory === "Today") {
      try {
        const taskDocRef = doc(db, "todays", itemId);
        await updateDoc(taskDocRef, {
          title: taskTitle,
          category: taskCategory,
          state: taskState,
          group: taskGroup,
          tags: taskTags,
          description: taskDesc,
          createDate: serverTimestamp(),
        });
        setTaskTitle("");
        setTaskDesc("");
        dispatch(resetState());
        navigate("/");
        console.log("Task updated successfully");
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    }
    if (taskCategory === "Project") {
      try {
        const taskDocRef = doc(db, "projects", itemId);
        await updateDoc(taskDocRef, {
          title: taskTitle,
          category: taskCategory,
          state: taskState,
          group: taskGroup,
          tags: taskTags,
          description: taskDesc,
          createDate: serverTimestamp(),
        });
        setTaskTitle("");
        setTaskDesc("");
        dispatch(resetState());
        navigate("/");
        console.log("Task updated successfully");
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      let data;
      let getTaskData;

      switch (itemCategory) {
        case "Today":
          data = await getDocs(todays);
          getTaskData = data.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          setTasksData(getTaskData);
          break;

        case "Project":
          data = await getDocs(projects);
          getTaskData = data.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          setTasksData(getTaskData);
          break;

        default:
          setTasksData([]);
          break;
      }
    };

    fetchData();
  }, [itemCategory]);

  useEffect(() => {
    console.log("tasksData", tasksData);
  }, [tasksData]);

  useEffect(() => {
    if (tasksData.length > 0) {
      const item = tasksData.find((item) => item.id === itemId);
      if (item) {
        setItemData(item.data);
      }
    }
  }, [tasksData, itemId]);

  useEffect(() => {
    if (itemData) {
      setTaskTitle(itemData.title);
      setTaskDesc(itemData.description);
      dispatch(
        getTaskData({
          categoryList,
          category: itemData.category,
          state: itemData.state,
          group: itemData.group,
          tags: itemData.tags,
        })
      );
    }
  }, [itemData, dispatch, categoryList]);

  return (
    <>
      <DetailHeader title={headerTitle} type={headerType} />
      <main className="document">
        <div className="title">
          <input
            type="text"
            placeholder="Untitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>

        <div className="tab-group flex flex-row items-center">
          {categoryList?.map((item, idx) => (
            <button
              className={`btn-square-outlined ${
                taskCategory === item.name ? "active" : ""
              }`}
              key={idx}
              value={item.name}
              disabled
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="option">
          <div className="option-item">
            <ul>
              <li className="flex items-center">
                <p className="title">State</p>
                <SelectOption id="state" items={taskState} />
              </li>

              <li className="flex items-center">
                <p className="title">Group</p>
                <SelectOption id="group" items={taskGroup} />
              </li>

              <li className="flex items-center">
                <p className="title">Tags</p>
                <SelectOption id="tags" items={taskTags} />
              </li>
            </ul>
          </div>
        </div>

        <div className="description flex flex-col">
          <p>Description</p>
          <textarea
            name="description"
            id="description"
            className="outlined flex-1"
            placeholder="Add for the description"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          ></textarea>
        </div>

        <div className="button-group flex flex-row justify-end">
          <button onClick={() => navigate(-1)}>CANCEL</button>
          <button className="btn-flat primary" onClick={submitTaskData}>
            DONE
          </button>
        </div>
      </main>
      {modalOpen && modalType === "state" ? (
        <DialogAddStates item={itemData?.state} />
      ) : null}
      {modalOpen && modalType === "group" ? (
        <DialogAddGroup item={itemData?.group} />
      ) : null}
      {modalOpen && modalType === "tag" ? (
        <DialogAddTags item={itemData?.tags} />
      ) : null}
    </>
  );
};
