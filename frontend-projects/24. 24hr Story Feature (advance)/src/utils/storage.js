import { filterExpiredStories }
from "./storyExpiry";

export const saveStories = (
  stories
) => {
  localStorage.setItem(
    "stories",
    JSON.stringify(stories)
  );
};

export const loadStories = () => {
  const savedStories =
    localStorage.getItem("stories");

  if (!savedStories) {
    return null;
  }

  const parsedStories =
    JSON.parse(savedStories);

  return filterExpiredStories(
    parsedStories
  );
};