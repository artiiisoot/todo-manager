import { createSlice } from "@reduxjs/toolkit";

let initialStateValue = {
  type: "", // modal
  title: "", // title
};

const headerSlice = createSlice({
  name: "header",
  initialState: { value: initialStateValue },
  reducers: {
    getHeaderState(state, action) {
      console.log("Enter the Success");
      state.value = action.payload;
    },
  },
});

export const { getHeaderState } = headerSlice.actions;
export default headerSlice.reducer;
