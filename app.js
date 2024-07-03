import { persistChrome } from "./persistance.mjs";

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

    // PUTTING THIS HERE FOR TESTING PURPOSES
    if (!selection.focusNode) {
      window.alert("No Focus Node", console.trace());
      return;
    }

    const focusNode = selection.focusNode;
    const textContent = focusNode.textContent;

    const command = textContent ? textContent.slice(0, cursorIndex - 1) : "";
    const text = textContent ? textContent.slice(cursorIndex) : "";

    let parent = focusNode.parentElement;

    // Transform parent element based on command (e.g. #, ##, ### -> h1, h2, h3)
    if (commandMap[command]) {
      // Wrap focusNode into <div> if it's exposed in note-page (1)
      if (parent.id === "note-page") {
        const div = document.createElement("div");
        div.innerHTML = textContent;
        focusNode.replaceWith(div);
        parent = div;
      }

      commandMap[command](parent, text);
    }
  }
});

// Transforms parent element into new type {h1, h2, h3}
function transformParent(parent, newType, existingText = "") {
  const element = document.createElement(newType);
  element.innerHTML = existingText === "" ? "<br>" : existingText;
  parent.replaceWith(element);
}

const commandMap = {
  "#": (parent, text) => transformParent(parent, "h1", text),
  "##": (parent, text) => transformParent(parent, "h2", text),
  "###": (parent, text) => transformParent(parent, "h3", text),
  // "-": "li",
  // "1.": "li",
  // "*": "li",
  // "[]": "li",
  // "```": "code",
};

/**
 * (1) If contenteditable only has one line, the text content is not wrapped in a div. For our purposes, we need a div wrapper to apply the command.
 */
