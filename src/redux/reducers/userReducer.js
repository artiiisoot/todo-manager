import { createSlice } from "@reduxjs/toolkit";
import { updateDisplayName, uploadProfileImage } from "../../store/userThunks";

import ProfileDefault from "../../assets/images/profile_default.svg";

let initialState = {
  displayName: "",
  // phoneNumber: "",
  photoURL: ProfileDefault,
  url: null,
  status: "idle",
  error: null,
  isChangeDisplayName: false,
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
    setIsChangeDisplayName(state, action) {
      console.log("changeDisplayName1111", action.payload);
      state.isChangeDisplayName = action.payload;
    },
    setDisplayName(state, action) {
      console.log("displayname", action.payload.displayName);
      state.displayName = action.payload.displayName;
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
        if (action.payload.photoURL) {
          state.photoURL = action.payload.photoURL;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(updateDisplayName.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateDisplayName.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("action.payload", action.payload.displayName);
        if (action.payload && action.payload.displayName) {
          console.log("action.payload", action.payload.displayName);
          state.displayName = action.payload.displayName;
        } else {
          console.error("No displayName in payload", action.payload);
        }
      })
      .addCase(updateDisplayName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
    // .addCase(updateProfile.pending, (state) => {
    //   state.status = "loading";
    //   state.error = null;
    // });
  },
});

export const { setUserData, setDisplayName, setIsChangeDisplayName } =
  userSlice.actions;
export default userSlice.reducer;
