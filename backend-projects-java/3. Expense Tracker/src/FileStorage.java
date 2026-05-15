import java.io.*;
import java.util.*;

public class FileStorage {

    private static final String FILE_PATH =
        "../data/expenses.txt";

    public static List<Expense>
    readExpenses() {

        List<Expense> expenses =
            new ArrayList<>();

        try {

            File file =
                new File(FILE_PATH);

            if (!file.exists()) {
                return expenses;
            }

            Scanner scanner =
                new Scanner(file);

            while (
                scanner.hasNextLine()
            ) {

                String line =
                    scanner.nextLine();

                String[] data =
                    line.split(",");

                int id =
                    Integer.parseInt(
                        data[0]
                    );

                String description =
                    data[1];

                double amount =
                    Double.parseDouble(
                        data[2]
                    );

                String createdAt =
                    data[3];

                Expense expense =
                    new Expense(
                        id,
                        description,
                        amount,
                        createdAt
                    );

                expenses.add(
                    expense
                );
            }

            scanner.close();

        } catch (
            Exception e
        ) {

            System.out.println(
                "Error reading file"
            );

        }

        return expenses;
    }

    public static void
    writeExpenses(
        List<Expense> expenses
    ) {

        try {

            FileWriter writer =
                new FileWriter(
                    FILE_PATH
                );

            for (
                Expense expense
                : expenses
            ) {

                writer.write(

                    expense.getId()
                    + ","

                    + expense
                    .getDescription()

                    + ","

                    + expense
                    .getAmount()

                    + ","

                    + expense
                    .getCreatedAt()

                    + "\n"
                );
            }

            writer.close();

        } catch (
            Exception e
        ) {

            System.out.println(
                "Error writing file"
            );

        }
    }
}