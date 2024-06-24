import { saveContent, loadContent } from "./persistance.mjs";

// Load content from chrome.storage.local and render it in the DOM
document.addEventListener("DOMContentLoaded", async () => {
  const contentElement = document.getElementById("app-content");

  const content = await loadContent();
  contentElement.innerHTML = content;
});

function saveContentHandler() {
  const contentElement = document.getElementById("app-content");
  const content = contentElement.innerHTML;

  saveContent(content);
}

// Save content to chrome.storage.local every second while the user is typing
let timeoutId;
document.getElementById("app-content").addEventListener("input", () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(saveContentHandler, 1000);
});

// Save content to chrome.storage.local when the user navigates away from the page
window.addEventListener("beforeunload", saveContentHandler);
