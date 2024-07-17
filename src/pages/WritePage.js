import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { getTaskData } from "../redux/reducers/taskReducer";

import { DetailHeader } from "./components/DetailHeader";
import { SelectOption } from "./components/SelectOption";
import { DialogAddStates } from "./dialogs/DialogAddStates";
import { DialogAddTags } from "./dialogs/DialogAddTags";
import { DialogAddGroup } from "./dialogs/DialogAddGroup";

export const WritePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const headerTitle = useSelector((state) => state.header.value.title);
  const headerType = useSelector((state) => state.header.value.type);
  const modalType = useSelector((state) => state.modal.value.type);
  const modalOpen = useSelector((state) => state.modal.value.open);
  const taskState = useSelector((state) => state.task.value.state);
  const taskGroup = useSelector((state) => state.task.value.group);
  const taskTags = useSelector((state) => state.task.value.tags);

  const [categoryList] = useState([
    {
      name: "Task",
    },
    {
      name: "Project",
    },
  ]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  async function submitTaskData() {
    const db = getFirestore();

    await addDoc(collection(db, "tasks"), {
      title: taskTitle,
      category: taskCategory,
      state: taskState,
      group: taskGroup,
      tags: taskTags,
      description: taskDesc,
      createDate: serverTimestamp(),
    });

    setTaskTitle("");
    setTaskCategory("");
    setTaskDesc("");
    dispatch(getTaskData({ state: "", group: "", tags: [] }));
  }
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
          {categoryList.map((item, idx) => (
            <button
              className={`btn-square-outlined ${
                taskCategory === item.name ? "active" : null
              }`}
              key={idx}
              value={item.name}
              onClick={() => setTaskCategory(item.name)}
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

      {modalOpen && modalType === "state" ? <DialogAddStates /> : null}
      {modalOpen && modalType === "group" ? <DialogAddGroup /> : null}
      {modalOpen && modalType === "tag" ? <DialogAddTags /> : null}
    </>
  );
};
