# Kanban Task Board — Refactor & Priority Feature

## 🧩 Module structure

- **storage.js** — Single source of truth: create, read, update, delete, persist. Produces stable unique IDs using `crypto.randomUUID()` with a fallback. Keeps persistence concerns isolated.
- **render.js** — Creates/updates task DOM nodes and keeps a `rendered` Map (id → element) so the app updates only the affected elements.
- **dragdrop.js** — Manages drag start/end and drop zones. Uses `dataTransfer` _and_ a `currentDraggedId` fallback so drag IDs are never lost.

This separation improves testability, prevents circular responsibilities, and makes each file small and focused.

## ⚡ Minimal DOM update strategy

- New tasks: create one DOM node and insert it at the correct position (no column re-renders).
- Move tasks: update that task’s `dataset.status`, and **insert that single node** in the target column sorted by priority.
- Delete: remove only the single node and update storage.
- Sorting: insertion uses `insertBefore` to place items in priority order (High → Medium → Low). Only the affected node is moved/reinjected.

This keeps UI changes minimal and snappy.

## 💡 Next feature idea

**Due dates + visual alerts** — add `dueDate` to task objects, display relative time in the task row, and run a periodic check for overdue tasks to add a red outline. Implementation: add a `dueDate` input on the form, persist it in `storage.js`, and a small `setInterval` in `main.js` that calls a `render.markOverdue()` function (which updates only the affected task elements).
