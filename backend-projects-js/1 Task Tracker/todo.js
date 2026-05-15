import inquirer from "inquirer";
import fs from "fs";;

const todoFile = "./todo.json";

if(!fs.existsSync(todoFile)) {
    fs.writeFileSync(todoFile, JSON.stringify([]));
}

let todos = JSON.parse(fs.readFileSync(todoFile, "utf8"));


const saveTodos = () => {
    fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
}
const mainMenu = async() => {
    let shouldExit = false;
    
    while (!shouldExit) {
        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "What do you want to do?",
                choices: ["add", "view", "delete", "update", "mark as completed", "exit"]
            }
        ]);

        switch(answers.action) {
            case "add":
                await addTodo();
                break; 
            case "view":
                await viewTodos();
                break;
            case "delete":
                await deleteTodo();
                break;
            case "update":
                await updateTodo();
                break;
            case "mark as completed":
                await markAsCompleted();
                break;
            case "exit":
                console.log("Goodbye!");
                shouldExit = true;
                break;
            default:
                console.log("Invalid action");
                break;
        }
    }
    process.exit(0);
};


const addTodo = async() => {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "todo",
            message: "What do you want to add?"
        }
    ])

    todos.push({task: answers.todo, completed: false});
    saveTodos();
    console.log("Todo added!");

}

const listTodos = () => {
    console.log("Your Todos:");
    todos.forEach((todo, index) =>{
        const status = todo.completed ? "[✓]" : "[x]";
        console.log(`${index + 1}. ${status} ${todo.task}`);
    });
};

const deleteTodo = async() => {
    console.log("Select a todo to delete:");
    listTodos();
    
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "index",
            message: "Enter the number of the todo to delete:"
        }
    ]);

    const index = parseInt(answers.index) - 1;
    if(index >= 0 && index <todos.length) {
        todos.splice(index,1);
        saveTodos();
        console.log("Todo deleted!");
    }else{
        console.log("Invalid index!");
    }
}

const markAsCompleted = async() => {
    console.log("Select a todo to mark as completed:");
    listTodos();
    
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "index",
            message: "Enter the number of the todo to mark as completed:"
        }
    ]);
    const index = parseInt(answers.index) - 1;
    if(index >= 0 && index < todos.length) {
        todos[index].completed = true;
        saveTodos();
        console.log("Todo marked as completed!");
    }else{
        console.log("Invalid index!");
    }
}

const updateTodo = async() => {
    console.log("Select a todo to update:");
    listTodos();

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "index",
            message: "Enter the number of the todo to update:"
        },
        {
            type: "input",
            name: "newTask",
            message: "Enter the new task:",
            choices: todos.map((todo, index) => ({
        name: `${index + 1}. ${todo.task}`,
        value: index
    }))
        }
    ]);

    const index = parseInt(answers.index) - 1;
    if(index >= 0 && index < todos.length) {
        todos[index].task = answers.newTask;
        saveTodos();
        console.log("Todo updated!");
    }else{
        console.log("Invalid index!");
    }
}
const viewTodos = async () => {
    listTodos();
    
    
    await new Promise(resolve => {
        console.log("\nPress Enter to continue...");
        process.stdin.once('data', resolve);  
    });
};
mainMenu();