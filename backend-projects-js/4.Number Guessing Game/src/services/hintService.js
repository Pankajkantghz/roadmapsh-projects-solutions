export function provideHint(
  guess,
  secretNumber
) {
  if (guess > secretNumber) {
    console.log(
      `Incorrect! The number is less than ${guess}.`
    );
  } else {
    console.log(
      `Incorrect! The number is greater than ${guess}.`
    );
  }
}