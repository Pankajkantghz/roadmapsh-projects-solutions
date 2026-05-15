import {
  playGame,
} from "./src/services/gameService.js";

import {
  askQuestion,
  closeReadline,
} from "./src/utils/readline.js";

async function startGame() {
  let playAgain = true;

  while (playAgain) {
    await playGame();

    const answer =
      await askQuestion(
        "\nPlay again? (yes/no): "
      );

    playAgain =
      answer.toLowerCase() ===
      "yes";
  }

  console.log(
    "\nThanks for playing!"
  );

  closeReadline();
}

startGame();