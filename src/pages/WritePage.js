import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getHeaderState } from "../redux/reducers/headerReducer";

import { DetailHeader } from "./components/DetailHeader";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import { DialogAddTags } from "./dialogs/DialogAddTags";
import { getModalState } from "../redux/reducers/modalReducer";

export const WritePage = () => {
  const dispatch = useDispatch();
  const title = useSelector((state) => state.header.value.title);
  const type = useSelector((state) => state.header.value.type);
  const isDialog = useSelector((state) => state.modal.isDialog);

  // 제목 입력
  const [isInputTitle, setIsInputTitle] = useState("");
  function handleInputTitle(e) {
    console.log("TITLE", e.target.value);
    setIsInputTitle(e.target.value);
  }

  // 카테고리 입력
  const [isCategory, setIsCategory] = useState([
    {
      name: "Task",
    },
    {
      name: "Project",
    },
  ]);
  const [isCurrentCat, setIsCurrentCat] = useState("");
  function handleCategory(type) {
    setIsCurrentCat(type);
    console.log("CATEGORY", type);
  }

  // 상태 입력
  const [isShowSelectState, setIsShowSelectState] = useState(false);
  const [isSelectState, setIsSelectState] = useState({
    name: "Empty",
    type: "empty",
  });
  const [isTaskState, setIsTaskState] = useState([
    {
      name: "시작 전",
      type: "before",
    },
    {
      name: "진행중",
      type: "start",
    },
    {
      name: "완료",
      type: "complete",
    },
  ]);
  function showSelectState(e) {
    e.preventDefault();
    setIsShowSelectState(!isShowSelectState);
    setIsShowSelectGroup(false);
  }
  function handleSelectState(name, type) {
    console.log("STATE", name);
    setIsSelectState({ name, type });
    setIsShowSelectState(false);
  }

  // 그룹 입력
  const [isShowSelectGroup, setIsShowSelectGroup] = useState(false);
  const [isSelectGroup, setIsSelectGroup] = useState({
    name: "Empty",
    type: "empty",
  });
  const [isTaskGroup, setIsTaskGroup] = useState([
    {
      name: "Home",
      type: "default",
    },
    {
      name: "Business",
      type: "default",
    },
  ]);
  function showSelectGroup(e) {
    e.preventDefault();
    setIsShowSelectGroup(!isShowSelectGroup);
    setIsShowSelectState(false);
    setIsShowSelectTag(false);
  }
  function handleSelectGroup(name, type) {
    setIsSelectGroup({ name, type });
    setIsShowSelectGroup(false);
    setIsShowSelectTag(false);
    console.log("GROUP", name);
  }
  function handleAddGroup() {
    console.log("추가하기");
  }

  // 태그 입력
  const [isShowSelectTag, setIsShowSelectTag] = useState(false);
  const [isShowAddTag, setIsShowAddTag] = useState(false);
  const [isSelectTag, setIsSelectTag] = useState({
    name: "Empty",
    type: "empty",
  });
  const [isTaskTag, setIsTaskTag] = useState([]);
  function showSelectTag(e) {
    e.preventDefault();
    setIsShowSelectTag(!isShowSelectTag);
    setIsShowSelectGroup(false);
    setIsShowSelectState(false);
  }
  function handleSelectTag(name) {
    console.log("NAME", name);
    setIsTaskTag([...isTaskTag, { name: name }]);
  }
  function handleAddTag() {
    dispatch(getHeaderState({ title: "Add Tags" }));
    dispatch(getModalState({ isDialog: true }));
    console.log("태그추가");
  }

  // 디스크립션 입력
  const [isInputDesc, setIsInputDesc] = useState("");
  function handleInputDesc(e) {
    console.log(e.target.value);
    setIsInputDesc(e.target.value);
  }

  async function submitTaskData() {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "tasks"), {
      title: isInputTitle,
      category: isCurrentCat,
      state: isSelectState,
      group: isSelectGroup,
      tags: isSelectTag,
      description: isInputDesc,
    });

    console.log("docRef.id", docRef.id);
  }
  return (
    <>
      {console.log("isDialog", isDialog)}
      <DetailHeader title={title} type={type} />

      <main className="document">
        <div className="title">
          <input
            type="text"
            placeholder="Untitle"
            value={isInputTitle}
            onChange={handleInputTitle}
          />
        </div>

        <div className="tab-group flex flex-row items-center">
          {isCategory.map((tab, idx) => (
            <button
              className={`btn-square-outlined ${
                isCurrentCat === tab.name ? "active" : null
              }`}
              key={idx}
              value={tab.name}
              onClick={() => handleCategory(tab.name)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="option">
          <div className="option-item">
            <ul>
              <li className="flex items-center">
                <p className="title">State</p>

                <div
                  className="state result flex flex-1 items-center"
                  onClick={showSelectState}
                >
                  <p className={`label ${isSelectState.type}`}>
                    {isSelectState.name}
                  </p>

                  {isShowSelectState ? (
                    <ul className="dropdown">
                      {isTaskState.map((state, idx) => (
                        <li
                          onClick={() =>
                            handleSelectState(state.name, state.type)
                          }
                          key={idx}
                        >
                          <p className={state.type}>{state.name}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>

              <li className="flex items-center">
                <p className="title">Group</p>

                <div
                  className="group result flex flex-1 items-center"
                  onClick={showSelectGroup}
                >
                  <p className={isSelectGroup.type}>{isSelectGroup.name}</p>

                  {isShowSelectGroup ? (
                    <ul className="dropdown">
                      {isTaskGroup.map((group, idx) => (
                        <li
                          onClick={() =>
                            handleSelectGroup(group.name, group.type)
                          }
                          key={idx}
                        >
                          <p className={group.type}>{group.name}</p>
                        </li>
                      ))}

                      <li onClick={handleAddGroup}>
                        <p>추가하기</p>
                      </li>
                    </ul>
                  ) : null}
                </div>
              </li>

              <li className="flex items-center">
                <p className="title">Tags</p>

                <div
                  className="tag result flex flex-1 items-center"
                  onClick={showSelectTag}
                >
                  {isTaskTag.length > 0 ? (
                    isTaskTag.map((tag, idx) => (
                      <div className="chip" key={idx}>
                        <p>{tag.name}</p>
                        <i className="icon material-icons-outlined">close</i>
                      </div>
                    ))
                  ) : (
                    <p>{isSelectTag.name}</p>
                  )}

                  {isShowSelectTag ? (
                    <ul className="dropdown">
                      {isTaskTag.map((tag, idx) => (
                        <li onClick={() => handleSelectTag(tag.name)} key={idx}>
                          <div className="chip">
                            <p>{tag.name}</p>
                            <i className="icon material-icons-outlined">
                              close
                            </i>
                          </div>
                        </li>
                      ))}

                      <li onClick={handleAddTag}>
                        <p>추가하기</p>
                      </li>
                    </ul>
                  ) : null}
                </div>
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
            value={isInputDesc}
            onChange={handleInputDesc}
          ></textarea>
        </div>

        <div className="button-group flex flex-row justify-end">
          <button>aaaaa</button>
          <button>CANCEL</button>
          <button className="btn-flat primary" onClick={submitTaskData}>
            DONE
          </button>
        </div>
      </main>

      {isDialog.isDialog && <DialogAddTags title="Add Tags" />}
    </>
  );
};
