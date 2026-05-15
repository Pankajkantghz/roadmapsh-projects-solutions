# Expense Tracker CLI (Java)

A simple command-line expense tracker application built in Java to manage personal finances.

Users can:

- Add expenses
- List all expenses
- Delete expenses
- View total expense summary
- View monthly expense summary

Expense data is stored locally in a text file.

---

## Features

- Add expense with description and amount
- Delete expense using ID
- View all expenses
- View total expenses summary
- View monthly expense summary
- Persistent file storage
- Command-line interface (CLI)
- Input validation

---

## Tech Stack

- Java
- OOP (Object-Oriented Programming)
- File Handling
- CLI Argument Parsing
- Local File Storage

---

## Project Structure

```bash
ExpenseTracker/
│
├── src/
│   ├── Main.java
│   ├── Expense.java
│   ├── ExpenseService.java
│   └── FileStorage.java
│
├── data/
│   └── expenses.txt
│
└── README.md
```

---

## How It Works

The application follows a simple backend architecture:

```text
CLI Commands
      ↓
Main.java
(Command Routing)
      ↓
ExpenseService.java
(Business Logic)
      ↓
FileStorage.java
(Data Persistence)
      ↓
expenses.txt
```

---

## Setup

### 1. Clone Repository

```bash
git clone <your-repository-url>
```

---

### 2. Navigate to Project

```bash
cd ExpenseTracker
```

---

### 3. Go to Source Folder

```bash
cd src
```

---

### 4. Compile Java Files

```bash
javac *.java
```

---

### 5. Run Application

```bash
java Main
```

---

## Commands

### Add Expense

```bash
java Main add --description Lunch --amount 200
```

Example Output:

```bash
Expense added successfully (ID: 1)
```

---

### List Expenses

```bash
java Main list
```

Example Output:

```bash
ID  Date  Description  Amount

1 2026-05-15 Lunch 200.0
2 2026-05-15 Dinner 500.0
```

---

### Delete Expense

```bash
java Main delete --id 2
```

Example Output:

```bash
Expense deleted successfully
```

---

### Total Summary

```bash
java Main summary
```

Example Output:

```bash
Total expenses: $700.0
```

---

### Monthly Summary

```bash
java Main summary --month 5
```

Example Output:

```bash
Total expenses for month 5: $700.0
```

---

## Data Storage

Expenses are stored in:

```text
data/expenses.txt
```

Example:

```text
1,Lunch,200.0,2026-05-15
2,Dinner,500.0,2026-05-15
```

---

## Validation

The application validates:

- Missing description
- Empty description
- Invalid amount
- Negative amount
- Invalid delete ID
- Empty expense list

---

## Example Workflow

```bash
java Main add --description Lunch --amount 200

java Main add --description Dinner --amount 500

java Main list

java Main summary

java Main summary --month 5

java Main delete --id 2

java Main list
```

---

## Concepts Practiced

This project helped practice:

- Java OOP
- Classes and Objects
- File Handling
- CLI Argument Parsing
- CRUD Operations
- Service Layer Architecture
- Separation of Concerns
- Backend Logic Design

---

## Future Improvements

- Update expense feature
- Expense categories
- CSV export
- Better terminal formatting
- Budget tracking
- Search/filter expenses

---

## License

This project is open source and available under the MIT License.