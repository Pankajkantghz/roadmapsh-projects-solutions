

const STORAGE_KEY = "stories";

export const getStories = () => {
  const savedStories =
    localStorage.getItem(STORAGE_KEY);

  if (!savedStories) return [];

  return JSON.parse(savedStories);
};

export const saveStories = (stories) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stories)
  );
};