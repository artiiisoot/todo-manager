import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  groupList: "",
};
const groupListSlice = createSlice({
  name: "groupList",
  initialState,
  reducers: {
    getGroupList(state, action) {
      state.groupList = action.payload;
    },
  },
});

export const { getGroupList } = groupListSlice.actions;
export default groupListSlice.reducer;