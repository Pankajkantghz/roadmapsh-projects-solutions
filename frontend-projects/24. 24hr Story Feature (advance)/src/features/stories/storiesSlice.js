import { createSlice } from "@reduxjs/toolkit";

import { defaultStories } from "../../data/defaultStories";

import { loadStories } from "../../utils/storage";
const initialState = {
  stories:
  loadStories() || defaultStories,
  currentIndex: null,
  progress: 0,
};
const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    openStory: (state, action) => {
      state.currentIndex = action.payload;
    },
    closeStory: (state) => {
      state.currentIndex = null;
    },
    nextStory: (state) => {
      if (state.currentIndex < state.stories.length - 1) {
        state.currentIndex += 1;
      } else {
        state.currentIndex = null;
      }
    },

    prevStory: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },

    resetProgress: (state) => {
      state.progress = 0;
    },
    incrementProgress: (state) => {
      state.progress += 2;
    },
    addStory: (state, action) => {
      state.stories.unshift(action.payload);
    },
    deleteStory: (state, action) => {
      state.stories = state.stories.filter(
        (story) => story.id !== action.payload,
      );
    },
  },
});

export const {
  openStory,
  closeStory,
  nextStory,
  prevStory,
  setProgress,
  resetProgress,
  incrementProgress,
  addStory,
  deleteStory,
} = storiesSlice.actions;

export default storiesSlice.reducer;
