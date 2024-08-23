import { configureStore, createSlice } from "@reduxjs/toolkit";

import headerReducer from "./reducers/headerReducer";
import modalReducer from "./reducers/modalReducer";
import taskReducer from "./reducers/taskReducer";
import dateReducer from "./reducers/dateReducer";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    modal: modalReducer,
    task: taskReducer,
    date: dateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
