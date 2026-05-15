package game;

public class Hint {

    public static void
    provideHint(
            int guess,
            int secretNumber
    ) {

        if (guess > secretNumber) {

            System.out.println(
                    "Incorrect! The number is less than "
                            + guess
            );

        } else {

            System.out.println(
                    "Incorrect! The number is greater than "
                            + guess
            );
        }
    }
}