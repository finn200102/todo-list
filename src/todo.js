import overlayHtml from "./templates/add-task-form.html";
const todo = (title, description, dueDate, priority, notes, checklist) => {
  return {
    id: Date.now(),
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist,
  };
};

export const TodoManager = (function () {
  const todos = [todo("hi", ".", ".", ".", ".", ".")];
  const addTodo = (todo) => {
    todos.push(todo);
  };
  const listTodos = () => {
    return todos;
  };
  const getTodoByIdx = (idx) => {
    return todos[idx];
  };
  const countTodos = () => {
    return todos.length;
  };
  return { addTodo, listTodos, countTodos, getTodoByIdx };
})();

const clearContent = () => {
  const content = document.getElementById("content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
};

export const tasksPage = (function () {
  const renderTaskPage = () => {
    clearContent();
    const content = document.getElementById("content");
    const taskHolder = document.createElement("div");
    for (let i = 0; i < TodoManager.countTodos(); i++) {
      const task = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = TodoManager.getTodoByIdx(i).title;
      task.appendChild(title);
      taskHolder.appendChild(task);
    }
    content.appendChild(taskHolder);
  };
  return { renderTaskPage };
})();

export const addTaskOverlay = (function () {
  const render = async () => {
    console.log("render");
    const addTaskHolder = document.createElement("div");
    addTaskHolder.setAttribute("id", "add-task-overlay");
    addTaskHolder.innerHTML = overlayHtml;
    document.body.append(addTaskHolder);
    document.body.style.backgroundColor = "grey";
    setupFormHandler();
  };
  const setupFormHandler = () => {
    const form = document.getElementById("add-task-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const taskName = document.getElementById("task-name").value;
      TodoManager.addTodo(todo(taskName, ".", ".", ".", ".", "."));
      form.reset();
      document.body.removeChild(document.getElementById("add-task-overlay"));
      document.body.style.backgroundColor = "white";
    });
  };
  return { render };
})();
