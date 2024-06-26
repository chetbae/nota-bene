import { saveContent, loadContent } from "./persistance.mjs";

const contentElement = document.getElementById("app-content");

// Dynamic rendering while loading content
contentElement.innerHTML = `<h1>Loading...</h1>`;

// Load Saved content if any
document.addEventListener("DOMContentLoaded", async () => {
  const content = await loadContent();
  contentElement.innerHTML = content;
});

// Save content when user navigates away from page
window.addEventListener("visibilitychange", () => saveContent(contentElement.innerHTML));

// Save content after 2s of no activity
let timeoutId;
document.getElementById("app-content").addEventListener("input", () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(saveContent, 2000, contentElement.innerHTML);
});
