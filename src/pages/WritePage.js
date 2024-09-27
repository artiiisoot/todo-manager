import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//FIREBASE AUTH
import { useAuth } from "../provider/AuthProvider";
import { useData } from "../provider/DataProvider";

import { useDispatch, useSelector } from "react-redux";
import { getCategory, resetState } from "../redux/reducers/taskReducer";

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import { DetailHeader } from "./components/DetailHeader";
import { SelectOption } from "./components/SelectOption";
import { DatePickerComponent } from "./components/DatePickerComponent";
import { DialogAddStates } from "./dialogs/DialogAddStates";
import { DialogAddTags } from "./dialogs/DialogAddTags";
import { DialogAddGroup } from "./dialogs/DialogAddGroup";
import { getHeaderState } from "../redux/reducers/headerReducer";
import { setLoading } from "../redux/reducers/loadingReducer";
import { LoadingUI } from "./components/LoadingUI";

export const WritePage = () => {
  const { uid } = useAuth();
  // const { updateData } = useData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { title: headerTitle, type: headerType } = useSelector(
    (state) => state.header
  );
  const { type: modalType, open: modalOpen } = useSelector(
    (state) => state.modal.value
  );
  const {
    categoryList,
    category: taskCategory,
    state: taskState,
    group: taskGroup,
    tags: taskTags,
  } = useSelector((state) => state.task.value);
  const selectedDate = useSelector((state) => state.date.selectedDate);
  const { loading } = useSelector((state) => state.loading);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const imageRef = useRef(null);
  const [prevImages, setPrevImages] = useState([]);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);

  const [value, setValue] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const db = getFirestore();
  const storage = getStorage();

  async function submitTaskData() {
    if (taskCategory === "Today") {
      try {
        dispatch(setLoading(true));
        await addDoc(collection(db, "users", uid, "todays"), {
          title: taskTitle,
          category: taskCategory,
          state: taskState,
          group: taskGroup,
          tags: taskTags,
          description: taskDesc,
          createDate: value,
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
        dispatch(setLoading(true));
        const docRef = await addDoc(collection(db, "users", uid, "projects"), {
          title: taskTitle,
          category: taskCategory,
          state: taskState,
          group: taskGroup,
          tags: taskTags,
          description: taskDesc,
          createDate: value,
        });

        // 이미지 업로드
        const uploadPromises = images.map((image) => {
          const storageRef = ref(
            storage,
            `images/${uid}/${docRef.id}/${image.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, image);

          return new Promise((resolve, reject) => {
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
                resolve(downloadURL);
              }
            );
          });
        });

        try {
          const downloadURLs = await Promise.all(uploadPromises);

          await updateDoc(doc(db, "users", uid, "projects", docRef.id), {
            image: downloadURLs,
          });

          // URLs 상태 업데이트
          await setUrls((prevUrls) => [...prevUrls, ...downloadURLs]);
        } catch (error) {
          console.error("Error uploading images:", error);
        } finally {
          dispatch(setLoading(false));
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

  useEffect(() => {
    dispatch(getHeaderState({ title: "Tasks", type: "" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetState());
  }, []);

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
                <p className="title">Date</p>
                <DatePickerComponent setValue={setValue} value={value} />
              </li>

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

        {taskCategory === "Project" && (
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
        )}

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

      {loading && <LoadingUI />}
    </>
  );
};
