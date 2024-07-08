import { persistChrome } from "./persistance.mjs";
import commandMap from "./commands.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";
const notePage = document.getElementById("note-page");

// Save and load content area to/from chrome storage
persistChrome(CHROME_CONTENT_KEY);

notePage.addEventListener("keyup", (event) => {
  if (event.key === "Enter") onEnter();
  else if (event.key === " ") onSpacebar();
});

function onEnter() {
  const focusNode = document.getSelection().focusNode;
  if (!focusNode) return;

  // If Enter key is pressed for checkbox newline, make sure the new line is not checked
  if (focusNode.classList.contains("checkbox")) {
    if (focusNode.parentElement.classList.contains("checked")) {
      focusNode.parentElement.classList.remove("checked");
    }
  }
}

function onSpacebar() {
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
    const textPart = textContent ? textContent.slice(cursorIndex) : "";

    // Wrap focusNode into <div> if it's exposed in note-page (1)
    if (parent.id === "note-page") {
      const div = document.createElement("div");
      div.innerHTML = textContent;
      focusNode.replaceWith(div);
      parent = div;
    }

    // Apply command function
    parent = commandMap[command](parent, textPart);
  }
}

const appBody = document.getElementById("app-body");
const infoButton = document.getElementById("info-button");
const appFooter = document.getElementById("app-footer");

infoButton.addEventListener("click", () => {
  appBody.classList.toggle("info-open");
  appFooter.classList.toggle("info-open");
});

/**
 * (1) If contenteditable only has one line, the text content is not wrapped in a div. For our purposes, we need a div wrapper to apply the command.
 */
