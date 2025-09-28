let currentDraggedId = null;

export function attachDragHandlers(el) {
  el.addEventListener("dragstart", (e) => {
    const id = el.dataset.id;
    currentDraggedId = id;
    try {
      e.dataTransfer.setData("text/plain", id);
    } catch (err) {
      /* noop */
    }
    el.classList.add("dragging");
  });

  el.addEventListener("dragend", () => {
    currentDraggedId = null;
    el.classList.remove("dragging");
  });
}

export function initDropzones(onDrop) {
  document.querySelectorAll(".dropzone").forEach((zone) => {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      let id = null;
      try {
        id = e.dataTransfer.getData("text/plain");
      } catch (err) {
        id = null;
      }
      if (!id) id = currentDraggedId; // fallback
      if (!id) {
        console.error("Drop failed: no task id found.");
        return;
      }
      onDrop(id, zone.id);
    });
  });
}
