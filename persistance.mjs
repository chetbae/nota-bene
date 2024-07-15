import { addAllCheckboxListeners } from "./checkboxes.mjs";
import { addAllLinkListeners } from "./utils.mjs";

/**
 * load content from chrome storage and persist changes.
 *
 * @param {string} CHROME_KEY - The key to use in chrome storage
 */
export async function loadNotePageFromChrome(CHROME_KEY) {
  const container = document.getElementById("note-page");

  const content = await loadContent(CHROME_KEY);

  // Load content if user has previously saved
  if (content !== undefined) container.innerHTML = content;
  // If first time use, add prompt text and apply listener that wipes it on first click
  else {
    container.innerHTML = "<i>Write Here...</i>";
    container.addEventListener("click", onFirstClick, { once: true });
  }

  // Apply listeners to checkboxes, links
  addAllCheckboxListeners();
  addAllLinkListeners();

  // Save content on user activity
  saveOnActivity(container, CHROME_KEY);
}

/**
 * Saves content to chrome storage based on user activity
 * @param {HTMLElement} container
 * @param {string} CHROME_KEY
 */
function saveOnActivity(container, CHROME_KEY) {
  // Save based on user activity
  let lastTimeoutId = 0;
  let timeoutId = 0;
  container.addEventListener("input", () => {
    clearTimeout(timeoutId);

    // Save if 10 inputs have passed since last save
    if (timeoutId > lastTimeoutId + 10) {
      saveContent(CHROME_KEY, container.innerHTML);
      lastTimeoutId = timeoutId;
      return;
    }

    // Otherwise save after 2 seconds of inactivity
    timeoutId = setTimeout(() => {
      saveContent(CHROME_KEY, container.innerHTML);
      lastTimeoutId = timeoutId;
    }, 2000);
  });

  // Save when user navigates away from page
  window.addEventListener("visibilitychange", () => saveContent(CHROME_KEY, container.innerHTML));
}

/**
 * Saves the content of content container to chrome storage
 * @param {string} CHROME_KEY
 * @param {string} content
 */
function saveContent(CHROME_KEY, content) {
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
    .get([CHROME_KEY])
    .then((result) => {
      console.log('Loaded from chrome.storage.local["' + CHROME_KEY + '"]:\n' + result[CHROME_KEY]);

      return result[CHROME_KEY];
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * If user has not clicked before, clear initial "Write Here..." text
 */
function onFirstClick() {
  const container = document.getElementById("note-page");
  container.innerHTML = "";
  container.removeEventListener("click", () => onFirstClick(container));
}
