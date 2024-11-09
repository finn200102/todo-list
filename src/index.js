import "./styles.css";
import { TodoManager, tasksPage, addTaskOverlay, searchOverlay } from "./todo";

const listTaskButton = document.getElementById("list-task-button");
listTaskButton.addEventListener("click", function () {
  tasksPage.renderTaskPage();
});

const listTodayButton = document.getElementById("today-button");
listTodayButton.addEventListener("click", function () {
  tasksPage.renderDueTodayPage();
});

const upcommingNextWeekButton = document.getElementById("upcomming-button");
upcommingNextWeekButton.addEventListener("click", function () {
  tasksPage.renderUpcommingNextWeek();
});

const standartProjectButton = document.getElementById(
  "standart-project-button"
);
standartProjectButton.addEventListener("click", function () {
  tasksPage.renderProjectPage("standart");
});

const addTaskButton = document.getElementById("add-task-button");
addTaskButton.addEventListener("click", function () {
  addTaskOverlay.render();
});

const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", function () {
  searchOverlay.render();
});
