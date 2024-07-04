import { applyAllCheckboxListeners } from "./checkboxes.mjs";

/**
 * Persistance module to save and load content from chrome storage
 *
 * @param {HTMLElement} container - The element to persist
 * @param {string} CHROME_KEY - The key to use in chrome storage
 * @param {function[]} applyListener - List of functions to apply event listeners to static elements
 */
export function persistChrome(container, CHROME_KEY) {
  window.addEventListener("DOMContentLoaded", async () => {
    const content = await loadContent(CHROME_KEY);

    if (content !== undefined) container.innerHTML = content;

    // Apply listeners to checkboxes
    applyAllCheckboxListeners();
  });

  // Save when user navigates away from page
  window.addEventListener("visibilitychange", () => saveContent(CHROME_KEY, container.innerHTML));

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
async function loadContent(CHROME_KEY) {
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
