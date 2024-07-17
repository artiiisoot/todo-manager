import { createSlice } from "@reduxjs/toolkit";

let initialStateValue = {
  type: "",
  title: "",
  open: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState: { value: initialStateValue },
  reducers: {
    getModalState(state, action) {
      console.log("Enter the Success is Modal State");
      state.value = action.payload;
    },
  },
});

export const { getModalState } = modalSlice.actions;
export default modalSlice.reducer;
