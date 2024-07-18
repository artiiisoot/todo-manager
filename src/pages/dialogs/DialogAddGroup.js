import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getGroup } from "../../redux/reducers/taskReducer";
import { getModalState } from "../../redux/reducers/modalReducer";

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
import { useNavigate } from "react-router-dom";

export const DialogAddGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const db = getFirestore();
  const dbGroup = collection(db, "group");
  const [showAddInput, setShowAddInput] = useState(false);
  const [isGroup, setIsGroup] = useState("");
  const [groupData, setGroupData] = useState("");
  const [showErrMsg, setShowErrMsg] = useState(false);
  const taskGroup = useSelector((state) => state.task.value.group);

  function handleGroupList(item) {
    dispatch(getGroup({ name: item }));
    dispatch(getModalState({ type: "", title: "", open: false }));
  }

  async function handleAddGroup() {
    await addDoc(dbGroup, {
      name: isGroup,
    });
    setShowAddInput(false);
    setIsGroup("");
  }

  useEffect(() => {
    console.log("taskGroup", taskGroup);
    onSnapshot(dbGroup, (snapshot) => {
      const getGroupData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return setGroupData(getGroupData);
    });
  }, [taskGroup]);

  return (
    <div id="Dialog-AddState" className="modal">
      <div className="modal-dialog">
        <div className="modal-header">
          <ModalHeader />
        </div>

        <div className="modal-body">
          <div className="group-list">
            <h5>Group</h5>
            <ul>
              {groupData
                ? groupData.map((item, idx) => (
                    <li onClick={() => handleGroupList(item.name)} key={idx}>
                      <p>{item.name}</p>
                      <button className="icons icons-sm material-icons-outlined">
                        close
                      </button>
                    </li>
                  ))
                : null}
              {/* <li>HOME</li>
              <li>HOME</li>
              <li>HOME</li> */}
            </ul>
          </div>

          {showAddInput ? (
            <input
              type="text"
              placeholder="Search for the option"
              value={isGroup}
              onChange={(e) => setIsGroup(e.target.value)}
            />
          ) : (
            <button className="btn-add" onClick={() => setShowAddInput(true)}>
              <i className="icons material-icons-outlined">add</i>
              Add
            </button>
          )}

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
            </div>
          )}
        </div>
        {/* <div className="modal-body">
          {taskGroup ? (
            <div className="label-list">
              <div className="group">
                <p className="default">
                  {taskGroup.name}
                  <button className="icons icons-sm material-icons-outlined">
                    close
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="input">
              <input
                type="text"
                placeholder="Search for the option"
                value={isGroup}
                onChange={(e) => setIsGroup(e.target.value)}
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
            </div>
          )}

          {groupData && (
            <div className="item-list">
              <ul>
                {groupData.map((item, idx) => (
                  <li
                    className="group-item"
                    onClick={(e) => handleGroupList(item.name)}
                    key={idx}
                  >
                    <p>{item.name}</p>
                    <button className="icons icons-sm material-icons-outlined">
                      close
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
