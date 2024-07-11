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
    const range = selection.getRangeAt(0);
    const nodes = Array.from(range.cloneContents().childNodes);
    for (const node of nodes) {
      if (node.nodeType !== Node.TEXT_NODE) {
        throw new Error("Non-text node in selection");
      }
    }

    const a = document.createElement("a");
    const url = prompt("Enter URL:");
    if (!url) return;

    a.href = url;
    a.title = url;
    window.getSelection().getRangeAt(0).surroundContents(a);
    a.innerHTML = url;
  } catch (error) {
    window.alert("Only plain text can be linked.");
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
