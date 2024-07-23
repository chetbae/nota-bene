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

// Visibility of empty-prompt:
// 1) if clicked, focus on note-page and hide empty-prompt
// 2) when focused in, hide empty-prompt
// 3) when focused out, show empty-prompt if note-page is empty
emptyPrompt.addEventListener("click", () => notePage.focus());
notePage.addEventListener("focusin", () => (emptyPrompt.hidden = true));
notePage.addEventListener("focusout", () => {
  if (notePage.textContent === "") emptyPrompt.hidden = false;
});

// If clicked OUTSIDE of note-page -> creates new line (for escaping code blocks, headings, etc.)
appContentContainer.addEventListener("click", (event) => {
  if (event.target === appContentContainer) {
    // New line if last child isn't already an empty line
    if (notePage.lastChild && notePage.lastChild.innerHTML !== "<br>") {
      const div = document.createElement("div");
      div.innerHTML = "<br>";
      notePage.appendChild(div);
    }
    // Set cursor to end of note-page
    setCursorToOffset(notePage, notePage.childNodes.length);
  }
});

// Behaviour for backspace, enter, spacebar, tab
notePage.addEventListener("keydown", (event) => {
  if (event.key === "Tab") onTab(event);
  if (event.key === "Backspace") onBackspace(event);

  // Apply listener to note-page for keyboard shortcuts
  if (event.shiftKey && event.metaKey) {
    event.preventDefault();

    // Shift + Command + u -> link
    if (event.key === "u") createLink();
    // Shift + Command + x -> strikethrough
    else if (event.key === "x") toggleStrikethrough();
  }
});

// Behaviour for enter and spacebar
notePage.addEventListener("keyup", (event) => {
  if (event.key === "Enter") onEnter();
  else if (event.key === " ") onSpacebar();
});

//
function onEnter() {
  const focusNode = document.getSelection().focusNode;
  const parentElement = focusNode.parentElement;

  // Unchecked new checkbox line by default
  const li = parentElement.closest("li.checkbox.checked");
  if (li) {
    li.classList.remove("checked");
    return;
  }

  // Check if new line is empty, if so replace with <br>
  if (focusNode.textContent === "" && ["B", "I", "STRIKE", "U"].includes(focusNode.tagName)) {
    const br = document.createElement("br");
    focusNode.replaceWith(br);
    setCursorToOffset(br, 0);
  }
}

function onBackspace(event) {
  // Deletes code block pre wrapper if empty
  const codeBlock = document.querySelector("pre.code");
  if (codeBlock && codeBlock.textContent === "") {
    event.preventDefault();

    const div = document.createElement("div");
    div.innerHTML = "<br>";
    codeBlock.replaceWith(div);
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

function onTab(event) {
  event.preventDefault();

  if (false) {
  } else {
    document.execCommand("insertText", false, "\t");
  }
}
