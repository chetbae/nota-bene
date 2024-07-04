import { persistChrome } from "./persistance.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";
const contentContainer = document.getElementById("note-page");

// Save and load content area to/from chrome storage
persistChrome(contentContainer, CHROME_CONTENT_KEY, applyAllCheckboxListeners);

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
 * Transforms element into new type, keeping the same text content
 * @param {HTMLElement} element
 * @param {string} newType
 * @param {string} existingText
 * @returns New element
 */
function transformElement(element, newType, existingText) {
  const newElement = document.createElement(newType);
  newElement.innerHTML = existingText ? existingText : "<br>";
  element.replaceWith(newElement);
  return newElement;
}

/**
 * Create a nested list element from a given element
 * @param {HTMLElement} element
 * @param {string} type
 * @param {string} text
 * @returns New list element
 */
function createList(element, type, text) {
  const list = document.createElement(type);
  const li = document.createElement("li");
  li.innerHTML = text;
  list.appendChild(li);

  element.replaceWith(list);
  return list;
}

/**
 * Create a checkbox element list from a given element
 * @param {HTMLElement} element
 * @param {string} text
 * @returns New checkbox element
 * @todo Add checkbox functionality
 * @todo Add checkbox styling
 * @todo Add checkbox persistence
 * @todo Add checkbox functionality
 */

function createCheckboxList(element, text) {
  const checkboxList = new CheckboxList(text);
  element.replaceWith(checkboxList.getList());
  return checkboxList;
}

class CheckboxList {
  constructor(text) {
    this.list = document.createElement("div");
    this.list.classList.add("checkbox-list");
    this.addCheckboxRow(text);
  }

  addCheckboxRow(text) {
    const row = document.createElement("div");
    row.classList.add("checkbox-row");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    row.appendChild(checkbox);
    row.innerHTML += text;
    this.list.appendChild(row);
    applyCheckboxListener(row);
  }

  getList() {
    return this.list;
  }
}

function applyCheckboxListener(checkboxRow) {
  checkboxRow.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "INPUT")
      !target.checked
        ? target.removeAttribute("checked")
        : target.setAttribute("checked", "checked");
  });
}

function applyAllCheckboxListeners() {
  const checkboxes = document.querySelectorAll(".checkbox-row input");
  checkboxes.forEach((checkbox) => {
    applyCheckboxListener(checkbox);
  });
}

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

const commandMap = {
  "#": (parent, text) => transformElement(parent, "h1", text),
  "##": (parent, text) => transformElement(parent, "h2", text),
  "###": (parent, text) => transformElement(parent, "h3", text),
  "-": (parent, text) => createList(parent, "ul", text),
  "1.": (parent, text) => createList(parent, "ol", text),
  "*": (parent, text) => createList(parent, "ul", text),
  "[]": (parent, text) => createCheckboxList(parent, text),
  // "```": "code",
};

/**
 * (1) If contenteditable only has one line, the text content is not wrapped in a div. For our purposes, we need a div wrapper to apply the command.
 */
