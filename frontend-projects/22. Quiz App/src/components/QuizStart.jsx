const QuizStart = ({ onStart, totalQuestions }) => {
  return (
    <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
      <h1 className="mb-4 text-center text-4xl font-bold">
        Quiz App
      </h1>

      <p className="mb-8 text-center text-gray-600">
        Test your frontend knowledge with timed questions.
      </p>

      <div className="mb-8 rounded-2xl bg-gray-100 p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Quiz Details
        </h2>

        <ul className="space-y-2 text-gray-700">
          <li>{totalQuestions} Questions</li>
          <li>60 Seconds Per Question</li>
          <li>Instant Feedback</li>
          <li>Final Score Summary</li>
        </ul>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default QuizStart;
