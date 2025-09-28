const STORAGE_KEY = "kanban_tasks_v1";
let tasks = [];

function _save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function _uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

export function loadTasks() {
  tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return tasks;
}

export function getTasks() {
  return tasks;
}

export function getTaskById(id) {
  return tasks.find((t) => t.id === id);
}

export function createTask(title, priority = "Medium") {
  const task = {
    id: _uuid(),
    title: title.trim(),
    status: "todo",
    priority,
  };
  tasks.push(task);
  _save();
  return task;
}

export function addTaskObject(task) {
  tasks.push(task);
  _save();
}

export function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  _save();
}

export function updateTask(id, updates = {}) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
  _save();
}

export function getTasksByStatus(status) {
  return tasks.filter((t) => t.status === status);
}
