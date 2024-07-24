/**
 * Set cursor to an offset within the specific element
 * @param {Element} element
 * @param {number} offset
 */
export function setCursorToOffset(element, offset) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element, offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function createLink() {
  try {
    // Check if selection consists of only text nodes
    const selection = window.getSelection();

    if (selection.toString() === "") {
      window.alert("Empty selection.");
      return;
    }

    const range = selection.getRangeAt(0);
    const nodes = Array.from(range.cloneContents().childNodes);
    for (const node of nodes) {
      if (node.nodeType !== Node.TEXT_NODE) {
        window.alert("Only plain text can be selected.");
        return;
      }
    }

    const a = document.createElement("a");
    const url = prompt("Enter URL:");
    if (!url) return;

    a.href = url;
    a.title = url;
    a.textContent = range.toString();
    range.deleteContents();
    range.insertNode(a);
    addLinkListener(a);
  } catch (error) {
    window.alert("Something went wrong.");
  }
}

function addLinkListener(a) {
  a.addEventListener("click", (event) => {
    event.preventDefault();
    window.open(a.href, "_blank");
  });
}

export function addAllLinkListeners() {
  const links = document.querySelectorAll("a");
  links.forEach((a) => {
    addLinkListener(a);
  });
}

/**
 * Generate id for note tab
 * @returns {string} id
 */
export function genId() {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Transforms preview data to appropriate tab title.
 * No data -> "New Note"
 * Empty preview -> "(Untitled)"
 * @param {Object} data - note page data
 * @returns {string} formatted title
 */
export function previewToTitle(data) {
  const title = data ? (data.preview === "" ? "(Untitled)" : data.preview) : "New Note";
  return title;
}