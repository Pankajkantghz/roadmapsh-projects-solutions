import StoryBar from "./components/StoryBar";
import StoryViewer from "./components/StoryViewer";

import useStoryPersistence from "./hooks/useStoryPersistence";

const App = () => {
  useStoryPersistence();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">
          Stories
        </h1>

        <StoryBar />
      </div>

      <StoryViewer />
    </div>
  );
};

export default App;