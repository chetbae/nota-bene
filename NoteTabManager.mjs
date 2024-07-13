function NoteTabManager() {
  const contextMenu = document.getElementById("context-menu");
  const deleteButton = document.getElementById("context-menu-delete");

  document.addEventListener("contextmenu", (event) => {
    // If right clicking on note tabs, open context menu for deleting tab
    if (event.target.classList.contains("note-tab")) {
      event.preventDefault();
      const noteTab = event.target;
      const noteId = noteTab.id;

      deleteButton.hidden = false;
      showContextMenu(event);

      deleteButton.addEventListener("click", () => {
        deleteNoteTab(noteId);
      });
    } else {
      closeContextMenuIfOpen(event);
    }
  });

  // Close context menu if clicked outside
  document.addEventListener("click", (event) => {
    closeContextMenuIfOpen(event);
  });

  // Show context menu on app, accounting for margins and overflow
  function showContextMenu(event) {
    const x = event.clientX;
    const y = event.clientY;
    const app = document.getElementById("app-body");
    const appRect = app.getBoundingClientRect();

    const overflowX = x + contextMenu.offsetWidth - appRect.right;
    const overflowY = y + contextMenu.offsetHeight - appRect.bottom;

    contextMenu.style.top = `${y - (overflowY > 0 ? overflowY : 0)}px`;
    contextMenu.style.left = `${x - (overflowX > 0 ? overflowX : 0)}px`;
    contextMenu.classList.add("show");
  }

  function closeContextMenuIfOpen(event) {
    if (contextMenu.classList.contains("show") && event.target.closest("#context-menu") === null) {
      contextMenu.classList.remove("show");
      contextMenu.style.top = 0;
      contextMenu.style.left = 0;
    }
  }
}

function deleteNoteTab(noteId) {
  // prompt user to confirm deletion
  const confirmed = window.confirm("Are you sure you want to delete this note?");
  if (!confirmed) return;

  console.log("Deleting note tab", noteId);
}

export default NoteTabManager;
