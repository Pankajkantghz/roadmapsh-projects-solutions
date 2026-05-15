package utils;

public class Timer {

    public static long
    startTimer() {

        return System.currentTimeMillis();
    }

    public static double
    getElapsedTime(
            long startTime
    ) {

        return (
                System.currentTimeMillis()
                        - startTime
        ) / 1000.0;
    }
}