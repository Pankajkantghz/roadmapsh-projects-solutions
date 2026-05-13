import { useState } from "react";
import ProgressBars from "./ProgressBars";

const StoryViewer = ({
  stories,
  currentIndex,
  setCurrentIndex,
  progress,
}) => {
  const [touchStart, setTouchStart] = useState(0);

  // Swipe Handler
  const handleSwipe = (touchEnd) => {
    const distance = touchStart - touchEnd;

    // Swipe Left
    if (distance > 50) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }

    // Swipe Right
    if (distance < -50) {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  // Previous Story
  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Next Story
  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(null);
    }
  };

  if (currentIndex === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onTouchStart={(e) => {
        setTouchStart(e.targetTouches[0].clientX);
      }}
      onTouchEnd={(e) => {
        handleSwipe(e.changedTouches[0].clientX);
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setCurrentIndex(null)}
        className="absolute right-4 top-4 z-50 text-4xl text-white"
      >
        ×
      </button>

      {/* Progress Bars */}
      <ProgressBars
        stories={stories}
        currentIndex={currentIndex}
        progress={progress}
      />

      {/* Left Side */}
      <div
        onClick={handlePrevStory}
        className="absolute left-0 top-0 h-full w-1/2"
      />

      {/* Right Side */}
      <div
        onClick={handleNextStory}
        className="absolute right-0 top-0 h-full w-1/2"
      />

      {/* Story Image */}
      <img
        src={stories[currentIndex].image}
        alt="story"
        className="h-full max-h-screen w-full object-contain"
      />
    </div>
  );
};

export default StoryViewer;