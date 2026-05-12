import { useCallback, useEffect, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import QuizResult from "./components/QuizResult";
import QuizStart from "./components/QuizStart";
import { questions } from "../data/questions";

export default function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const currentQuiz = questions[currentQuestion];

  // NEXT QUESTION
  const handleNextQuestion = useCallback(() => {
    if (!selectedAnswer) {
      setResults((prev) => [
        ...prev,
        {
          question: currentQuiz.question,
          selected: "Not Attempted",
          correct: currentQuiz.answer,
          isCorrect: false,
        },
      ]);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(60);
    } else {
      setShowResults(true);
    }
  }, [selectedAnswer, currentQuiz, currentQuestion]);

  // TIMER
  useEffect(() => {
    if (!quizStarted || showResults) return;

    // AUTO NEXT
    if (timeLeft === 0) {
      const timeout = setTimeout(() => {
        handleNextQuestion();
      }, 0);

      return () => clearTimeout(timeout);
    }

    // COUNTDOWN
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    timeLeft,
    quizStarted,
    showResults,
    handleNextQuestion,
  ]);

  // ANSWER SELECT
  const handleAnswerSelect = (option) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option);

    const isCorrect = option === currentQuiz.answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setResults((prev) => [
      ...prev,
      {
        question: currentQuiz.question,
        selected: option,
        correct: currentQuiz.answer,
        isCorrect,
      },
    ]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {!quizStarted ? (
        <QuizStart
          totalQuestions={questions.length}
          onStart={() => setQuizStarted(true)}
        />
      ) : showResults ? (
        <QuizResult
          score={score}
          totalQuestions={questions.length}
          results={results}
        />
      ) : (
        <QuestionCard
          question={currentQuiz}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNextQuestion}
          timeLeft={timeLeft}
        />
      )}
    </div>
  );
}