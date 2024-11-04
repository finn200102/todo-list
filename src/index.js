import "./styles.css";
import { TodoManager, tasksPage } from "./todo";

const button = document.getElementById("list-task-button");
button.addEventListener("click", function () {
  tasksPage.renderTaskPage();
});
