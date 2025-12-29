document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".input-container input");
  const addBtn = document.querySelector(".add-btn");
  const ul = document.querySelector(".task-container ul");

  // Get tasks
  const getTasks = () =>
    JSON.parse(localStorage.getItem("tasks")) || [];

  // Save tasks
  const saveTasks = (tasks) =>
    localStorage.setItem("tasks", JSON.stringify(tasks));

  // Render
  const render = () => {
    ul.innerHTML = "";
    getTasks().forEach((t, i) => {
      ul.innerHTML += `
        <li>
          <div class="list-content ${t.completed ? "completed" : ""}">
            <input type="checkbox" ${t.completed ? "checked" : ""}>
            <span class="task-text">${t.text}</span>
          </div>
          <button data-i="${i}">-</button>
        </li>`;
    });
  };

  render();

  // Add
  addBtn.addEventListener("click", () => {
    if (!input.value.trim()) return;
    saveTasks([...getTasks(), { text: input.value, completed: false }]);
    input.value = "";
    render();
  });

  // Delete & Toggle
  ul.addEventListener("click", (e) => {
    const tasks = getTasks();

    if (e.target.tagName === "BUTTON") {
      tasks.splice(e.target.dataset.i, 1);
    }

    if (e.target.type === "checkbox") {
      const i = [...ul.children].indexOf(e.target.closest("li"));
      tasks[i].completed = e.target.checked;
    }

    saveTasks(tasks);
    render();
  });
});
