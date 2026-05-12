const Timer = ({ timeLeft }) => {
  return (
    <div
      className={`rounded-xl px-4 py-2 font-bold text-white ${
        timeLeft <= 10 ? "bg-red-500" : "bg-black"
      }`}
    >
      ⏳ {timeLeft}s
    </div>
  );
};

export default Timer;