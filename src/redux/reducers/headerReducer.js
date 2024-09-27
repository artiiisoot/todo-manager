import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isNavbar: false,
  title: "", // 헤더 타이틀
  type: "", // 헤더 타입
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    getHeaderState(state, action) {
      console.log("Enter the Success", state.payload);
      state.title = action.payload.title;
      state.type = action.payload.type;
    },
    setIsNavbar(state, action) {
      state.isNavbar = action.payload
    }
  },
});

export const { getHeaderState, setIsNavbar } = headerSlice.actions;
export default headerSlice.reducer;
