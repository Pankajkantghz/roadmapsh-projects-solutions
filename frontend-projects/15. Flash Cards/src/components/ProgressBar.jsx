import React from "react";
import Box from "./ui/Box";

const ProgressBar = ({ currentIndex, total }) => {
  const progress = ((currentIndex + 1) / total) * 100;
  return (
    <Box>
        <div
          className="flex items-center justify-end bg-gray-400  h-[5vh]  p-1 rounded-md"
          style={{ width: `${progress}%` }}
        >
          {Math.round(progress)}%
        </div>
     
    </Box>
  );
};

export default ProgressBar;
