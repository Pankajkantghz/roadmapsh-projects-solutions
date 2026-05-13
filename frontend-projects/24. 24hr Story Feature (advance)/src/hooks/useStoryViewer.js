import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  closeStory,
  nextStory,
  prevStory,
  resetProgress,
  incrementProgress,
  deleteStory,
} from "../features/stories/storiesSlice";

const useStoryViewer = () => {
  const dispatch = useDispatch();

  const stories = useSelector((state) => state.stories.stories);

  const currentIndex = useSelector((state) => state.stories.currentIndex);

  const progress = useSelector((state) => state.stories.progress);

  // Reset Progress
  useEffect(() => {
    if (currentIndex !== null) {
      dispatch(resetProgress());
    }
  }, [currentIndex, dispatch]);

  // Auto Timer
  useEffect(() => {
    if (currentIndex === null) return;

    const interval = setInterval(() => {
      if (progress >= 100) {
        dispatch(resetProgress());
        dispatch(nextStory());

        return;
      }

      dispatch(incrementProgress());
    }, 60);

    return () => clearInterval(interval);
  }, [currentIndex, progress, dispatch]);

  // Handlers
  const handleNextStory = () => {
    dispatch(nextStory());
  };

  const handlePrevStory = () => {
    dispatch(prevStory());
  };

  const handleCloseStory = () => {
    dispatch(closeStory());
  };
  const handleDeleteStory = () => {
    const storyId = stories[currentIndex].id;

    dispatch(deleteStory(storyId));

    dispatch(closeStory());
  };
  return {
    stories,
    currentIndex,
    progress,
    handleNextStory,
    handlePrevStory,
    handleCloseStory,
    handleDeleteStory,
  };
};

export default useStoryViewer;
