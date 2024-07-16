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

  const content = await loadContent(noteId);

  // Load content if user has previously saved
  if (content !== undefined) notePage.innerHTML = content;
  // If first time use, add prompt text and apply listener that wipes it on first click
  else notePage.innerHTML = "";

  // Apply listeners to checkboxes, links
  addAllCheckboxListeners();
  addAllLinkListeners();

  // Save based on user activity
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

  const noteId = notePage.noteId;
  const content = notePage.innerHTML;

  clearTimeout(notePage.timeoutId);

  // Save if 10 inputs have passed since last save
  if (notePage.timeoutId > notePage.lastTimeoutId + 10) {
    saveContent(noteId, content);
    notePage.lastTimeoutId = notePage.timeoutId;
    return;
  }

  // Otherwise save after 1 seconds of inactivity
  notePage.timeoutId = setTimeout(() => {
    saveContent(noteId, content);
    notePage.lastTimeoutId = notePage.timeoutId;
  }, 1000);
}

export async function loadNoteTabs() {
  const idsValue = await loadContent(storageKeys.NOTES_LIST_KEY);
  const currentIdValue = await loadContent(storageKeys.CURRENT_NOTE_KEY);

  return { idsValue, currentIdValue };
}

export function persistNoteTabs(noteIds, currentId) {
  saveContent(storageKeys.NOTES_LIST_KEY, JSON.stringify(noteIds));
  saveContent(storageKeys.CURRENT_NOTE_KEY, currentId);
}

/**
 * Saves the content of content container to chrome storage
 * @param {string} CHROME_KEY
 * @param {string} content
 */
export function saveContent(CHROME_KEY, content) {
  chrome.storage.local.set({ [CHROME_KEY]: content }).catch((error) => {
    console.error(error);
  });
}

/**
 * Loads content from chrome storage if it exists
 * @param {string} CHROME_KEY
 * @returns {Promise<string>} undefined or saved content
 */
export async function loadContent(CHROME_KEY) {
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
export async function deleteContent(CHROME_KEY) {
  chrome.storage.local.remove(CHROME_KEY).catch((error) => {
    console.error(error);
  });
}

// export async function printKeys() {
//   const noteTabsString = await loadContent(storageKeys.NOTES_LIST_KEY);
//   const currentId = await loadContent(storageKeys.CURRENT_NOTE_KEY);

//   console.log("Note Tabs: ", noteTabsString);
//   console.log("Current Note: ", currentId);
// }

// export async function wipeKeys() {
//   const { idsValue, currentIdValue } = await loadNoteTabs();
//   deleteContent(storageKeys.NOTES_LIST_KEY);
//   deleteContent(storageKeys.CURRENT_NOTE_KEY);

//   const ids = JSON.parse(idsValue);
//   ids.forEach((id) => deleteContent(id));

//   console.log("Wiped keys");
// }
