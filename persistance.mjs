/**
 * Persistance module to save and load content from chrome storage
 *
 * @param {HTMLElement} container - The element to persist
 * @param {string} CHROME_KEY - The key to use in chrome storage
 */
export function persistChrome(container, CHROME_KEY) {
  // Initial load
  document.addEventListener("DOMContentLoaded", async () => {
    const content = await loadContent(CHROME_KEY);

    if (content !== undefined) container.innerHTML = content;
  });

  // Save when user navigates away from page
  window.addEventListener("visibilitychange", () => saveContent(CHROME_KEY, container.innerHTML));

  // Save after 2s of inactivity
  let timeoutId;
  container.addEventListener("input", () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(saveContent, 2000, CHROME_KEY, container.innerHTML);
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
