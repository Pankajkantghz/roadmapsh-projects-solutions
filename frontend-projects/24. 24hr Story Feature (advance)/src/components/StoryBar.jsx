import { useDispatch, useSelector } from "react-redux";

import StoryCard from "./StoryCard";
import UploadButton from "./UploadButton";

import { openStory } from "../features/stories/storiesSlice";

const StoryBar = () => {
  const dispatch = useDispatch();

  const stories = useSelector(
    (state) => state.stories.stories
  );

  const handleOpenStory = (index) => {
    dispatch(openStory(index));
  };

  return (
    <div
      className="
        flex
        items-center
        gap-4
        overflow-x-auto
        rounded-2xl
        border-2
        border-black
        bg-white
        p-4
      "
    >
      <UploadButton />

      {stories.map((story, index) => (
        <StoryCard
          key={story.id}
          image={story.image}
          onClick={() =>
            handleOpenStory(index)
          }
        />
      ))}
    </div>
  );
};

export default StoryBar;