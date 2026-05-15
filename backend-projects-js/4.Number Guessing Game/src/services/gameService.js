import { askQuestion } from "../utils/readline.js";
import {
  startTimer,
  getElapsedTime,
} from "../utils/timer.js";
import {
  DIFFICULTY,
  getDifficulty,
} from "../config/difficulty.js";
import { provideHint } from "./hintService.js";
import { MESSAGE } from "../constants/messages.js";

async function chooseDifficulty() {
  console.log("\nSelect Difficulty:");
  console.log("1. Easy (10 chances)");
  console.log("2. Medium (5 chances)");
  console.log("3. Hard (3 chances)");

  while (true) {
    const choice =
      await askQuestion(
        "\nEnter your choice: "
      );

    const difficulty =
      getDifficulty(choice);

    if (difficulty) {
      console.log(
        `\nYou selected ${difficulty.name} mode.`
      );

      return difficulty;
    }

    console.log("Invalid choice.");
  }
}

export async function playGame() {
  console.log("\n======================");
  console.log(MESSAGE.WELCOME);
  console.log("======================");

  const difficulty =
    await chooseDifficulty();

  const secretNumber =
    Math.floor(Math.random() * 100) + 1;

  let remainingChances =
    difficulty.chances;

  let attempts = 0;

  const startTime = startTimer();

  while (remainingChances > 0) {
    const input =
      await askQuestion(
        `\nGuess the number (${remainingChances} chances left): `
      );

    const guess = Number(input);

    if (
      isNaN(guess) ||
      guess < 1 ||
      guess > 100
    ) {
      console.log(
        MESSAGE.INVALID_INPUT
      );
      continue;
    }

    attempts++;

    if (guess === secretNumber) {
      const timeTaken =
        getElapsedTime(startTime);

      console.log(
        `\n🎉 Correct! Attempts: ${attempts}`
      );

      console.log(
        `⏱ Time: ${timeTaken} sec`
      );

      return;
    }

    provideHint(
      guess,
      secretNumber
    );

    remainingChances--;
  }

  console.log(
    `\n${MESSAGE.GAME_OVER}`
  );

  console.log(
    `Correct number was ${secretNumber}`
  );
}