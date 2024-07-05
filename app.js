import { persistChrome } from "./persistance.mjs";
import commandMap from "./commands.mjs";
import { createCheckboxRow } from "./checkboxes.mjs";
import { setCursorToOffset } from "./utils.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";
const contentContainer = document.getElementById("note-page");

// Save and load content area to/from chrome storage
persistChrome(contentContainer, CHROME_CONTENT_KEY);

contentContainer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkForCheckboxRow();
  }
});

contentContainer.addEventListener("keyup", (event) => {
  if (event.key === " ") onSpacebar();
  else if (event.key === "Enter") onEnterKeyup();
});

function checkForCheckboxRow() {
  const selection = document.getSelection();
  const focusNode = selection.focusNode;
  const parent = focusNode.parentElement;

  if (focusNode.classList) {
    // If focusNode is checkbox-list or checkbox-row -> empty line
    if (focusNode.classList.contains("checkbox-list")) {
      console.log("empty, focusNode is checkbox-list");
    } else if (focusNode.classList.contains("checkbox-row")) {
      console.log("empty, focusNode is checkbox-row");
    }
  }

  if (parent.classList) {
    // If textContent is whitespace and parent is checkbox-row -> empty line
    if (focusNode.textContent.trim() === "" && parent.classList.contains("checkbox-row")) {
      console.log("empty, textContent is whitespace and parent is checkbox-row");
    }
    // If textContent is not whitespace and parent is checkbox-row -> non-empty line
    else if (focusNode.textContent.trim() !== "" && parent.classList.contains("checkbox-row")) {
      console.log("not empty, textContent not whitespace and parent is checkbox-row");
    }
  }
}

function onCheckboxNewline(checkboxRow) {
  const text = checkboxRow.textContent;
  const newCheckboxRow = createCheckboxRow(text);
  checkboxRow.replaceWith(newCheckboxRow);
  setCursorToOffset(newCheckboxRow, 1);
}

function onEnterKeyup() {
  // const selection = document.getSelection();
  // if (selection.focusNode.classList.contains("checkbox-row"))
  //   onCheckboxNewline(selection.focusNode);
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
  }
}

/**
 * (1) If contenteditable only has one line, the text content is not wrapped in a div. For our purposes, we need a div wrapper to apply the command.
 */
