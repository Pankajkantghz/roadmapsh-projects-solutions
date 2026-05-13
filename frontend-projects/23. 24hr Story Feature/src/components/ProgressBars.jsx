const ProgressBars = ({
  stories,
  currentIndex,
  progress,
}) => {
  return (
    <div className="absolute left-0 top-0 flex w-full gap-1 p-4">
      {stories.map((_, index) => (
        <div
          key={index}
          className="h-1 flex-1 overflow-hidden rounded bg-gray-600"
        >
          <div
            className="h-full bg-white transition-all duration-75"
            style={{
              width:
                index < currentIndex
                  ? "100%"
                  : index === currentIndex
                  ? `${progress}%`
                  : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressBars;