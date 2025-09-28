// render.js
import { deleteTask as storageDeleteTask, getTasks } from './storage.js';
import { attachDragHandlers } from './dragdrop.js';

const priorityOrder = { High: 1, Medium: 2, Low: 3 };
const rendered = new Map();
const columns = {};

export function initRender() {
  columns.todo = document.getElementById('todo');
  columns.inprogress = document.getElementById('inprogress');
  columns.done = document.getElementById('done');
}

function priorityValue(p) { return priorityOrder[p] ?? 99; }

function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = 'task';
  div.draggable = true;
  div.dataset.id = task.id;
  div.dataset.priority = task.priority;

  const titleSpan = document.createElement('span');
  titleSpan.className = 'task-title';
  titleSpan.textContent = task.title;

  const priSpan = document.createElement('span');
  priSpan.className = 'task-priority';
  priSpan.textContent = task.priority;

  const btn = document.createElement('button');
  btn.className = 'task-delete';
  btn.textContent = 'x';
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    storageDeleteTask(task.id);        // deletes in storage (by unique id)
    removeTaskElement(task.id);       // removes only the element
  });

  div.appendChild(titleSpan);
  div.appendChild(priSpan);
  div.appendChild(btn);

  attachDragHandlers(div);

  return div;
}

export function addOrUpdateTask(task) {
  const existing = rendered.get(task.id);
  if (existing) {
    // update text/priority
    existing.querySelector('.task-title').textContent = task.title;
    existing.querySelector('.task-priority').textContent = task.priority;
    existing.dataset.priority = task.priority;

    // move if status changed or reorder to respect priority
    if (existing.dataset.status !== task.status) {
      existing.dataset.status = task.status;
      insertTaskElementSorted(existing, columns[task.status]);
    } else {
      insertTaskElementSorted(existing, columns[task.status]);
    }
  } else {
    const el = createTaskElement(task);
    el.dataset.status = task.status;
    rendered.set(task.id, el);
    insertTaskElementSorted(el, columns[task.status]);
  }
}

export function removeTaskElement(taskId) {
  const el = rendered.get(taskId);
  if (el && el.parentElement) el.parentElement.removeChild(el);
  rendered.delete(taskId);
}

function insertTaskElementSorted(el, container) {
  const newPr = priorityValue(el.dataset.priority);
  const children = Array.from(container.children);
  let inserted = false;
  for (const child of children) {
    const childPr = priorityValue(child.dataset.priority);
    if (newPr < childPr) { // lower numeric value = higher priority
      container.insertBefore(el, child);
      inserted = true;
      break;
    }
  }
  if (!inserted) container.appendChild(el);
}

export function renderAllFromStorage() {
  // initial build: clear and create elements (this happens only once or on full restore)
  Object.values(columns).forEach(col => col.innerHTML = '');
  rendered.clear();
  const tasks = getTasks();
  tasks.forEach(t => addOrUpdateTask(t));
}
