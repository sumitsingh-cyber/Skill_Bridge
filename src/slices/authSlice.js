import { createSlice } from "@reduxjs/toolkit";

let savedToken = null;
try {
  const item = localStorage.getItem("token");
  if (item && item !== "undefined" && item !== "null") {
    savedToken = JSON.parse(item);
  }
} catch {
  savedToken = localStorage.getItem("token");
}

const initialState = {
  signupData: null,
  loading: false,
  token: savedToken,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
