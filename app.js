import { persistChrome } from "./persistance.mjs";
import commandMap from "./commands.mjs";
import { setCursorToOffset, createLink } from "./utils.mjs";
import { toggleStrikethrough } from "./strikethrough.mjs";

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

appContentContainer.addEventListener("click", (event) => {
  // If clicked on content container, set cursor to end of note-page new line (make new line if necessary)
  if (event.target === appContentContainer) {
    const notePage = document.getElementById("note-page");

    if (!notePage.hasChildNodes()) notePage.innerHTML = "<br>";
    else if (notePage.lastChild.innerHTML !== "<br>") {
      const div = document.createElement("div");
      div.innerHTML = "<br>";
      notePage.appendChild(div);
    }

    setCursorToOffset(notePage, notePage.childElementCount);
  }
});

notePage.addEventListener("keydown", (event) => {
  // Apply listener to note-page for keyboard shortcuts
  if (event.shiftKey && event.metaKey) {
    event.preventDefault();

    // Shift + Command + u -> link
    if (event.key === "u") createLink();
    // Shift + Command + x -> strikethrough
    else if (event.key === "x") toggleStrikethrough();
  }
});

notePage.addEventListener("keyup", (event) => {
  if (event.key === "Enter") onEnter();
  else if (event.key === " ") onSpacebar();
});

function onEnter() {
  const focusNode = document.getSelection().focusNode;
  const parentElement = focusNode.parentElement;

  // Check parent is checked checkbox
  const li = parentElement.closest("li.checkbox.checked");
  if (li) {
    li.classList.remove("checked");
    return;
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
    commandMap[command](parent, textPart);
  }
}

/**
 * (1) If contenteditable only has one line, the text content is not wrapped in a div. For our purposes, we need a div wrapper to apply the command.
 */
