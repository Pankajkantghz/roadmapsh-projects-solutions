import { useEffect, useState } from "react";

import { defaultStories } from "./data/defaultStories";

import StoryBar from "./components/StoryBar";
import StoryViewer from "./components/StoryViewer";

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [progress, setProgress] = useState(0);

  // Stories State
  const [stories, setStories] = useState(() => {
    const savedStories =
      localStorage.getItem("stories");

    const validStories = savedStories
      ? JSON.parse(savedStories).filter(
          (story) =>
            Date.now() - story.createdAt <
            24 * 60 * 60 * 1000
        )
      : null;

    return validStories || defaultStories;
  });

  // Auto Progress
  useEffect(() => {
    if (currentIndex === null) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 2;

        if (nextProgress >= 100) {
          clearInterval(interval);

          if (
            currentIndex <
            stories.length - 1
          ) {
            setTimeout(() => {
              setCurrentIndex(
                (prevIndex) => prevIndex + 1
              );
            }, 0);
          } else {
            setTimeout(() => {
              setCurrentIndex(null);
            }, 0);
          }

          return 100;
        }

        return nextProgress;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length]);

  // Reset Progress
  useEffect(() => {
    if (currentIndex !== null) {
      setProgress(0);
    }
  }, [currentIndex]);

  // Save Stories
  useEffect(() => {
    localStorage.setItem(
      "stories",
      JSON.stringify(stories)
    );
  }, [stories]);

  // Upload Story
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const newStory = {
        id: crypto.randomUUID(),
        image: reader.result,
        createdAt: Date.now(),
      };

      setStories((prev) => [
        ...prev,
        newStory,
      ]);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">
          Stories
        </h1>

        {/* Story Bar */}
        <StoryBar
          stories={stories}
          onUpload={handleImageUpload}
          onStoryClick={setCurrentIndex}
        />
      </div>

      {/* Story Viewer */}
      <StoryViewer
        stories={stories}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        progress={progress}
      />
    </div>
  );
};

export default App;