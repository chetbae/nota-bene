import { persistChrome } from "./persistance.mjs";
import commandMap from "./commands.mjs";
import { setCursorToOffset, addLink } from "./utils.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";

const appBody = document.getElementById("app-body");
const appContentContainer = document.getElementById("app-content-container");
const notePage = document.getElementById("note-page");
const infoButton = document.getElementById("info-button");
const appFooter = document.getElementById("app-footer");

// Save and load content area to/from chrome storage
persistChrome(CHROME_CONTENT_KEY);

// Apply listener to info button to toggle footer
infoButton.addEventListener("click", () => {
  appBody.classList.toggle("info-open");
  appFooter.classList.toggle("info-open");
});

// Apply listener to focus on note-page end if clicked on content container empty space
appContentContainer.addEventListener("click", (event) => {
  // Don't set cursor if clicking on note-page and not container
  if (event.target === appContentContainer) {
    const notePage = document.getElementById("note-page");
    setCursorToOffset(notePage, notePage.childElementCount);
  }
});

notePage.addEventListener("keyup", (event) => {
  if (event.key === "Enter") onEnter();
  else if (event.key === " ") onSpacebar();
});

function onEnter() {
  const selection = document.getSelection();
  const focusNode = selection.focusNode;

  // If Enter key is pressed for checkbox newline, make sure the new line is not checked
  if (focusNode.parentElement && focusNode.parentElement.classList.contains("checkbox")) {
    if (focusNode.parentElement.classList.contains("checked")) {
      focusNode.parentElement.classList.remove("checked");
    }
  }

  // If no carryover text and not a list item, add newline stripped of previous styling
  if (!focusNode.textContent && focusNode.tagName !== "LI") {
    const div = document.createElement("div");
    div.innerHTML = "<br>";
    focusNode.replaceWith(div);
    setCursorToOffset(div, 0);
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

/**
 * (1) If contenteditable only has one line, the text content is not wrapped in a div. For our purposes, we need a div wrapper to apply the command.
 */
