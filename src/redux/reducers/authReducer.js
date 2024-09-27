import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  uid: "",
  token: "",
  level: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      console.log(action.payload);
      
      state.uid = action.payload.uid;
      state.token = action.payload.token;
      state.level = action.payload.level;
    },
    logout(state) {
      state.uid = "";
      state.token = "";
      state.level = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
