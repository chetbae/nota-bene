import { commandMap } from "./commands.mjs";
import { createCheckboxList } from "./checkboxes.mjs";
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

// Apply correct behaviour on enter/newline for checkboxes and styled tags
function onEnter() {
  const focusNode = document.getSelection().focusNode;
  const parentElement = focusNode.parentElement;

  // Checkbox: uncheck by default, turn into checkbox if coming out of tab indent
  const checkboxUl = parentElement.closest("ul.checkbox");
  if (checkboxUl) {
    // focusNode should not be LI, text is wrapped in div -> therefore new line coming out of indent
    if (focusNode.tagName === "LI") {
      focusNode.classList.add("checkbox");
      const div = document.createElement("div");
      div.classList.add("checkbox");
      focusNode.appendChild(div);
      return;
    }

    const li = parentElement.closest("li.checkbox");
    li.classList.remove("checked");
  }

  // Check if new line is empty, if so replace with <br>
  else if (focusNode.textContent === "" && ["B", "I", "STRIKE", "U"].includes(focusNode.tagName)) {
    const br = document.createElement("br");
    focusNode.replaceWith(br);
    setCursorToOffset(br, 0);
  }
}

function onBackspace(event) {
  const focusNode = document.getSelection().focusNode;

  // If empty line in codeblock or lists, replace with unstyled empty line
  if (focusNode.textContent === "") {
    // Case 1 for lists: focusNode is root ul/ol
    if (focusNode.matches("pre.code, ul, ol")) {
      event.preventDefault();
      const div = document.createElement("div");
      div.innerHTML = "<br>";

      focusNode.replaceWith(div);
      setCursorToOffset(div, 0);
    }
    // Case 2 for lists: focusNode is li and is first child
    else if (focusNode.matches("li") && !focusNode.previousSibling) {
      event.preventDefault();
      const div = document.createElement("div");
      div.innerHTML = "<br>";

      focusNode.closest("ul, ol").replaceWith(div);
      setCursorToOffset(div, 0);
    }
    // Case 3 for lists: checkbox
    else if (
      focusNode.matches("div.checkbox") &&
      focusNode.closest("ul.checkbox").childNodes.length === 1
    ) {
      event.preventDefault();
      const div = document.createElement("div");
      div.innerHTML = "<br>";

      focusNode.closest("ul.checkbox").replaceWith(div);
      setCursorToOffset(div, 0);
    }
  }
}

function onSpacebar() {
  const selection = document.getSelection();

  // Markdown commands are at most 6 characters long, so we only need to check the first 6 characters
  const cursorIndex = selection.focusOffset;
  if (cursorIndex > 7) return;

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
  const focusNode = document.getSelection().focusNode;

  if (!focusNode.tagName) {
    document.execCommand("insertText", false, "\t");
  }

  // Checkbox List
  else if (focusNode.closest("ul.checkbox")) {
    // if focusNode is UL, it is the start of a new checkbox list so do not indent
    if (focusNode.tagName === "UL") return;
    // indent if li is not only child of ul
    const li = focusNode.closest("li.checkbox");
    if (li) {
      li.replaceWith(createCheckboxList(li.innerHTML));
    }
  }
  // Bullet List
  else if (focusNode.closest("ul")) {
    const li = focusNode.closest("li");
    if (li) commandMap["-"](li, "");
  }
  // Numbered List
  else if (focusNode.closest("ol")) {
    const li = focusNode.closest("li");
    if (li) commandMap["1."](li, "");
  }

  // If not lists, insert tab
  else document.execCommand("insertText", false, "\t");
}
