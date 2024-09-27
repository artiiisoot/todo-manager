import { createSlice } from "@reduxjs/toolkit";
import { uploadProfileImage } from "../../store/userThunks";

let initialState = {
  displayName: "",
  // phoneNumber: "",
  photoURL: "",
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
        state.url = action.payload;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to upload image";
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
