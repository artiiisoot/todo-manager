import { createSlice } from "@reduxjs/toolkit";

let initialStateValue = {
  categoryList: [
    {
      name: "Project",
    },
    {
      name: "Today",
    },
  ],
  category: null,
  state: "",
  group: "",
  tags: [],
  createDate: "",
};

const taskSlice = createSlice({
  name: "task",
  initialState: { value: initialStateValue },
  reducers: {
    getCategory(state, action) {
      state.value.category = action.payload;
    },
    getState(state, action) {
      console.log("state.state", state.value.state);
      state.value.state = action.payload;
    },
    getGroup(state, action) {
      console.log("state.group", state.value.group);
      state.value.group = action.payload;
    },
    getTags(state, action) {
      console.log(
        "state.tags",
        state.value.tags.map((item) => item.name)
      );
      state.value.tags = action.payload;
    },
    getCreateDate(state, action) {
      console.log("state.createDate", state.createDate);
      state.value.createDate = action.payload;
    },
    getTaskData(state, action) {
      state.value = action.payload;
    },
    getProjectData(state, action) {
      state.value = action.payload;
    },
    resetState(state) {
      state.value = initialStateValue;
    },
  },
});

export const {
  getTaskData,
  getProjectData,
  getCategory,
  getTitle,
  getState,
  getGroup,
  getTags,
  getCreateDate,
  resetState,
} = taskSlice.actions;
export default taskSlice.reducer;

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
