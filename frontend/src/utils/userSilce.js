import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: JSON.parse(localStorage.getItem("user")) || {
    token: null,
  },
  reducers: {
    login(state, action) {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    },
    logout(state, action) {
      localStorage.removeItem("user");
      return {
        token: null,
      };
    },

    updateData(state, action) {
      const data = action.payload;
      localStorage.setItem("user", JSON.stringify({ ...state, ...data }));
      return { ...state, ...data };
    },
  },
});

export const { login, logout, updateData } = userSlice.actions;
export default userSlice.reducer;
