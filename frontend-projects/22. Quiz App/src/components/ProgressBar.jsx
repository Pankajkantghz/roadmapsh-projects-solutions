const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        style={{ width: `${percentage}%` }}
        className="h-full bg-black transition-all duration-300"
      />
    </div>
  );
};

export default ProgressBar;