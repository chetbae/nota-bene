import { persistChrome } from "./persistance.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";
const contentContainer = document.getElementById("app-content-container");

// Save and load content area to/from chrome storage
persistChrome(contentContainer, CHROME_CONTENT_KEY);

// Monitor user cursor and keypress states
let keyPressed;
let focusRow;
let selectionStart;
let selectionEnd;

// Manage user selection of rows and cursor position

function makeRow(content) {
  const row = document.createElement("div");
  row.classList.add("note-row");
  row.contentEditable = true;
  row.innerHTML = content;
  return row;
}
