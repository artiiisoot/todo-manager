import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  tagList: [],
};
const tagListSlice = createSlice({
  name: "tagList",
  initialState,
  reducers: {
    getTagList(state, action) {
      state.tagList = action.payload;
    },
  },
});

export const { getTagList } = tagListSlice.actions;
export default tagListSlice.reducer;
