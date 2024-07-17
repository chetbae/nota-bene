import { addAllCheckboxListeners } from "./checkboxes.mjs";
import { addAllLinkListeners } from "./utils.mjs";
import storageKeys from "./chrome_keys.mjs";

/**
 * Load content from chrome storage and persist changes.
 * (does not save current tab)
 *
 * @param {string} noteId - The key for specific note page in chrome storage
 */
export async function updateAndPersistNotePage(noteId) {
  const notePage = document.getElementById("note-page");
  notePage.removeEventListener("input", saveOnActivity);

  // Save previous note page content if exists
  if (notePage.noteId) saveNotePageData(notePage);

  const data = await loadNotePageData(noteId);
  // Load content if user has previously saved
  if (data !== undefined) notePage.innerHTML = data.content;
  else notePage.innerHTML = "";
  // Apply listeners to checkboxes, links
  addAllCheckboxListeners();
  addAllLinkListeners();

  // Update current note attributes and save on user activity
  notePage.noteId = noteId;
  notePage.lastTimeoutId = 0;
  notePage.timeoutId = 0;
  notePage.addEventListener("input", saveOnActivity);
}

/**
 * Callback function for input on note-page, saves content after 1 second of inactivity
 * @param {InputEvent} event
 * @listens input
 */
function saveOnActivity(event) {
  const notePage = event.target;
  if (notePage.id !== "note-page") return;

  clearTimeout(notePage.timeoutId);

  // Save if 10 inputs have passed since last save
  if (notePage.timeoutId > notePage.lastTimeoutId + 10) {
    saveNotePageData(notePage);
    return;
  }

  // Otherwise save after 1 seconds of inactivity
  notePage.timeoutId = setTimeout(() => {
    saveNotePageData(notePage);
  }, 1000);
}

/**
 * Saves the content of notePage and a preview to chrome storage
 * @param {DIVElement} notePage
 */
function saveNotePageData(notePage) {
  const noteId = notePage.noteId;
  const content = notePage.innerHTML;

  // Get first line of note as preview
  let child = notePage.firstChild;
  let preview = "";
  if (child) {
    preview = child.textContent;
    while (child !== null) {
      if (preview !== "") break;
      preview = child.textContent;
      child = child.nextSibling;
    }
  }

  const data = JSON.stringify({ content, preview });
  saveData(noteId, data);
  notePage.lastTimeoutId = notePage.timeoutId;
}

/**
 * Load note page content and preview from chrome storage
 * @param {string} noteId
 * @returns { content: string, preview: string } | undefined
 */
export async function loadNotePageData(noteId) {
  const data = await loadData(noteId);
  if (data === undefined) return;

  const { content, preview } = JSON.parse(data);
  return { content, preview };
}

export async function loadNoteTabs() {
  const idsValue = await loadData(storageKeys.NOTE_IDS_KEY);
  const currentIdValue = await loadData(storageKeys.CURRENT_NOTE_KEY);

  return { idsValue, currentIdValue };
}

export function persistNoteTabs(noteIds, currentId) {
  if (noteIds) saveData(storageKeys.NOTE_IDS_KEY, JSON.stringify(noteIds));
  if (currentId) saveData(storageKeys.CURRENT_NOTE_KEY, currentId);
}

/**
 * Saves the content of content container to chrome storage
 * @param {string} CHROME_KEY
 * @param {string} content
 */
function saveData(CHROME_KEY, content) {
  chrome.storage.local.set({ [CHROME_KEY]: content }).catch((error) => {
    console.error(error);
  });
}

/**
 * Loads content from chrome storage if it exists
 * @param {string} CHROME_KEY
 * @returns {Promise<string>} undefined or saved content
 */
export async function loadData(CHROME_KEY) {
  return await chrome.storage.local
    .get(CHROME_KEY)
    .then((result) => {
      return result[CHROME_KEY];
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Deletes content from chrome storage
 * @param {string} CHROME_KEY
 */
export async function deleteData(CHROME_KEY) {
  chrome.storage.local.remove(CHROME_KEY).catch((error) => {
    console.error(error);
  });
}

export async function printKeys() {
  const noteTabsString = await loadData(storageKeys.NOTE_IDS_KEY);
  const currentId = await loadData(storageKeys.CURRENT_NOTE_KEY);
  const notePreviews = await loadNotePreviewMap();

  console.log("Note Tabs: ", noteTabsString);
  console.log("Current Note: ", currentId);
  console.log("Note Previews: ", notePreviews);
}

export async function wipeKeys() {
  const { idsValue, currentIdValue } = await loadNoteTabs();
  deleteData(storageKeys.NOTE_IDS_KEY);
  deleteData(storageKeys.CURRENT_NOTE_KEY);

  const ids = JSON.parse(idsValue);
  ids.forEach((id) => deleteData(id));

  console.log("Wiped keys");
}
