import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authSlice";
import lessonsReducer from "./lessonsSlice";
import storyReducer from "./storySlice";

export const store = configureStore({
  reducer: {
    user: userReducer, // Register the user reducer
    story: storyReducer,
    lessons: lessonsReducer, // Register the lessons reducer
  },
});

export default store;
