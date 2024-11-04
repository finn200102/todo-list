import "./styles.css";
import { TodoManager, tasksPage, addTaskOverlay } from "./todo";

const button = document.getElementById("list-task-button");
button.addEventListener("click", function () {
  tasksPage.renderTaskPage();
});

const addTaskButton = document.getElementById("add-task-button");
addTaskButton.addEventListener("click", function () {
  addTaskOverlay.render();
});
