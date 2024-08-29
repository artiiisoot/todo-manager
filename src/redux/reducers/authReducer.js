import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  uid: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.uid = action.payload.uid;
      state.token = action.payload.token;
    },
    logout(state) {
      state.uid = "";
      state.token = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
