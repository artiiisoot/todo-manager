import { configureStore, createSlice } from "@reduxjs/toolkit";

import taskReducer from "./reducers/taskReducer";
import headerReducer from "./reducers/headerReducer";
import modalReducer from "./reducers/modalReducer";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    header: headerReducer,
    modal: modalReducer,
  },
});

export default store;
