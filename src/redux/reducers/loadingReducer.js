import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  loading: false,
  loadingImage: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setLoadingImage(state, action) {
      state.loadingImage = action.payload;
    },
  },
});

export const { setLoading, setLoadingImage } = loadingSlice.actions;
export default loadingSlice.reducer;
