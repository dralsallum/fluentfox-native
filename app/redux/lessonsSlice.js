import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import chapterItems from "../utils/chapterItems";

export const fetchUserProgress = createAsyncThunk(
  "lessons/fetchProgress",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/${userId}/progress`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  unlockedSets: { 1: [1] }, // Start with only the first set of Chapter 1 unlocked
  xp: 0, // Initialize XP
};

const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    unlockNextLesson: (state) => {
      const chapters = Object.keys(state.unlockedSets);
      for (let chapter of chapters) {
        const currentChapterSets = state.unlockedSets[chapter] || [];
        const nextLessonId = Math.max(...currentChapterSets) + 1;
        const isLastLesson =
          nextLessonId >
          chapterItems.filter((item) => item.chapterId === parseInt(chapter))
            .length;

        if (!isLastLesson) {
          state.unlockedSets[chapter] = [...currentChapterSets, nextLessonId];
          state.xp += 1; // Increase XP by 1
          return;
        }
      }

      // If all sets in the current chapter are unlocked, unlock the first set of the next chapter
      const nextChapter = parseInt(chapters[chapters.length - 1]) + 1;
      state.unlockedSets[nextChapter] = [1];
      state.xp += 1; // Increase XP by 1
    },
    resetLessons: (state) => {
      state.unlockedSets = { 1: [1] }; // Reset to the initial state
      state.xp = 0; // Reset XP to 0
    },
    setProgress: (state, action) => {
      state.unlockedSets = action.payload.unlockedSets;
      state.xp = action.payload.xp;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProgress.fulfilled, (state, action) => {
      state.xp = action.payload.xp;
      // Logic to unlock the last accessed lessons
      state.unlockedSets = action.payload.unlockedSets;
    });
  },
});

// Selector to get the XP from the state
export const xpSelector = (state) => state.lessons.xp;

export const { unlockNextLesson, resetLessons, setProgress } =
  lessonsSlice.actions;

export default lessonsSlice.reducer;
