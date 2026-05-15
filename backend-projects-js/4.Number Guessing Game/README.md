# Number Guessing Game (Node.js CLI)

A simple CLI-based Number Guessing Game built with **Node.js** using **ES Modules** and a modular folder structure.

## Features

* Random number generation (1–100)
* Difficulty levels:

  * Easy (10 chances)
  * Medium (5 chances)
  * Hard (3 chances)
* Hint system (greater/less)
* Input validation
* Timer to track guessing time
* Play multiple rounds
* Modular architecture

## Project Structure

```text
number-guessing-game/
│── package.json
│── index.js
│
└── src/
    ├── config/
    │   └── difficulty.js
    │
    ├── game/
    │   ├── playGame.js
    │   ├── hint.js
    │   └── score.js
    │
    ├── utils/
    │   ├── readline.js
    │   ├── timer.js
    │   └── random.js
    │
    └── constants/
        └── messages.js
```

## Requirements

* Node.js (v18 or higher recommended)

Check your version:

```bash
node -v
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd number-guessing-game
```

Install dependencies (if any):

```bash
npm install
```

## Enable ES Modules

Make sure your `package.json` contains:

```json
{
  "type": "module"
}
```

## Run the Game

Start the game:

```bash
node index.js
```

## How to Play

1. Select a difficulty level.
2. Guess the number between **1 and 100**.
3. Receive hints:

   * "greater than"
   * "less than"
4. Keep guessing until:

   * You guess correctly
   * You run out of chances
5. Choose whether to play again.

## Example Gameplay

```text
Welcome to Number Guessing Game!

Select Difficulty:
1. Easy (10 chances)
2. Medium (5 chances)
3. Hard (3 chances)

Enter your choice: 2

Guess the number (5 chances left): 50
Incorrect! The number is less than 50.

Guess the number (4 chances left): 25
Incorrect! The number is greater than 25.

Guess the number (3 chances left): 30
🎉 Correct! Attempts: 3
⏱ Time: 8.21 sec
```

## Learning Goals

This project helps practice:

* Node.js CLI development
* ES Modules (`import/export`)
* Async programming (`async/await`)
* Promises
* Modular project structure
* Input validation
* Loops and conditionals
* Random number generation
* Clean code organization

## Future Improvements

* High score tracking
* Save scores to file
* Difficulty statistics
* Smarter hint system
* Colorful CLI using packages like `chalk`
* Unit testing

## License

This project is open-source and free to use.
