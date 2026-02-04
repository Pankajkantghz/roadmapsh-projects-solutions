import java.io.*;
import java.util.*;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

class Todo {
    String task;
    boolean completed;

    Todo(String task) {
        this.task = task;
        this.completed = false;
    }
}

public class Main {

    static final String TODO_FILE = "todo.json";
    static List<Todo> todos = new ArrayList<>();
    static Scanner sc = new Scanner(System.in);
    static Gson gson = new GsonBuilder().setPrettyPrinting().create();

    public static void main(String[] args) {
        loadTodos();
        mainMenu();
    }

    // ---------- FILE HANDLING ----------

    static void loadTodos() {
        try {
            File file = new File(TODO_FILE);
            if (!file.exists()) {
                saveTodos();
            }

            Reader reader = new FileReader(TODO_FILE);
            todos = gson.fromJson(reader, new TypeToken<List<Todo>>() {}.getType());
            if (todos == null) todos = new ArrayList<>();
            reader.close();
        } catch (Exception e) {
            System.out.println("Error loading todos");
        }
    }

    static void saveTodos() {
        try (Writer writer = new FileWriter(TODO_FILE)) {
            gson.toJson(todos, writer);
        } catch (Exception e) {
            System.out.println("Error saving todos");
        }
    }

    // ---------- MENU ----------

    static void mainMenu() {
        while (true) {
            System.out.println("\n--- TODO APP ---");
            System.out.println("1. Add");
            System.out.println("2. View");
            System.out.println("3. Delete");
            System.out.println("4. Update");
            System.out.println("5. Mark as completed");
            System.out.println("6. Exit");

            System.out.print("Choose option: ");
            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {
                case 1 -> addTodo();
                case 2 -> viewTodos();
                case 3 -> deleteTodo();
                case 4 -> updateTodo();
                case 5 -> markCompleted();
                case 6 -> {
                    System.out.println("Goodbye!");
                    System.exit(0);
                }
                default -> System.out.println("Invalid choice!");
            }
        }
    }

    // ---------- FEATURES ----------

    static void addTodo() {
        System.out.print("Enter task: ");
        String task = sc.nextLine();
        todos.add(new Todo(task));
        saveTodos();
        System.out.println("Todo added!");
    }

    static void listTodos() {
        if (todos.isEmpty()) {
            System.out.println("No todos found.");
            return;
        }

        System.out.println("\nYour Todos:");
        for (int i = 0; i < todos.size(); i++) {
            Todo t = todos.get(i);
            String status = t.completed ? "[✓]" : "[ ]";
            System.out.println((i + 1) + ". " + status + " " + t.task);
        }
    }

    static void viewTodos() {
        listTodos();
        System.out.println("\nPress Enter to continue...");
        sc.nextLine();
    }

    static void deleteTodo() {
        listTodos();
        System.out.print("Enter number to delete: ");
        int index = sc.nextInt() - 1;
        sc.nextLine();

        if (index >= 0 && index < todos.size()) {
            todos.remove(index);
            saveTodos();
            System.out.println("Todo deleted!");
        } else {
            System.out.println("Invalid index!");
        }
    }

    static void updateTodo() {
        listTodos();
        System.out.print("Enter number to update: ");
        int index = sc.nextInt() - 1;
        sc.nextLine();

        if (index >= 0 && index < todos.size()) {
            System.out.print("Enter new task: ");
            String newTask = sc.nextLine();
            todos.get(index).task = newTask;
            saveTodos();
            System.out.println("Todo updated!");
        } else {
            System.out.println("Invalid index!");
        }
    }

    static void markCompleted() {
        listTodos();
        System.out.print("Enter number to mark completed: ");
        int index = sc.nextInt() - 1;
        sc.nextLine();

        if (index >= 0 && index < todos.size()) {
            todos.get(index).completed = true;
            saveTodos();
            System.out.println("Todo marked completed!");
        } else {
            System.out.println("Invalid index!");
        }
    }
}
