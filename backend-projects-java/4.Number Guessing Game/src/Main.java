import game.PlayGame;

import java.util.Scanner;

public class Main {

    public static void
    main(String[] args) {

        Scanner scanner =
                new Scanner(System.in);

        boolean playAgain =
                true;

        while (playAgain) {

            PlayGame.playGame();

            System.out.print(
                    "\nPlay again? (yes/no): "
            );

            String answer =
                    scanner.next()
                            .toLowerCase();

            playAgain =
                    answer.equals(
                            "yes"
                    );
        }

        System.out.println(
                "\nThanks for playing!"
        );
    }
}