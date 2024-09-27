import { configureStore, createSlice } from "@reduxjs/toolkit";

import headerReducer from "./reducers/headerReducer";
import modalReducer from "./reducers/modalReducer";
import taskReducer from "./reducers/taskReducer";
import dateReducer from "./reducers/dateReducer";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import loadingReducer from "./reducers/loadingReducer";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    modal: modalReducer,
    task: taskReducer,
    date: dateReducer,
    auth: authReducer,
    user: userReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
