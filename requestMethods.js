// requestMethods.js
import axios from "axios";
import store from "./app/redux/store"; // Import your Redux store

const BASE_URL = "https://quizeng-022517ad949b.herokuapp.com/api";

// Function to create a userRequest instance with the latest token
export const createUserRequest = () => {
  const state = store.getState();
  const TOKEN = state.user.currentUser?.token;

  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
};

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
