import { createSlice } from "@reduxjs/toolkit";

let initialStateValue = {
  state: "",
  group: "",
  tags: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState: { value: initialStateValue },
  reducers: {
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

    getTaskData(state, action) {
      state.value = action.payload;
    },
  },
});

export const { getTaskData, getTitle, getState, getGroup, getTags } =
  taskSlice.actions;
export default taskSlice.reducer;
