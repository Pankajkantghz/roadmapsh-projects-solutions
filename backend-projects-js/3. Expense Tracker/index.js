import {
  addExpense,
  deleteExpense,
  listExpenses,
  monthlySummary,
  summaryExpenses,
} from './services/expenseService.js';

const args = process.argv;

const command = args[2];

if (command === 'add') {
  const descriptionIndex = args.indexOf('--description');

  const amountIndex = args.indexOf('--amount');

  const description = args[descriptionIndex + 1];

  const amount = Number(args[amountIndex + 1]);

  addExpense(description, amount);
} else if (command === 'delete') {
  const idIndex = args.indexOf('--id');

  const id = Number(args[idIndex + 1]);

  deleteExpense(id);
} else if (command === 'list') {
  listExpenses();
} else if (command === 'summary') {
  const monthIndex = args.indexOf('--month');

  if (monthIndex !== -1) {
    const month = Number(args[monthIndex + 1]);

    monthlySummary(month);
  } else {
    summaryExpenses();
  }
} else {
  console.log('Invalid command');
}
