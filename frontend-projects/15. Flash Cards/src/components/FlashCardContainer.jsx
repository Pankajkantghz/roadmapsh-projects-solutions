import React, { useState } from "react";
import Navigation from "./Navigation";
import ProgressBar from "./ProgressBar";
import FlashCard from "./FlashCard";
import flashcards from "../db/flashcards.json";
import Box from "./ui/Box";

const FlashCardContainer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const totalCards = flashcards.length;
  const currentCard = flashcards[currentIndex];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };


const handleNext = () => {
  setCurrentIndex((prev) => (prev + 1) % totalCards);
  setIsFlipped(false);
};

const handlePrevious = () => {
  setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  setIsFlipped(false);
};


  return (
    <div className="w-[60vw] h-[60vh] flex flex-col justify-between gap-2 ">
      <ProgressBar currentIndex={currentIndex} total={totalCards} />

      <FlashCard
        question={currentCard.question}
        answer={currentCard.answer}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      <Navigation 
      onNext={handleNext}
      OnPrevious={handlePrevious}
      OnToggleAnswer={handleFlip}
      isFlipped={isFlipped}
      isFirst={currentIndex === 0}
      isLast={currentIndex === totalCards - 1}/>
    </div>
  );
};

export default FlashCardContainer;
