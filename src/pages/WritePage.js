import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  getCategory,
  resetState,
} from "../redux/reducers/taskReducer";

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
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

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
  const categoryList = useSelector((state) => state.task.value.categoryList);
  const taskCategory = useSelector((state) => state.task.value.category);
  const taskState = useSelector((state) => state.task.value.state);
  const taskGroup = useSelector((state) => state.task.value.group);
  const taskTags = useSelector((state) => state.task.value.tags);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const imageRef = useRef(null);
  const [prevImages, setPrevImages] = useState([]);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);

  const db = getFirestore();
  const storage = getStorage();

  async function submitTaskData() {
    if (taskCategory === "Today") {
      try {
        await addDoc(collection(db, "todays"), {
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
      } catch (error) {
        console.error("Error writing task: ", error);
      }
    }
    if (taskCategory === "Project") {
      try {
        const docRef = await addDoc(collection(db, "projects"), {
          title: taskTitle,
          category: taskCategory,
          state: taskState,
          group: taskGroup,
          tags: taskTags,
          description: taskDesc,
          createDate: serverTimestamp(),
        });

        // 이미지 업로드
        const uploadPromises = [];
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const storageRef = ref(storage, `images/${docRef?.id}/${image.name}`);
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadPromises.push(
            new Promise((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                null,
                (error) => {
                  console.error(error);
                  reject(error);
                },
                async () => {
                  const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref
                  );
                  await updateDoc(doc(db, "projects", docRef.id), {
                    image: downloadURL,
                  });
                  setUrls((prevUrls) => [...prevUrls, downloadURL]);
                  resolve(downloadURL);
                }
              );
            })
          );
        }
        setTaskTitle("");
        setTaskDesc("");
        dispatch(resetState());
        navigate("/");
      } catch (error) {
        console.error("Error writing task: ", error);
      }
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
      setPrevImages([...prevImages, result]);
    };
    // 파일 정보를 읽기
    reader.readAsDataURL(theFile);

    setImages([...images, theFile]);
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
          {categoryList?.map((item, idx) => (
            <button
              className={`btn-square-outlined ${
                taskCategory === item.name ? "active" : null
              }`}
              key={idx}
              value={item.name}
              onClick={() => dispatch(getCategory(item.name))}
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
            {prevImages.length > 3 ? null : (
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

            {prevImages.length > 0 &&
              prevImages.map((img) => (
                <div className="preview-img">
                  <img src={img} alt="이미지 파일" />
                </div>
              ))}
          </div>
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
