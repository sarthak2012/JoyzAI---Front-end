// main.js
import * as storage from "./storage.js";
import * as render from "./render.js";
import * as dragdrop from "./dragdrop.js";

document.addEventListener("DOMContentLoaded", () => {
  render.initRender();

  // load from storage and render
  storage.loadTasks();
  render.renderAllFromStorage();

  // drop handling: update storage and DOM only for the dropped task
  dragdrop.initDropzones((id, targetStatus) => {
    const task = storage.getTaskById(id);
    if (!task) {
      console.error("Dropped task id not found:", id);
      return;
    }
    if (task.status === targetStatus) return;
    storage.updateTask(id, { status: targetStatus });
    render.addOrUpdateTask(storage.getTaskById(id));
  });

  const form = document.getElementById("taskForm");
  const input = document.getElementById("taskTitle");
  const prioritySelect = document.getElementById("taskPriority");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    const priority = prioritySelect.value;
    const task = storage.createTask(title, priority);
    render.addOrUpdateTask(task);
    input.value = "";
  });
});
