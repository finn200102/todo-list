import overlayHtml from "./templates/add-task-form.html";
import { format, isEqual, isBefore, addWeeks, compareAsc } from "date-fns";
const todo = (title, description, dueDate, priority, notes) => {
  return {
    id: Date.now(),
    title,
    description,
    dueDate,
    priority,
    notes,
    checkbox: false,
  };
};

export const TodoManager = (function () {
  const todos = [];
  const projects = ["standart"];
  const listProjects = () => {
    return projects;
  };
  const addTodo = (todo) => {
    todos.push(todo);
  };
  const listTodos = () => {
    return todos.sort((a, b) => compareAsc(a.dueDate, b.dueDate));
  };
  const getTodoByIdx = (idx) => {
    return todos[idx];
  };
  const countTodos = () => {
    return todos.length;
  };
  const dueToday = () => {
    const results = todos
      .filter((todo) =>
        isEqual(
          format(new Date(todo.dueDate), "dd/MM/yyyy"),
          format(new Date(), "dd/MM/yyyy")
        )
      )
      .sort((a, b) => compareAsc(a.dueDate, b.dueDate));
    return results;
  };
  const upcommingNextWeek = () => {
    const results = todos
      .filter((todo) =>
        isBefore(new Date(todo.dueDate), addWeeks(new Date(), 1))
      )
      .sort((a, b) => compareAsc(a.dueDate, b.dueDate));

    return results;
  };
  return {
    addTodo,
    listTodos,
    countTodos,
    getTodoByIdx,
    dueToday,
    upcommingNextWeek,
    listProjects,
  };
})();

const populateDatalist = (function () {
  const populate = (projects) => {
    const datalist = document.getElementById("projects");
    datalist.innerHTML = "";
    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project;
      datalist.appendChild(option);
    });
  };
  return { populate };
})();

const clearContent = () => {
  const content = document.getElementById("content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
};

const renderTasks = (function () {
  const renderTaskpage = (tasks) => {
    clearContent();
    const content = document.getElementById("content");
    const taskHolder = document.createElement("div");
    for (let i = 0; i < tasks.length; i++) {
      const task = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = tasks[i].title;
      const description = document.createElement("p");
      description.textContent = tasks[i].description;
      const dueDate = document.createElement("h4");
      dueDate.textContent = tasks[i].dueDate;
      task.appendChild(title);
      task.appendChild(description);
      task.appendChild(dueDate);
      taskHolder.appendChild(task);
    }
    content.appendChild(taskHolder);
  };
  return { renderTaskpage };
})();

export const tasksPage = (function () {
  const renderTaskPage = () => {
    renderTasks.renderTaskpage(TodoManager.listTodos());
  };
  const renderDueTodayPage = () => {
    renderTasks.renderTaskpage(TodoManager.dueToday());
  };
  const renderUpcommingNextWeek = () => {
    renderTasks.renderTaskpage(TodoManager.upcommingNextWeek());
  };
  return { renderTaskPage, renderDueTodayPage, renderUpcommingNextWeek };
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
    populateDatalist.populate(TodoManager.listProjects());
  };
  const setupFormHandler = () => {
    const form = document.getElementById("add-task-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const taskName = document.getElementById("task-name").value;
      const taskDescription = document.getElementById("task-description").value;
      const taskDueDate = document.getElementById("task-due-date").value;
      const taskPriority = document.getElementById("task-priority").value;
      const taskNotes = document.getElementById("task-notes").value;

      // console.log(format(new Date(taskDueDate), "MM/dd/yyyy"));
      TodoManager.addTodo(
        todo(taskName, taskDescription, taskDueDate, taskPriority, taskNotes)
      );
      form.reset();
      document.body.removeChild(document.getElementById("add-task-overlay"));
      document.body.style.backgroundColor = "white";
    });
  };
  return { render };
})();
