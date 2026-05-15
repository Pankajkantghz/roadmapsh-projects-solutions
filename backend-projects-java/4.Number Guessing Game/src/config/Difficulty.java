package config;

public class Difficulty {

    private String name;
    private int chances;

    public Difficulty(
            String name,
            int chances
    ) {
        this.name = name;
        this.chances = chances;
    }

    public String getName() {
        return name;
    }

    public int getChances() {
        return chances;
    }

    public static Difficulty
    getDifficulty(int choice) {

        switch (choice) {

            case 1:
                return new Difficulty(
                        "Easy",
                        10
                );

            case 2:
                return new Difficulty(
                        "Medium",
                        5
                );

            case 3:
                return new Difficulty(
                        "Hard",
                        3
                );

            default:
                return null;
        }
    }
}