import React from "react";
import Box from "./ui/Box";
import Button from "./ui/Button";

const Navigation = ({
  onNext,
  OnPrevious,
  OnToggleAnswer,
  isFlipped,
}) => {
  return (
    <Box>
      <div className="flex items-center justify-between h-[5vh]  p-1 rounded-sm bg-gray-300">
        <Button onClick={OnPrevious}  >&lt; Previous</Button>

        <Button onClick={OnToggleAnswer}>{isFlipped ? "Show Question" : "Show Answer"}</Button>

        <Button onClick={onNext} >next &gt;</Button>
      </div>
    </Box>
  );
};

export default Navigation;
