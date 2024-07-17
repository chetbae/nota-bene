import {
  deleteData,
  loadNoteTabs,
  persistNoteTabs,
  updateAndPersistNotePage,
} from "./persistance.mjs";
import { genId } from "./utils.mjs";

/**
 * Manages note tab loading from storage, persisting data for current notetab and all notetabs, and updating the UI
 */
function NoteTabManager() {
  let currentId = null;
  let noteIds = [];
  let noteContents = {};

  const noteTabContainer = document.getElementById("note-tab-container");
  const newNoteButton = document.getElementById("new-note-tab");

  // Initial Load
  loadNoteTabs().then(({ idsValue, currentIdValue }) => {
    if (!idsValue) {
      currentId = currentIdValue ? currentIdValue : genId();
      noteIds.push(currentId);
    } else noteIds = JSON.parse(idsValue);

    if (!currentIdValue) currentId = noteIds[0];
    else currentId = currentIdValue;

    if (!(idsValue && currentIdValue)) persistNoteTabs(noteIds, currentId);

    updateAndPersistNotePage(currentId);
    updateNoteTabs();
  });

  newNoteButton.addEventListener("click", createNewNoteTab);

  function createNewNoteTab() {
    const id = genId();
    noteIds.push(id);
    currentId = id;

    // Persist new id
    persistNoteTabs(noteIds, currentId);

    // Update UI
    updateAndPersistNotePage(currentId);
    updateNoteTabs();
  }

  async function deleteNoteTab(id) {
    // If only one note tab, don't allow deletion
    if (noteIds.length === 1) {
      alert("Cannot delete only note tab.");
      return;
    }

    // Confirm with user
    const confirmDelete = confirm("Are you sure you want to delete this note?");

    if (confirmDelete) {
      // Delete from storage
      await deleteData(id);

      // Remove note id from list
      noteIds = noteIds.filter((noteId) => noteId !== id);

      // Open first tab if current tab is deleted
      if (id === currentId) openTab(noteIds[0]);
      // Otherwise only persist new tab datas
      else persistNoteTabs(noteIds, currentId);

      // Update UI
      updateNoteTabs();
    }
  }

  function updateNoteTabs() {
    noteTabContainer.innerHTML = "";

    noteIds.forEach((id) => {
      const noteTab = createNoteTab(id);
      noteTabContainer.appendChild(noteTab);
    });

    const activeTab = document.getElementById(currentId);
    activeTab.classList.add("active");
  }

  /**
   * Creates new DIV note tab with id of noteId and text of its preview
   * @param {string} id
   * @returns {HTMLDivElement} note-tab div
   */
  function createNoteTab(id) {
    const div = document.createElement("div");
    div.classList.add("note-tab");
    div.id = id;
    div.innerText = id;

    // add click listener to load page if clicked
    div.addEventListener("click", () => openTab(id));

    return div;
  }

  function openTab(id) {
    if (id !== currentId) {
      // Remove active from old tab, set new tab active

      const activeTab = document.getElementById(currentId);
      activeTab.classList.remove("active");
      const newTab = document.getElementById(id);
      newTab.classList.add("active");

      // Save new current id
      currentId = id;
      persistNoteTabs(noteIds, currentId);

      // load new note page
      updateAndPersistNotePage(id);
    }
  }

  // function updateNoteTabTitle(id) {}

  // function getNoteTabPreview(id) {
  //   console.log("getNoteTabPreview", id);

  //   const contentValue = loadData(id);

  //   if (!contentValue) return "New Note";
  //   else {
  //     const content = contentValue;
  //     const preview = content.slice(0, 15);
  //     return preview;
  //   }
  // }

  return {
    deleteNoteTab,
  };
}

export default NoteTabManager;
