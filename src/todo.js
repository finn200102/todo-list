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
