import { createSlice } from "@reduxjs/toolkit";
import { formatDate } from "../../utils/dateUtils";

let initialState = {
  selectedDate: "",
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    selectedDate(state, action) {
      console.log("state.selectedDate", state.selectedDate);
      state.selectedDate = formatDate(action.payload);
    },
  },
});

export const { selectedDate } = dateSlice.actions;
export default dateSlice.reducer;
