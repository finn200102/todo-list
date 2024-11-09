import { se } from "date-fns/locale";
import overlayHtml from "./templates/add-task-form.html";
import searchOverlayHtml from "./templates/search-form.html";
import { format, isEqual, isBefore, addWeeks, compareAsc } from "date-fns";
const todo = (title, description, dueDate, project, priority, notes) => {
  return {
    id: Date.now(),
    title,
    description,
    dueDate,
    project,
    priority,
    notes,
    checkbox: false,
  };
};

export const TodoManager = (function () {
  // writes, saves, loads all the todos and projects
  let todos = [];
  let projects = ["standart"];
  if (!localStorage.getItem("todos")) {
    localStorage.setItem("todos", JSON.stringify(todos));
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  if (!localStorage.getItem("projects")) {
    localStorage.setItem("projects", JSON.stringify(projects));
  } else {
    projects = JSON.parse(localStorage.getItem("projects"));
  }
  const listProjects = () => {
    return projects;
  };
  const addProject = (project) => {
    if (!projects.includes(project)) {
      projects.push(project);
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  };
  const addTodo = (todo) => {
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    if (!projects.includes(todo.project)) {
      addProject(todo.project);
    }
  };
  const removeTodo = (id) => {
    let newArray = todos.filter((item) => item.id !== +id);
    todos = newArray;
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const listTodos = () => {
    if (!todos || todos.length === 0) {
      return [];
    }
    try {
      return todos.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return compareAsc(a.dueDate, b.dueDate);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const listTodosBySearch = (searchTerm) => {
    return todos.filter((todo) => {
      if (todo.title.includes(searchTerm)) {
        return true;
      }
    });
  };
  const listTodosByProject = (project) => {
    // returns an array of todos with the specified project
    if (projects.includes(project)) {
      return todos.filter((todo) => {
        if (todo.project === project) {
          return true;
        }
      });
    } else {
      return null;
    }
  };
  const getTodoByIdx = (idx) => {
    return todos[idx];
  };
  const countTodos = () => {
    return todos.length;
  };
  const dueToday = () => {
    const results = todos
      .filter((todo) => {
        if (!todo.dueDate) return false;
        try {
          return isEqual(
            format(new Date(todo.dueDate), "dd/MM/yyyy"),
            format(new Date(), "dd/MM/yyyy")
          );
        } catch (error) {
          return false;
        }
      })
      .sort((a, b) => {
        compareAsc(a.dueDate, b.dueDate);
      });
    return results;
  };
  const upcommingNextWeek = () => {
    const results = todos
      .filter((todo) => {
        if (!todo.dueDate) return false;
        try {
          return isBefore(new Date(todo.dueDate), addWeeks(new Date(), 1));
        } catch (error) {
          return false;
        }
      })
      .sort((a, b) => compareAsc(a.dueDate, b.dueDate));

    return results;
  };
  return {
    addTodo,
    removeTodo,
    listTodos,
    countTodos,
    getTodoByIdx,
    dueToday,
    upcommingNextWeek,
    listProjects,
    listTodosByProject,
    listTodosBySearch,
  };
})();

export const projectButtons = (function () {
  const createButtons = () => {
    let projects = TodoManager.listProjects();
    const projectsContainer = document.getElementById("projects-container");
    while (projectsContainer.firstChild) {
      projectsContainer.removeChild(projectsContainer.firstChild);
    }
    for (let i = 0; i < projects.length; i++) {
      const button = document.createElement("button");
      button.textContent = projects[i];
      button.classList.add("sidebar-button");
      button.classList.add("project-button");
      projectsContainer.appendChild(button);
      button.addEventListener("click", () => {
        tasksPage.renderProjectPage(projects[i]);
      });
    }
  };
  return {
    createButtons,
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
  const renderTaskpage = (tasks, title) => {
    clearContent();
    const content = document.getElementById("content");
    const contentTitle = document.createElement("h2");
    contentTitle.textContent = title;
    content.appendChild(contentTitle);

    const template = document.getElementById("todo-item-template");

    const taskHolder = document.createElement("div");
    for (let i = 0; i < tasks.length; i++) {
      const element = template.content.cloneNode(true).children[0];
      element.setAttribute("task-id", tasks[i].id);
      const todoTitle = element.querySelector("#todo-item-title");

      todoTitle.textContent = tasks[i].title;
      const todoDueDate = element.querySelector("#todo-item-dueDate");

      todoDueDate.textContent = format(
        new Date(tasks[i].dueDate),
        "dd/MM/yyyy"
      );
      const todoDeleteButton = element.querySelector("#todo-delete-button");
      todoDeleteButton.addEventListener("click", () => {
        const id = element.getAttribute("task-id");
        TodoManager.removeTodo(id);
        content.children[1].removeChild(element);
      });
      const todoDescription = element.querySelector("#todo-item-description");
      todoDescription.textContent = tasks[i].description;
      taskHolder.appendChild(element);
    }

    content.appendChild(taskHolder);
  };
  return { renderTaskpage };
})();

export const tasksPage = (function () {
  const renderTaskPage = () => {
    renderTasks.renderTaskpage(TodoManager.listTodos(), "Todos");
  };
  const renderDueTodayPage = () => {
    renderTasks.renderTaskpage(TodoManager.dueToday(), "Due Today");
  };
  const renderProjectPage = (project) => {
    renderTasks.renderTaskpage(
      TodoManager.listTodosByProject(project),
      project
    );
  };
  const renderSearchPage = (searchTerm) => {
    renderTasks.renderTaskpage(
      TodoManager.listTodosBySearch(searchTerm),
      "Search Results:"
    );
  };
  const renderUpcommingNextWeek = () => {
    renderTasks.renderTaskpage(
      TodoManager.upcommingNextWeek(),
      "Due next Week"
    );
  };
  return {
    renderTaskPage,
    renderDueTodayPage,
    renderUpcommingNextWeek,
    renderProjectPage,
    renderSearchPage,
  };
})();

export const addTaskOverlay = (function () {
  const render = async () => {
    const addTaskHolder = document.createElement("div");
    addTaskHolder.setAttribute("id", "add-task-overlay");
    // add html template for add task form
    addTaskHolder.innerHTML = overlayHtml;
    document.body.append(addTaskHolder);
    document.body.style.backgroundColor = "grey";
    setupFormHandler();
    const form = document.getElementById("add-task-overlay");
    document.addEventListener("mousedown", (event) => {
      if (document.getElementById("add-task-overlay")) {
        const currentForm = document.getElementById("add-task-overlay");
        if (
          form &&
          !form.contains(event.target) &&
          event.target.closest("#add-task-overlay") === null
        ) {
          try {
            currentForm.parentElement.removeChild(form);
          } catch (error) {
            console.log("Error removing overlay:", error);
          }
        }
      }
    });

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
      const taskProject = document.getElementById("projects-input").value;

      // console.log(format(new Date(taskDueDate), "MM/dd/yyyy"));
      TodoManager.addTodo(
        todo(
          taskName,
          taskDescription,
          taskDueDate,
          taskProject,
          taskPriority,
          taskNotes
        )
      );
      form.reset();
      document.body.removeChild(document.getElementById("add-task-overlay"));
      document.body.style.backgroundColor = "white";
    });
  };
  return { render };
})();

export const searchOverlay = (function () {
  const render = async () => {
    const searchHolder = document.createElement("div");
    searchHolder.setAttribute("id", "search-overlay");
    // add html template for search form
    searchHolder.innerHTML = searchOverlayHtml;
    document.body.append(searchHolder);
    document.body.style.backgroundColor = "grey";
    setupFormHandler();
    const form = document.getElementById("search-overlay");
    document.addEventListener("mousedown", (event) => {
      if (document.getElementById("search-overlay")) {
        const currentForm = document.getElementById("search-overlay");
        if (
          form &&
          !form.contains(event.target) &&
          event.target.closest("#search-overlay") === null
        ) {
          try {
            currentForm.parentElement.removeChild(form);
          } catch (error) {
            console.log("Error removing overlay:", error);
          }
        }
      }
    });
  };

  const setupFormHandler = () => {
    const form = document.getElementById("search-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const taskName = document.getElementById("search-name").value;
      tasksPage.renderSearchPage(taskName);
      form.reset();
      document.body.removeChild(document.getElementById("search-overlay"));
      document.body.style.backgroundColor = "white";
    });
  };
  return { render };
})();
