/**
 * Persistance module to save and load content from chrome storage
 *
 * @param {HTMLElement} htmlElement - The element to persist
 * @param {string} CHROME_KEY - The key to use in chrome storage
 */
export function persistChrome(htmlElement, CHROME_KEY) {
  htmlElement.innerHTML = `<h1>Loading...</h1>`;

  // Initial load
  document.addEventListener("DOMContentLoaded", async () => {
    const content = await loadContent(CHROME_KEY);
    htmlElement.innerHTML = content;
  });

  // Save when user navigates away from page
  window.addEventListener("visibilitychange", () => saveContent(CHROME_KEY, htmlElement.innerHTML));

  // Save after 2s of inactivity
  let timeoutId;
  htmlElement.addEventListener("input", () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(saveContent, 2000, CHROME_KEY, htmlElement.innerHTML);
  });
}

function saveContent(CHROME_KEY, content) {
  chrome.storage.local.set({ [CHROME_KEY]: content }).catch((error) => {
    console.error(error);
  });
}

async function loadContent(CHROME_KEY) {
  return await chrome.storage.local
    .get([CHROME_KEY])
    .then((result) => result[CHROME_KEY])
    .catch((error) => {
      console.error(error);
    });
}
