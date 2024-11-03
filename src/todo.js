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
  const todos = [];
  const addTodo = (todo) => {
    todos.push(todo);
  };
  return { addTodo };
})();
