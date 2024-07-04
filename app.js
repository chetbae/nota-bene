import { persistChrome } from "./persistance.mjs";
import commandMap from "./commands.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";
const contentContainer = document.getElementById("note-page");

// Save and load content area to/from chrome storage
persistChrome(contentContainer, CHROME_CONTENT_KEY);

contentContainer.addEventListener("keyup", (event) => {
  // Spacebar executes command if there is one
  if (event.key === " ") {
    const selection = document.getSelection();

    // Markdown commands are at most 6 characters long, so we only need to check the first 6 characters
    const cursorIndex = selection.focusOffset;
    if (cursorIndex > 7) return;

    // PUTTING THIS HERE FOR TESTING
    if (!selection.focusNode) window.alert("No Focus Node", console.trace());

    const focusNode = selection.focusNode;
    const textContent = focusNode.textContent;
    const command = textContent ? textContent.slice(0, cursorIndex - 1) : "";

    // Apply action if command exists
    if (commandMap[command]) {
      let parent = focusNode.parentElement;
      const text = textContent ? textContent.slice(cursorIndex) : "";

      // Wrap focusNode into <div> if it's exposed in note-page (1)
      if (parent.id === "note-page") {
        const div = document.createElement("div");
        div.innerHTML = textContent;
        focusNode.replaceWith(div);
        parent = div;
      }

      // Apply command function
      parent = commandMap[command](parent, text);

      // Set cursor to end of element
      setCursorToOffset(parent, 0);
    }
  }
});

/**
 * Set cursor to an offset within the specific element
 * @param {HTMLElement} element
 * @param {number} offset
 */
function setCursorToOffset(element, offset) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element, offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * (1) If contenteditable only has one line, the text content is not wrapped in a div. For our purposes, we need a div wrapper to apply the command.
 */
