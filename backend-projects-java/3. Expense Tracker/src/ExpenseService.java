import java.util.*;
import java.time.LocalDate;

public class ExpenseService {

    public static void addExpense(
            String description,
            double amount) {

        if (description == null
                ||
                description.isEmpty()) {

            System.out.println(
                    "Description required");

            return;
        }

        if (amount <= 0) {

            System.out.println(
                    "Invalid amount");

            return;
        }

        List<Expense> expenses = FileStorage
                .readExpenses();

        int id = expenses.size() + 1;

        String createdAt = LocalDate.now()
                .toString();

        Expense newExpense = new Expense(
                id,
                description,
                amount,
                createdAt);

        expenses.add(
                newExpense);

        FileStorage
                .writeExpenses(
                        expenses);

        System.out.println(

                "Expense added successfully (ID: "
                        + id
                        + ")"

        );

    }

    public static void listExpenses() {

        List<Expense> expenses = FileStorage
                .readExpenses();

        if (expenses.isEmpty()) {

            System.out.println(
                    "No expenses found");

            return;
        }

        System.out.println(
                "ID  Date  Description  Amount");

        for (Expense expense : expenses) {

            System.out.println(

                    expense.getId()
                            + " "

                            + expense
                                    .getCreatedAt()

                            + " "

                            + expense
                                    .getDescription()

                            + " "

                            + expense
                                    .getAmount());
        }
    }

    public static void deleteExpense(
            int id) {

        List<Expense> expenses = FileStorage
                .readExpenses();

        boolean found = false;

        Iterator<Expense> iterator = expenses
                .iterator();

        while (iterator
                .hasNext()) {

            Expense expense = iterator.next();

            if (expense.getId() == id) {

                iterator.remove();

                found = true;

                break;
            }
        }

        if (!found) {

            System.out.println(
                    "Expense not found");

            return;
        }

        FileStorage
                .writeExpenses(
                        expenses);

        System.out.println(
                "Expense deleted successfully");
    }

    public static void summaryExpenses() {

        List<Expense> expenses = FileStorage
                .readExpenses();

        double total = 0;

        for (Expense expense : expenses) {

            total += expense
                    .getAmount();
        }

        System.out.println(

                "Total expenses: $"
                        + total

        );
    }

    public static void monthlySummary(
            int month) {

        List<Expense> expenses = FileStorage
                .readExpenses();

        double total = 0;

        for (Expense expense : expenses) {

            String createdAt = expense
                    .getCreatedAt();

            String[] dateParts = createdAt
                    .split("-");

            int expenseMonth = Integer
                    .parseInt(
                            dateParts[1]);

            if (expenseMonth == month) {

                total += expense
                        .getAmount();
            }
        }

        System.out.println(

                "Total expenses for month "
                        + month
                        + ": $"
                        + total

        );
    }
}