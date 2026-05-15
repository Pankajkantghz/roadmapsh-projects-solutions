export function startTimer() {
  return Date.now();
}

export function getElapsedTime(startTime) {
  return (
    (Date.now() - startTime) / 1000
  ).toFixed(2);
}