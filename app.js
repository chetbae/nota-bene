import { commandMap } from "./commands.mjs";
import { setCursorToOffset, createLink } from "./utils.mjs";
import { toggleStrikethrough } from "./strikethrough.mjs";
import { nodeToMarkdown } from "./markdown.mjs";
import ContextMenuManager from "/ContextMenuManager.mjs";
import NoteTabManager from "./NoteTabManager.mjs";

const appBody = document.getElementById("app-body");
const appContentContainer = document.getElementById("app-content-container");
const infoButton = document.getElementById("info-button");
const markdownButton = document.getElementById("copy-md-button");
const snackbarContainer = document.getElementById("snackbar-container");
const snackbar = document.getElementById("snackbar");
const footer = document.getElementById("app-footer");
const emptyPrompt = document.getElementById("empty-prompt");
const notePage = document.getElementById("note-page");

// Context menu manager
const { deleteNoteTab } = NoteTabManager();
ContextMenuManager(appBody, deleteNoteTab);

// Apply listener to info button to toggle footer
infoButton.addEventListener("click", () => {
  appBody.classList.toggle("info-open");
  footer.classList.toggle("info-open");
});

// Markdown button copies note-page markdown to clipboard and displays snackbar temporarily
markdownButton.addEventListener("click", async () => {
  const notePage = document.getElementById("note-page");
  const markdown = nodeToMarkdown(notePage);

  await navigator.clipboard
    .writeText(markdown)
    .then(() => {
      snackbar.innerHTML = "Copied to clipboard.";
      snackbarContainer.classList.add("show");
      snackbar.classList.add("show");
      setTimeout(() => {
        snackbarContainer.classList.remove("show");
        snackbar.classList.remove("show");
      }, 3000);
    })
    .catch((error) => {
      console.error("Failed to copy markdown to clipboard: ", error);
    });
});

appContentContainer.addEventListener("click", (event) => {
  // Hide empty prompt
  if (!emptyPrompt.hidden) {
    emptyPrompt.hidden = true;

    // Set cursor to end of note-page
    setCursorToOffset(notePage, notePage.childNodes.length);
  }

  // If clicked on content container, set cursor to end of note-page new line (make new line if necessary)
  else if (event.target === appContentContainer) {
    if (notePage.lastChild && notePage.lastChild.innerHTML !== "<br>") {
      const div = document.createElement("div");
      div.innerHTML = "<br>";
      notePage.appendChild(div);
    }
    // Set cursor to end of note-page
    setCursorToOffset(notePage, notePage.childNodes.length);
  }
});

appContentContainer.addEventListener("keydown", (event) => {
  // Prevent tab on note-page
  if (event.key === "Tab") {
    event.preventDefault();
    document.execCommand("insertText", false, "\t");
  }

  if (event.key === "Backspace") onBackspace();

  // Apply listener to note-page for keyboard shortcuts
  if (event.shiftKey && event.metaKey) {
    event.preventDefault();

    // Shift + Command + u -> link
    if (event.key === "u") createLink();
    // Shift + Command + x -> strikethrough
    else if (event.key === "x") toggleStrikethrough();
    else if (event.key === "m") {
      printKeys();
    } else if (event.key === "l") {
      wipeKeys();
    }
  }
});

appContentContainer.addEventListener("keyup", (event) => {
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

  // Check if new line is empty, if so replace with <br>
  if (focusNode.textContent === "" && !["DIV", "PRE", "LI"].includes(focusNode.tagName)) {
    const br = document.createElement("br");
    focusNode.replaceWith(br);
    setCursorToOffset(br, 0);
  }
}

function onBackspace() {
  const focusNode = document.getSelection().focusNode;

  // Check for empty code block, headings
  if (focusNode.textContent === "" && ["PRE", "H1", "H2", "H3"].includes(focusNode.tagName)) {
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

    // Wrap focusNode into <div> if it's exposed in note-page
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
