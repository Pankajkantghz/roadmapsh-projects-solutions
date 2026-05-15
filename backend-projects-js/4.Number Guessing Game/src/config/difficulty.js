export const DIFFICULTY = {
  EASY: {
    name: "Easy",
    chances: 10,
  },

  MEDIUM: {
    name: "Medium",
    chances: 5,
  },

  HARD: {
    name: "Hard",
    chances: 3,
  },
};

export function getDifficulty(choice) {
  switch (choice) {
    case "1":
      return DIFFICULTY.EASY;

    case "2":
      return DIFFICULTY.MEDIUM;

    case "3":
      return DIFFICULTY.HARD;

    default:
      return null;
  }
}