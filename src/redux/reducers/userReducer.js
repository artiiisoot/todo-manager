import { createSlice } from "@reduxjs/toolkit";
import { uploadProfileImage } from "../../store/userThunks";

let initialState = {
  displayName: "",
  // phoneNumber: "",
  photoURL: null,
  url: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action) {
      console.log(action.payload);
      state.displayName = action.payload.displayName;
      // state.phoneNumber = action.payload.phoneNumber;
      state.photoURL = action.payload.photoURL;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(" action.payload.photoURL", action.payload.photoURL);
        state.photoURL = action.payload.photoURL;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
