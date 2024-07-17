import { configureStore, createSlice } from "@reduxjs/toolkit";

import taskReducer from "./reducers/taskReducer";
import stateListReducer from "./reducers/stateListReducer"
import groupListReducer from "./reducers/groupListReducer"
import tagListReducer from "./reducers/tagListReducer"
import headerReducer from "./reducers/headerReducer";
import modalReducer from "./reducers/modalReducer";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    stateList: stateListReducer,
    groupList: groupListReducer,
    tagList: tagListReducer,
    header: headerReducer,
    modal: modalReducer,
  },
});

export default store;
