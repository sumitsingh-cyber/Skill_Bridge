import {createSlice} from "@reduxjs/toolkit"

let savedUser = null;
try {
  const item = localStorage.getItem("user");
  if (item && item !== "undefined" && item !== "null") {
    savedUser = JSON.parse(item);
  }
} catch {
  savedUser = null;
}

const initialState = {
  user: savedUser,
  loading: false,
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;