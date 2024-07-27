import { loadNotePageData, loadData } from "../persistance.mjs";
import storageKeys from "../chrome_keys.mjs";

const notePage = document.getElementById("note-page-popup");
const noContentHtml = "<i>No notes yet.</i><br><br><b>Open a new tab +++</b>";

document.addEventListener("DOMContentLoaded", async () => {
  const currentNoteId = await loadData(storageKeys.CURRENT_NOTE_KEY);
  if (!currentNoteId) {
    notePage.innerHTML = noContentHtml;
    return;
  }

  const data = await loadNotePageData(currentNoteId);
  console.log(data);

  notePage.innerHTML = data ? data.content : noContentHtml;
});
