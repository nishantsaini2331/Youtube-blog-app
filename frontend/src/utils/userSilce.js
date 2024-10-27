import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: JSON.parse(localStorage.getItem("user")) || {
    token: null,
  },
  reducers: {
    login(state, action) {
      //   state.name = action.payload.name;
      //   state.email = action.payload.email;
      //   state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;

    },
    logout(state, action) {
        
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
