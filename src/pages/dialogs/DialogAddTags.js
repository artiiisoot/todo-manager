import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getTags } from "../../redux/reducers/taskReducer";

import {
  collection,
  getFirestore,
  doc,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

import { ModalHeader } from "./components/ModalHeader";

export const DialogAddTags = () => {
  const dispatch = useDispatch();
  const db = getFirestore();
  const dbTags = collection(db, "tags");
  const [showErrMsg, setShowErrMsg] = useState(false);
  const [isTag, setIsTag] = useState("");
  const [tagData, setTagData] = useState([]);
  const taskTags = useSelector((state) => state.task.value.tags);

  function handleTag(e) {
    if(e.target.value.length > 20) {
      alert('20자 이상 입력할 수 없어요')
      return false
    }
    setIsTag(e.target.value);
  }
  function handleTagList(item) {
    dispatch(getTags([...taskTags, { name: item }]));
  }
  function handleDeleteTagList(e, id) {
    e.preventDefault();
    const result = taskTags.filter((item, idx) => {
      return idx !== id;
    });
    dispatch(getTags(result));
  }
  async function handleAddTag() {
    await addDoc(dbTags, {
      name: isTag,
    });
    setIsTag("");
  }

  async function handleDeleteTag(id) {
    try {
      await deleteDoc(doc(db, "tags", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  useEffect(() => {
    // console.log("tagList", tagList);
    onSnapshot(dbTags, (snapshot) => {
      const getTagData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return setTagData(getTagData);
    });
  }, [taskTags]);

  return (
    <div id="Dialog-AddState" className="modal">
      <div className="modal-dialog">
        <div className="modal-header">
          <ModalHeader />
        </div>
        <div className="modal-body">
          {taskTags.length > 0 ? (
            <div className="label-list">
              {taskTags.map((item, idx) => (
                <div className="chip " key={idx}>
                  <p className="ellipsis-1">{item.name}</p>
                  <button
                    className="icons icons-sm material-icons-outlined"
                    onClick={(e) => handleDeleteTagList(e, idx)}
                  >
                    close
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="input">
              <input
                type="text"
                placeholder="Search for the option"
                value={isTag}
                onChange={handleTag}
              />
              {showErrMsg && (
                <span className="error-message">error message</span>
              )}
            </div>
          )}

          <div className="divider"></div>

          <div className="text-item">
            <p>Select an option or create one</p>
          </div>

          {isTag && (
            <div className="add-item">
              <div className="left">
                <h5>Create</h5>
                <div className="chip">{isTag}</div>
              </div>
              <div className="right">
                <button className="btn-white" onClick={handleAddTag}>
                  Add
                </button>
              </div>
            </div>
          )}

          {tagData && (
            <div className="item-list">
              <ul>
                {tagData.map((item, idx) => (
                  <li onClick={() => handleTagList(item.name)} key={idx}>
                    <div className="chip">
                      <p className="ellipsis-1">{item.name}</p>
                      <button
                        className="icons icons-sm material-icons-outlined"
                        onClick={() => handleDeleteTag(item.id)}
                      >
                        close
                      </button>
                    </div>

                    <button className="icons material-icons-outlined">
                      more_horiz
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
