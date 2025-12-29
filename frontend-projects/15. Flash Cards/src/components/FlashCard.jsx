import React from "react";
import Box from "./ui/Box";

const FlashCard = ({ question, answer, isFlipped, onFlip }) => {
  return (
    <Box className="h-full">
      <div
        className="bg-gray-300 h-full rounded-md flex justify-center items-center cursor-pointer p-5"
        onClick={onFlip}
        role="button"
        tabIndex={0}
      >
        {isFlipped ? (
          <div className="text-2xl"> {answer} </div>
        ) : (
          <div className="text-4xl">{question}</div>
        )}
      </div>
    </Box>
  );
};

export default FlashCard;
