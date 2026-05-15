public class Main {

    public static void main(
            String[] args) {

        if (args.length == 0) {

            System.out.println(
                    "No command provided");

            return;
        }

        String command = args[0];

        if (

        command.equals(
                "add")

        ) {

            String description = null;

            double amount = 0;

            for (int i = 1; i < args.length; i++) {

                if (args[i].equals(
                        "--description")) {

                    if (i + 1 < args.length) {

                        description = args[i + 1];

                    }
                }

                if (args[i].equals(
                        "--amount")) {

                    if (i + 1 < args.length) {

                        amount = Double
                                .parseDouble(
                                        args[i + 1]);

                    }
                }
            }

            ExpenseService
                    .addExpense(
                            description,
                            amount);

        }

        else if (

        command.equals(
                "list")

        ) {

            ExpenseService
                    .listExpenses();

        }

        else if (

        command.equals(
                "delete")

        ) {

            int id = 0;

            for (int i = 1; i < args.length; i++) {

                if (args[i].equals(
                        "--id")) {

                    if (i + 1 < args.length) {

                        id = Integer
                                .parseInt(
                                        args[i + 1]);

                    }
                }
            }

            ExpenseService
                    .deleteExpense(
                            id);
        } else if (

        command.equals(
                "summary")

        ) {

            int month = 0;

            for (int i = 1; i < args.length; i++) {

                if (args[i].equals(
                        "--month")) {

                    if (i + 1 < args.length) {

                        month = Integer
                                .parseInt(
                                        args[i + 1]);

                    }
                }
            }

            if (month > 0) {

                ExpenseService
                        .monthlySummary(
                                month);

            } else {

                ExpenseService
                        .summaryExpenses();

            }
        }

        else {

            System.out.println(
                    "Invalid command");

        }
    }
}