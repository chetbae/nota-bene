export function deleteNoteTab(noteId) {
  // prompt user to confirm deletion
  const confirmed = window.confirm("Are you sure you want to delete this note?");
  if (!confirmed) return;

  console.log("Deleting note tab", noteId);
}

const NoteTabManager = function NoteTabManager() {
  let currentId = null;
  const tabIdArr = [];

  function getNoteTabId() {
    return currentId;
  }

  function createNewNoteTab() {
    const id = generateId();
    currentId = id;
    return id;
  }

  function updateNoteTab(id) {
    currentId = id;
  }

  function generateId() {
    return Math.random().toString(36).substring(2);
  }

  return {
    updateNoteTab,
    getNoteTabId,
  };
};

export default NoteTabManager;
