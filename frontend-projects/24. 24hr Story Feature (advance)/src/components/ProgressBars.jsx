import { useSelector } from "react-redux";

const ProgressBars = () => {
  const stories = useSelector((state) => state.stories.stories);

  const currentIndex = useSelector((state) => state.stories.currentIndex);

  const progress = useSelector((state) => state.stories.progress);
  const getProgressWidth = (index) => {
    if (index < currentIndex) {
      return "100%";
    }

    if (index === currentIndex) {
      return `${progress}%`;
    }

    return "0%";
  };

  return (
    <div className="absolute left-0 top-0 flex w-full gap-1 p-4">
      {stories.map((_, index) => (
        <div
          key={index}
          className="
            h-1
            flex-1
            overflow-hidden
            rounded
            bg-gray-600
          "
        >
          <div
            className="
              h-full
              bg-white
              transition-all
              duration-75
            "
            style={{
              width: getProgressWidth(index),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressBars;
