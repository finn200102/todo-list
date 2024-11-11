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
  const removeProject = (project) => {
    projects = projects.filter((p) => {
      if (p == project) {
        return false;
      } else {
        return true;
      }
    });
    localStorage.setItem("projects", JSON.stringify(projects));
  };
  const addProject = (project) => {
    if (!projects.includes(project)) {
      projects.push(project);
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  };
  const toggelCheckbox = (id) => {
    todos[getIdxById(id)].checkbox = !todos[getIdxById(id)].checkbox;

    localStorage.setItem("todos", JSON.stringify(todos));
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

  const replaceTodoById = (id, t) => {
    todos[getIdxById(id)] = todo(t[0], t[1], t[2], t[3], t[4], t[5]);
  };
  const listTodos = () => {
    if (!todos || todos.length === 0) {
      return [];
    }
    try {
      return todos
        .sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return compareAsc(a.dueDate, b.dueDate);
        })
        .sort((a, b) => a.priority - b.priority)
        .sort((a, b) => compareAsc(a.dueDate, b.dueDate));
    } catch (error) {
      console.log(error);
    }
  };

  const getTodoById = (id) => {
    return todos.filter((todo) => {
      if (todo.id == id) {
        return true;
      }
    });
  };

  const getIdxById = (id) => {
    return todos.findIndex((todo) => todo.id == id);
  };
  const listTodosBySearch = (searchTerm) => {
    return todos
      .filter((todo) => {
        if (todo.title.includes(searchTerm)) {
          return true;
        }
      })
      .sort((a, b) => a.priority - b.priority)
      .sort((a, b) => compareAsc(a.dueDate, b.dueDate));
  };
  const listTodosByProject = (project) => {
    // returns an array of todos with the specified project
    if (projects.includes(project)) {
      return todos
        .filter((todo) => {
          if (todo.project === project) {
            return true;
          }
        })
        .sort((a, b) => a.priority - b.priority)
        .sort((a, b) => compareAsc(a.dueDate, b.dueDate));
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
      .sort((a, b) => a.priority - b.priority)
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
      .sort((a, b) => a.priority - b.priority)
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
    removeProject,
    getTodoById,
    toggelCheckbox,
    replaceTodoById,
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
      let pressTimer;

      button.addEventListener("mousedown", () => {
        pressTimer = setTimeout(() => {
          // Action to perform after 3 seconds
          console.log("Button held for 3 seconds");
          TodoManager.removeProject(projects[i]);
        }, 3000);
      });

      button.addEventListener("mouseup", () => {
        clearTimeout(pressTimer);
      });

      // Clear timer if mouse leaves button
      button.addEventListener("mouseleave", () => {
        clearTimeout(pressTimer);
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
      const checkBox = element.querySelector("#todo-check");
      checkBox.checked = tasks[i].checkbox;
      checkBox.addEventListener("click", function () {
        TodoManager.toggelCheckbox(tasks[i].id);
      });
      const todoTitle = element.querySelector("#todo-item-title");

      todoTitle.textContent = tasks[i].title;
      const todoDueDate = element.querySelector("#todo-item-dueDate");

      todoDueDate.textContent = format(
        new Date(tasks[i].dueDate),
        "dd/MM/yyyy"
      );
      const todoDeleteButton = element.querySelector("#todo-delete-button");
      const todoPriority = element.querySelector("#todo-priority");
      todoPriority.textContent = tasks[i].priority.toString();

      todoDeleteButton.addEventListener("click", () => {
        const id = element.getAttribute("task-id");
        TodoManager.removeTodo(id);
        content.children[1].removeChild(element);
      });
      element.addEventListener("dblclick", function () {
        if (element.querySelector(".description") == null) {
          const id = element.getAttribute("task-id");
          // tasks[i]

          const descriptionTitle = document.createElement("h3");
          descriptionTitle.classList.add("description-title");
          descriptionTitle.textContent = "Description:";
          element.appendChild(descriptionTitle);
          const description = document.createElement("p");
          description.classList.add("description");
          description.textContent = tasks[i].description;
          element.appendChild(description);

          const notesTitle = document.createElement("h3");
          notesTitle.classList.add("notes-title");
          notesTitle.textContent = "Notes:";
          element.appendChild(notesTitle);
          const notes = document.createElement("p");
          notes.classList.add("notes");
          notes.textContent = tasks[i].notes;
          element.appendChild(notes);
          const editButton = document.createElement("button");
          editButton.classList.add("edit-button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", () => {
            editTaskOverlay.render(tasks[i].id);
          });
          element.appendChild(editButton);
        } else {
          element.removeChild(element.querySelector(".description"));
          element.removeChild(element.querySelector(".notes"));
          element.removeChild(element.querySelector(".description-title"));
          element.removeChild(element.querySelector(".notes-title"));
          element.removeChild(element.querySelector(".edit-button"));
        }
      });

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

const editTaskOverlay = (function () {
  const render = async (id) => {
    const addTaskHolder = document.createElement("div");
    addTaskHolder.setAttribute("id", "add-task-overlay");
    // add html template for add task form
    addTaskHolder.innerHTML = overlayHtml;
    document.body.append(addTaskHolder);
    document.body.style.backgroundColor = "grey";

    setupUpdateFormHandler(id);
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

  const setupUpdateFormHandler = (id) => {
    // only get the form data

    const form = document.getElementById("add-task-form");

    const todo = TodoManager.getTodoById(id);
    // Add taskName to form
    const taskName = document.getElementById("task-name");
    taskName.value = todo[0].title;
    // Add taskDescription to form
    const taskDescription = document.getElementById("task-description");
    taskDescription.value = todo[0].description;
    // Add taskDueDate to form
    const taskDueDate = document.getElementById("task-due-date");
    taskDueDate.value = todo[0].dueDate;
    // Add taskPriority to form
    const taskPriority = document.getElementById("task-priority");
    taskPriority.value = todo[0].priority;
    // Add taskNotes to form
    const taskNotes = document.getElementById("task-notes");
    taskNotes.value = todo[0].notes;
    // taskProject to form
    const taskProject = document.getElementById("projects-input");
    taskProject.value = todo[0].project;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const taskName = document.getElementById("task-name").value;
      const taskDescription = document.getElementById("task-description").value;
      const taskDueDate = document.getElementById("task-due-date").value;
      const taskPriority = document.getElementById("task-priority").value
        ? parseInt(document.getElementById("task-priority").value)
        : 0;
      const taskNotes = document.getElementById("task-notes").value;
      const taskProject = document.getElementById("projects-input").value;

      TodoManager.replaceTodoById(id, [
        taskName,
        taskDescription,
        taskDueDate,
        taskProject,
        taskPriority,
        taskNotes,
      ]);

      // console.log(format(new Date(taskDueDate), "MM/dd/yyyy"));
      form.reset();
      document.body.removeChild(document.getElementById("add-task-overlay"));
      document.body.style.backgroundColor = "white";
    });
  };
  return {
    render,
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
      const taskPriority = document.getElementById("task-priority").value
        ? parseInt(document.getElementById("task-priority").value)
        : 0;
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
