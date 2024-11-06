import "./styles.css";
import { TodoManager, tasksPage, addTaskOverlay } from "./todo";

const listTaskButton = document.getElementById("list-task-button");
listTaskButton.addEventListener("click", function () {
  tasksPage.renderTaskPage();
});

const listTodayButton = document.getElementById("today-button");
listTodayButton.addEventListener("click", function () {
  tasksPage.renderDueTodayPage();
});

const addTaskButton = document.getElementById("add-task-button");
addTaskButton.addEventListener("click", function () {
  addTaskOverlay.render();
});
