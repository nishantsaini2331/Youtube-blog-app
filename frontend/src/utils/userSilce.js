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
      if (data[0] === "visibility") {
        localStorage.setItem("user", JSON.stringify({ ...state, ...data[1] }));
        return { ...state, ...data };
      } else if (data[0] === "followers") {
        return {
          ...state,
          following: state.following.includes(data[1])
            ? state.following.filter((id) => id !== data[1])
            : [...state.following, data[1]],
        };
      }
    },
  },
});

export const { login, logout, updateData } = userSlice.actions;
export default userSlice.reducer;
