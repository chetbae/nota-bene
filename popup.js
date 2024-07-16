import { loadContent } from "./persistance.mjs";
import storageKeys from "./chrome_keys.mjs";

const notePage = document.getElementById("note-page-popup");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const currentNoteId = await loadContent(storageKeys.CURRENT_NOTE_KEY);
    const content = await loadContent(currentNoteId);
    notePage.innerHTML = content;
  } catch (error) {
    console.error(error);
    notePage.innerHTML = "No Notes (Yet).";
  }
});
