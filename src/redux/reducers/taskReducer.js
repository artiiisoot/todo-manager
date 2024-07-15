import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  title: "",
  type: "",
  state: "",
  group: "",
  tags: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    getTitle(state, action) {
      console.log("TITLE 입력");
      console.log("state.title", state.title);
      state.title = action.payload;
    },
  },
});

export const taskActions = taskSlice.actions;
export default taskSlice.reducer;
