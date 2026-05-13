import { useEffect } from "react";

import { useSelector } from "react-redux";

import { saveStories } from "../utils/storage";

const useStoryPersistence = () => {
  const stories = useSelector(
    (state) => state.stories.stories
  );

  useEffect(() => {
    saveStories(stories);
  }, [stories]);
};

export default useStoryPersistence;