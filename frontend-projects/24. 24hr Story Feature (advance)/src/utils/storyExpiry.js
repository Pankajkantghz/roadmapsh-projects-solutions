export const filterExpiredStories = (
  stories
) => {
  const ONE_DAY =
    24 * 60 * 60 * 1000;

  return stories.filter((story) => {
    return (
      Date.now() - story.createdAt <
      ONE_DAY
    );
  });
};