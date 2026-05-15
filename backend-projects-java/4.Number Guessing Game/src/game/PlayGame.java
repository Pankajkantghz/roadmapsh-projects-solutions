package game;

import java.util.Random;
import java.util.Scanner;

import config.Difficulty;
import constants.Messages;
import utils.Timer;

public class PlayGame {

    private static final
    Scanner scanner =
            new Scanner(System.in);

    public static void
    playGame() {

        System.out.println(
                "\n======================"
        );

        System.out.println(
                Messages.WELCOME
        );

        System.out.println(
                "======================"
        );

        Difficulty difficulty =
                chooseDifficulty();

        Random random =
                new Random();

        int secretNumber =
                random.nextInt(100)
                        + 1;

        int remainingChances =
                difficulty
                        .getChances();

        int attempts = 0;

        long startTime =
                Timer.startTimer();

        while (
                remainingChances > 0
        ) {

            System.out.print(
                    "\nGuess the number ("
                            + remainingChances
                            + " chances left): "
            );

            if (
                    !scanner.hasNextInt()
            ) {

                System.out.println(
                        Messages.INVALID_INPUT
                );

                scanner.next();

                continue;
            }

            int guess =
                    scanner.nextInt();

            attempts++;

            if (
                    guess
                            == secretNumber
            ) {

                double timeTaken =
                        Timer
                                .getElapsedTime(
                                        startTime
                                );

                System.out.println(
                        "\n🎉 Correct! Attempts: "
                                + attempts
                );

                System.out.printf(
                        "⏱ Time: %.2f sec%n",
                        timeTaken
                );

                return;
            }

            Hint.provideHint(
                    guess,
                    secretNumber
            );

            remainingChances--;
        }

        System.out.println(
                "\n"
                        + Messages.GAME_OVER
        );

        System.out.println(
                "Correct number was "
                        + secretNumber
        );
    }

    private static
    Difficulty
    chooseDifficulty() {

        System.out.println(
                "\nSelect Difficulty:"
        );

        System.out.println(
                "1. Easy (10 chances)"
        );

        System.out.println(
                "2. Medium (5 chances)"
        );

        System.out.println(
                "3. Hard (3 chances)"
        );

        while (true) {

            System.out.print(
                    "\nEnter your choice: "
            );

            if (
                    !scanner.hasNextInt()
            ) {

                System.out.println(
                        "Invalid input!"
                );

                scanner.next();

                continue;
            }

            int choice =
                    scanner.nextInt();

            Difficulty difficulty =
                    Difficulty
                            .getDifficulty(
                                    choice
                            );

            if (
                    difficulty != null
            ) {

                System.out.println(
                        "\nYou selected "
                                + difficulty
                                .getName()
                                + " mode."
                );

                return difficulty;
            }

            System.out.println(
                    "Invalid choice."
            );
        }
    }
}