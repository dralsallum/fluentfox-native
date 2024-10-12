import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchUnlockedSets } from "./lessonsSlice";

export const updateStreakCount = createAsyncThunk(
  "user/updateStreakCount",
  async ({ userId }, thunkAPI) => {
    try {
      const response = await axios.put(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/streak/${userId}`
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, updates }, thunkAPI) => {
    try {
      // Get the user's access token from the state
      const state = thunkAPI.getState();
      const accessToken = state.user.currentUser?.accessToken;

      const response = await axios.put(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/profile/${userId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ userId }, thunkAPI) => {
    try {
      // Get the user's access token from the state
      const state = thunkAPI.getState();
      const accessToken = state.user.currentUser?.accessToken;

      await axios.delete(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // After successful deletion, dispatch signOut to clear user state
      thunkAPI.dispatch(signOut());

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://quizeng-022517ad949b.herokuapp.com/api/auth/login",
        credentials
      );

      // Dispatch fetchUnlockedSets after a successful login
      thunkAPI.dispatch(fetchUnlockedSets(response.data._id));

      // Dispatch updateStreakCount after successful login
      thunkAPI.dispatch(updateStreakCount({ userId: response.data._id }));

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for user registration
export const register = createAsyncThunk(
  "user/register",
  async (userDetails, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://quizeng-022517ad949b.herokuapp.com/api/auth/register",
        userDetails
      );

      // Dispatch fetchUnlockedSets after a successful registration
      thunkAPI.dispatch(fetchUnlockedSets(response.data._id));

      // Dispatch updateStreakCount after successful registration
      thunkAPI.dispatch(updateStreakCount({ userId: response.data._id }));

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  currentUser: null,
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

// Slice for user authentication
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut: (state) => {
      state.currentUser = null;
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.errorMessage = "";
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.currentUser = action.payload;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(login.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.currentUser = action.payload;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(register.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(updateStreakCount.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.streak = action.payload;
        }
      })
      .addCase(updateStreakCount.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload,
          };
        }
        state.isSuccess = true;
        state.isFetching = false;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});
// Export the actions
export const { clearState, signOut, setUser } = userSlice.actions;

// Selector to get user state
export const userSelector = (state) => state.user;

// Export the reducer
export default userSlice.reducer;
