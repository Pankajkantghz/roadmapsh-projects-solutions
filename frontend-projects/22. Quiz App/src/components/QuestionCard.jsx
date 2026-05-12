import ProgressBar from "./ProgressBar";
import Timer from "./Timer";

const QuestionCard = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  timeLeft,
}) => {
  return (
    <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Question {currentQuestion + 1} / {totalQuestions}
        </h2>

        <Timer timeLeft={timeLeft} />
      </div>

      <ProgressBar
        current={currentQuestion}
        total={totalQuestions}
      />

      <div className="rounded-2xl border bg-gray-50 p-6">
        <h1 className="mb-8 text-2xl font-bold">
          {question.question}
        </h1>

        <div className="grid gap-4">
          {question.options.map((option) => {
            const isCorrect =
              selectedAnswer &&
              option === question.answer;

            const isWrong =
              selectedAnswer === option &&
              option !== question.answer;

            return (
              <button
                key={option}
                onClick={() => onAnswerSelect(option)}
                disabled={selectedAnswer}
                className={`rounded-2xl border-2 p-4 text-left font-medium transition-all
                  
                  ${
                    !selectedAnswer
                      ? "border-gray-300 hover:bg-gray-100"
                      : ""
                  }

                  ${
                    isCorrect
                      ? "border-green-500 bg-green-500 text-white"
                      : ""
                  }

                  ${
                    isWrong
                      ? "border-red-500 bg-red-500 text-white"
                      : ""
                  }
                `}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="mt-6 rounded-2xl border border-blue-300 bg-blue-50 p-4">
            <p className="font-semibold text-blue-700">
              Correct Answer: {question.answer}
            </p>
          </div>
        )}

        {(selectedAnswer || timeLeft === 0) && (
          <button
            onClick={onNext}
            className="mt-6 w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;