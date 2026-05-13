import { FiTrash2, FiX } from "react-icons/fi";

import ProgressBars from "./ProgressBars";
import useStoryViewer from "../hooks/useStoryViewer";
import { formatStoryTime } from "../utils/formatTime";
const StoryViewer = () => {
  const {
    stories,
    currentIndex,
    handleNextStory,
    handlePrevStory,
    handleCloseStory,
    handleDeleteStory,
  } = useStoryViewer();

  if (currentIndex === null) return null;

  return (
    <div
      className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-black
    p-4
    md:p-8
  "
    >
      {/* Story Card */}
      <div
        className="
      relative
      h-full
      w-full
      max-w-md
      overflow-hidden
      rounded-3xl
      bg-black
      shadow-2xl
    "
      >
        {/* Story Image */}
        <img
          src={stories[currentIndex].image}
          alt="story"
          className="
        h-full
        w-full
        object-cover
      "
        />

        {/* Top Gradient */}
        <div
          className="
        absolute
        inset-x-0
        top-0
        h-40
        bg-gradient-to-b
        from-black/80
        to-transparent
        z-40
      "
        />

        {/* Bottom Gradient */}
        <div
          className="
        absolute
        inset-x-0
        bottom-0
        h-32
        bg-gradient-to-t
        from-black/70
        to-transparent
        z-40
      "
        />

        {/* Progress Bars */}
        <div
          className="
        absolute
        left-0
        top-0
        z-50
        w-full
        px-3
        pt-3
      "
        >
          <ProgressBars />
        </div>

        {/* Header */}
        <div
          className="
        absolute
        left-0
        top-5
        z-50
        flex
        w-full
        items-center
        justify-between
        px-4
      "
        >
          {/* User Info */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-white/10
            text-sm
            font-semibold
            text-white
            backdrop-blur-md
          "
            >
              YS
            </div>

            {/* Name + Time */}
            <div>
              <h2
                className="
              text-sm
              font-semibold
              text-white
            "
              >
                Your Story
              </h2>

              <p
                className="
              text-xs
              text-gray-300
            "
              >
                {formatStoryTime(stories[currentIndex].createdAt)}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Delete */}
            {/* Delete */}
            <button
              onClick={handleDeleteStory}
              className="
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    bg-black/30
    text-white
    backdrop-blur-md
    transition-all
    duration-200
    hover:bg-red-500
    hover:scale-105
    active:scale-95
  "
            >
              <FiTrash2 size={20} />
            </button>

            {/* Close */}
            <button
              onClick={handleCloseStory}
              className="
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    bg-black/30
    text-white
    backdrop-blur-md
    transition-all
    duration-200
    hover:bg-white/20
    hover:scale-105
    active:scale-95
  "
            >
              <FiX size={22} />
            </button>
          </div>
        </div>

        {/* Left Navigation */}
        <div
          onClick={handlePrevStory}
          className="
        absolute
        left-0
        top-0
        z-30
        h-full
        w-1/2
        cursor-pointer
      "
        />

        {/* Right Navigation */}
        <div
          onClick={handleNextStory}
          className="
        absolute
        right-0
        top-0
        z-30
        h-full
        w-1/2
        cursor-pointer
      "
        />
      </div>
    </div>
  );
};

export default StoryViewer;
