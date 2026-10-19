import {createSlice} from "@reduxjs/toolkit"

let savedUser = null;
try {
  const item = localStorage.getItem("user");
  if (item && item !== "undefined" && item !== "null") {
    savedUser = JSON.parse(item);
    if (savedUser) {
      if (savedUser.image) savedUser.image = savedUser.image.replace(/^http:\/\//i, "https://");
      if (savedUser.Image) savedUser.Image = savedUser.Image.replace(/^http:\/\//i, "https://");
    }
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
            let userData = value.payload;
            if (userData) {
              if (userData.image) userData.image = userData.image.replace(/^http:\/\//i, "https://");
              if (userData.Image) userData.Image = userData.Image.replace(/^http:\/\//i, "https://");
            }
            state.user = userData;
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
    },
});


export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;