const QuizResult = ({ score, totalQuestions, results }) => {
  return (
    <div className="w-full max-w-4xl rounded-3xl bg-white p-8 shadow-2xl">
      <h1 className="mb-6 text-center text-4xl font-bold">
        Quiz Completed 🎉
      </h1>

      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold">
          Score: {score} / {totalQuestions}
        </h2>
      </div>

      <div className="space-y-5">
        {results.map((result, index) => (
          <div
            key={index}
            className={`rounded-2xl border-2 p-5 ${
              result.isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <h3 className="mb-3 font-bold">
              {index + 1}. {result.question}
            </h3>

            <p className="mb-1">
              <span className="font-semibold">
                Your Answer:
              </span>{" "}
              {result.selected}
            </p>

            <p>
              <span className="font-semibold">
                Correct Answer:
              </span>{" "}
              {result.correct}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResult;