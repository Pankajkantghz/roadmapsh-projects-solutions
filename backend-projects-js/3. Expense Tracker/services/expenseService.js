import {
  readExpenses,
  writeExpenses,
} from '../storage/fileStorage.js';

export const addExpense = (
  description,
  amount
) => {

  if (!description) {
    console.log(
      'Description required'
    );
    return;
  }

  if (
    isNaN(amount) ||
    amount <= 0
  ) {
    console.log(
      'Invalid amount'
    );
    return;
  }

  const expenses =
    readExpenses();

  const newExpense = {
    id: expenses.length + 1,
    description,
    amount,
    createdAt:
      new Date().toISOString(),
  };

  expenses.push(newExpense);

  writeExpenses(expenses);

  console.log(
    `Expense added successfully (ID: ${newExpense.id})`
  );
};

export const listExpenses =
() => {

  const expenses =
    readExpenses();

  if (expenses.length === 0) {
    console.log(
      'No expenses found'
    );
    return;
  }

  console.log(
    'ID  Date  Description Amount'
  );

  expenses.forEach(
    (expense) => {

      console.log(
        `${expense.id} ${expense.createdAt} ${expense.description} $${expense.amount}`
      );

    }
  );
};

export const deleteExpense =
(id) => {

  const expenses =
    readExpenses();

  const filteredExpenses =
    expenses.filter(
      (expense) =>
        expense.id !== id
    );

  if (
    filteredExpenses.length ===
    expenses.length
  ) {

    console.log(
      'Expense not found'
    );

    return;
  }

  writeExpenses(
    filteredExpenses
  );

  console.log(
    'Expense deleted successfully'
  );
};

export const summaryExpenses =
() => {

  const expenses =
    readExpenses();

  const total =
    expenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    );

  console.log(
    `Total expenses: $${total}`
  );
};

export const monthlySummary =
(month) => {

  const expenses =
    readExpenses();

  const filteredExpenses =
    expenses.filter(
      (expense) => {

        const expenseMonth =
          new Date(
            expense.createdAt
          ).getMonth() + 1;

        return (
          expenseMonth ===
          month
        );

      }
    );

  const total =
    filteredExpenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    );

  console.log(
    `Total expenses for month ${month}: $${total}`
  );
};