import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getTransName } from "../../redux/reducers/taskReducer";
import { getState } from "../../redux/reducers/taskReducer";
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

export const DialogAddStates = ({ item }) => {
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.auth.uid);
  const db = getFirestore();
  const dbStates = collection(db, "states");
  const [showErrMsg, setShowErrMsg] = useState(false);
  const [isState, setIsState] = useState("");
  const [stateData, setStateData] = useState([]);
  const taskState = useSelector((state) => state.task.value.state);

  function handleStateList(item) {
    dispatch(getState({ name: item }));
    dispatch(getModalState({ type: "", title: "", open: false }));
  }

  async function handleAddTag() {
    await addDoc(dbStates, {
      name: isState,
      timestamp: serverTimestamp(),
    });
    setIsState("");
  }

  function handleDeleteStateList(e, name) {
    e.preventDefault();

    if (taskState.name === name) {
      dispatch(getState(null));
    }
  }

  async function handleDeleteState(e, id) {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "users", uid, "states", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  useEffect(() => {
    onSnapshot(dbStates, (snapshot) => {
      const getStateData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return setStateData(getStateData);
    });
  }, []);

  useEffect(() => {
    dispatch(getState(item));
  }, [dispatch, item]);
  return (
    <div id="Dialog-AddState" className="modal">
      <div className="modal-dialog">
        <div className="modal-header">
          <ModalHeader />
        </div>
        <div className="modal-body">
          {taskState ? (
            <div className="label-list">
              <div className="state">
                <p className={taskState.name}>
                  {getTransName(taskState.name)}
                  <button
                    className="icons icons-sm material-icons-outlined"
                    onClick={(e) => handleDeleteStateList(e, taskState.name)}
                  >
                    close
                  </button>
                </p>
              </div>
            </div>
          ) : // <div className="input">
          //   <input
          //     type="text"
          //     placeholder="Search for the option"
          //     value={isState}
          //     onChange={(e) => setIsState(e.target.value)}
          //   />
          //   {showErrMsg && (
          //     <span className="error-message">error message</span>
          //   )}
          // </div>
          null}

          <div className="divider"></div>

          <div className="text-item">
            <p>Select an option or create one</p>
          </div>

          {/* //// ADMIN일때만 오픈 //// */}
          {isState && (
            <div className="add-item">
              <div className="left">
                <h5>Create</h5>
                <div>{getTransName(isState)}</div>
              </div>
              <div className="right">
                <button className="btn-white" onClick={handleAddTag}>
                  Add
                </button>
              </div>
              {console.log("isState", isState)}
            </div>
          )}

          {stateData && (
            <div className="item-list">
              <ul>
                {stateData.map((item, idx) => (
                  <li onClick={() => handleStateList(item.name)} key={idx}>
                    <div className="state">
                      <p className={item.name}>
                        {getTransName(item.name)}

                        {/* <button
                          className="icons icons-sm material-icons-outlined"
                          onClick={(e) => handleDeleteState(e, item.id)}
                        >
                          close
                        </button> */}
                      </p>
                    </div>

                    {/* <button className="icons material-icons-outlined">
                      more_horiz
                    </button> */}
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
