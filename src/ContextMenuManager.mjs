function ContextMenuManager(app, deleteNoteTab) {
  const contextMenu = document.getElementById("context-menu");
  const deleteButton = document.getElementById("context-menu-delete");

  app.addEventListener("contextmenu", (event) => {
    // If right clicking on note tabs, open context menu for deleting tab
    if (event.target.classList.contains("note-tab")) {
      event.preventDefault();
      contextMenu.noteId = event.target.id;

      deleteButton.hidden = false;
      showContextMenu(event);
    } else {
      closeContextMenuIfOpen(event);
    }
  });

  // Close context menu if clicked outside
  app.addEventListener("click", (event) => {
    if (![contextMenu, deleteButton].includes(event.target)) {
      closeContextMenuIfOpen(event);
      delete contextMenu.noteId;
    }
  });

  // Delete action on note tab/page
  deleteButton.addEventListener("click", () => {
    if (contextMenu.noteId) deleteNoteTab(contextMenu.noteId);
    closeContextMenuIfOpen();
  });

  // Show context menu on app, accounting for margins and overflow
  function showContextMenu(event) {
    const x = event.clientX;
    const y = event.clientY;
    const appRect = app.getBoundingClientRect();

    const overflowX = x + contextMenu.offsetWidth - appRect.right;
    const overflowY = y + contextMenu.offsetHeight - appRect.bottom;

    contextMenu.style.top = `${y - (overflowY > 0 ? overflowY : 0)}px`;
    contextMenu.style.left = `${x - (overflowX > 0 ? overflowX : 0)}px`;
    contextMenu.classList.add("show");
  }

  function closeContextMenuIfOpen(event) {
    if (contextMenu.classList.contains("show")) {
      contextMenu.classList.remove("show");
      contextMenu.style.top = 0;
      contextMenu.style.left = 0;
    }
  }
}

export default ContextMenuManager;
