import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authSlice";
import lessonsReducer from "./lessonsSlice"; // Import the lessons slice

export const store = configureStore({
  reducer: {
    user: userReducer, // Register the user reducer
    lessons: lessonsReducer, // Register the lessons reducer
  },
});

export default store;
