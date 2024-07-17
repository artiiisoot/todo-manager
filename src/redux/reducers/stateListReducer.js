import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  stateList: "",
};
const stateListSlice = createSlice({
  name: "stateList",
  initialState,
  reducers: {
    getStateList(state, action) {
      state.stateList = action.payload;
    },
  },
});

export const { getStateList } = stateListSlice.actions;
export default stateListSlice.reducer;

export function getTransName(name) {
  switch (name) {
    case "before":
      return "시작전";

    case "start":
      return "진행중";

    case "complete":
      return "완료";

    default:
      return name;
  }
}
