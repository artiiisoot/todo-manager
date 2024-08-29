import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getGroup } from "../../redux/reducers/taskReducer";
import { getModalState } from "../../redux/reducers/modalReducer";

import {
  collection,
  getFirestore,
  doc,
  addDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { ModalHeader } from "./components/ModalHeader";
import { useNavigate } from "react-router-dom";

export const DialogAddGroup = () => {
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.auth.uid);
  const navigate = useNavigate();
  const db = getFirestore();
  const dbGroup = collection(db, "users", uid, "group");
  const [showAddInput, setShowAddInput] = useState(false);
  const [isGroup, setIsGroup] = useState("");
  const [groupData, setGroupData] = useState("");
  const [showErrMsg, setShowErrMsg] = useState(false);
  const taskGroup = useSelector((state) => state.task.value.group);

  function handleGroup(e) {
    if (e.target.value.length > 18) {
      alert("18자 이상 입력할 수 없어요");
      return false;
    }
    setIsGroup(e.target.value);
  }
  function handleGroupList(item) {
    dispatch(getGroup({ name: item }));
    dispatch(getModalState({ type: "", title: "", open: false }));
  }

  async function handleAddGroup() {
    await addDoc(dbGroup, {
      name: isGroup,
      timestamp: serverTimestamp(),
    });
    setShowAddInput(false);
    setIsGroup("");
  }

  async function handleDeleteState(e, id) {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "users", uid, "group", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  useEffect(() => {
    onSnapshot(dbGroup, (snapshot) => {
      const getGroupData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return setGroupData(getGroupData);
    });
  }, []);

  return (
    <div id="Dialog-AddState" className="modal">
      <div className="modal-dialog">
        <div className="modal-header">
          <ModalHeader />
        </div>
        <div className="modal-body">
          {taskGroup ? (
            <div className="label-list">
              <div className="group">
                <p className={taskGroup.name}>{taskGroup.name}</p>
                <button
                  className="icons icons-sm material-icons-outlined"
                  // onClick={(e) => handleDeleteStateList(e, taskState.name)}
                >
                  close
                </button>
              </div>
            </div>
          ) : (
            <div className="input">
              <input
                type="text"
                placeholder="Search for the option"
                value={isGroup}
                onChange={handleGroup}
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

          {/* //// ADMIN일때만 오픈 //// */}
          {isGroup && (
            <div className="add-item">
              <div className="left">
                <h5>Create</h5>
                <div>{isGroup}</div>
              </div>
              <div className="right">
                <button className="btn-white" onClick={handleAddGroup}>
                  Add
                </button>
              </div>
              {/* {console.log("isGroup", isGroup)} */}
            </div>
          )}

          {groupData && (
            <div className="item-list">
              <ul>
                {groupData.map((item, idx) => (
                  <li onClick={() => handleGroupList(item.name)} key={idx}>
                    <div className="group">
                      <p>{item.name}</p>
                      <button
                        className="icons icons-sm material-icons-outlined"
                        onClick={(e) => handleDeleteState(e, item.id)}
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
