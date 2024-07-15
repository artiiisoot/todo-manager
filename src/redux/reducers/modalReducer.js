import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isDialog: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    getModalState(state, action) {
      console.log("Enter the Success is Modal State");
      state.isDialog = action.payload;
    },
  },
});

export const { getModalState } = modalSlice.actions;
export default modalSlice.reducer;
