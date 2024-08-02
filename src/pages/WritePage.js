import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { getTaskData } from "../redux/reducers/taskReducer";

import { DetailHeader } from "./components/DetailHeader";
import { SelectOption } from "./components/SelectOption";
import { DialogAddStates } from "./dialogs/DialogAddStates";
import { DialogAddTags } from "./dialogs/DialogAddTags";
import { DialogAddGroup } from "./dialogs/DialogAddGroup";

import { v4 as uuidv4 } from "uuid";

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
  const [docIdRef, setDocIdRef] = useState("");
  const imageRef = useRef(null);
  const [images, setImages] = useState([]);

  const db = getFirestore();
  const storage = getStorage();

  async function submitTaskData() {
    if (taskCategory === "Task") {
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
      navigate("/");
    }
    if (taskCategory === "Project") {
      const docRef = await addDoc(collection(db, "projects"), {
        title: taskTitle,
        category: taskCategory,
        state: taskState,
        group: taskGroup,
        tags: taskTags,
        description: taskDesc,
        createDate: serverTimestamp(),
      });

      // const imageRef = ref(storage, `images/${docRef?.id}/${images.name}`);
      // images?.map((img) =>
      //   uploadBytes(imageRef, img, "data_url").then(async () => {
      //     const downloadURL = await getDownloadURL(imageRef);
      //     await updateDoc(doc(db, "projects", docRef.id), {
      //       image: downloadURL,
      //     });
      //   })
      // );
    }
  }

  function onFileChange(e) {
    const files = e.target.files;
    const theFile = files[0];

    // FileReader 생성
    const reader = new FileReader();
    // file 업로드가 완료되면 실행
    reader.onloadend = (e) => {
      // 업로드한 이미지 URL 저장
      const result = e.currentTarget.result;

      console.log("result", result);

      setImages([...images, result]);
    };
    // 파일 정보를 읽기
    reader.readAsDataURL(theFile);

    
  }

  // const onSubmit = async (evt) => {
  //   evt.preventDefault();
  //   const fileRef = ref(storage, uuidv4());
  //   const response = await uploadString(fileRef, images, "data_url");
  //   console.log(response);
  // };

  // useEffect(() => {
  //   console.log("images", images);
  //   console.log("images", );
  // }, [images]);

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

        <div className="upload">
          <div className="grid grid-cols-4  gap-4">
            {images.length > 3 ? null : (
              <label htmlFor="file">
                <button
                  className="btn-file icon material-icons-outlined"
                  onClick={() => imageRef.current?.click()}
                >
                  add
                </button>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="file"
                  className="input-hidden"
                  ref={imageRef}
                  onChange={onFileChange}
                />
              </label>
            )}

            {images.length > 0 &&
              images.map((img) => (
                <div className="preview-img">
                  <img src={img} alt="이미지 파일" />
                </div>
              ))}
          </div>
        </div>

        <div className="button-group flex flex-row justify-end">
          <button onClick={() => navigate(-1)}>CANCEL</button>
          {/* <button className="btn-flat primary" onClick={onSubmit}> */}
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
