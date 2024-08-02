import { configureStore, createSlice } from "@reduxjs/toolkit";

import headerReducer from "./reducers/headerReducer";
import modalReducer from "./reducers/modalReducer";
import taskReducer from "./reducers/taskReducer";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    modal: modalReducer,
    task: taskReducer,
  },
});

export default store;
