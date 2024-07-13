import { loadContent } from "./persistance.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";

const notePage = document.getElementById("note-page-popup");

document.addEventListener("DOMContentLoaded", async () => {
  const content = await loadContent(CHROME_CONTENT_KEY);
  if (content) notePage.innerHTML = content;
  else notePage.innerHTML = "No Notes (Yet).";
});
