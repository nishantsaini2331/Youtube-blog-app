import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSilce";
import selectedBlog from "./selectedBlogSlice";
import commentSlice from "./commentSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    selectedBlog: selectedBlog,
    comment : commentSlice
  },
});

export default store;
